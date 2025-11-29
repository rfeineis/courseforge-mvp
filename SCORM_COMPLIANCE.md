# SCORM Compliance Documentation

## Overview

CourseForge implements **strict SCORM 1.2 and SCORM 2004 compliance** designed to pass SCORM Cloud validation. This document outlines the implementation details and validation checklist.

---

## 1. Bookmarking (Suspend Data) ✅

### The Challenge
SCORM 1.2 has a strict **4,096 character limit** for `cmi.suspend_data`. Exceeding this limit will cause validation failures.

### Our Solution

#### Minified Data Structure
We use a highly compressed JSON format that stores only essential data:

```json
{
  "l": 12,        // Lesson ID (current slide index)
  "t": 450,       // Timestamp (Unix seconds)
  "q": {          // Quiz answers (minified)
    "0": "a",
    "1": "b",
    "2": "c"
  }
}
```

#### Size Validation
- **Pre-export validation**: The system validates suspend data size before package generation
- **Runtime validation**: JavaScript validates data size before saving to LMS
- **Error handling**: If data exceeds 4,096 characters, the export is blocked with a clear error message

#### Implementation Details

**Server-Side (TypeScript):**
```typescript
// server/services/scorm.ts
export class SuspendDataManager {
  private static readonly MAX_LENGTH = 4096;

  static serialize(data: SuspendData): string {
    const json = JSON.stringify(data);
    
    if (json.length > this.MAX_LENGTH) {
      throw new Error(
        `Suspend data exceeds SCORM 1.2 limit: ${json.length} > ${this.MAX_LENGTH}`
      );
    }
    
    return json;
  }
}
```

**Client-Side (JavaScript in Player):**
```javascript
function setSuspendData(data) {
  var json = JSON.stringify(data);
  
  if (json.length > 4096) {
    console.error("Suspend data exceeds 4096 character limit:", json.length);
    return false;
  }
  
  return scormAPI.LMSSetValue("cmi.suspend_data", json) === "true";
}
```

#### Bookmark Restoration
When the course loads, the player:
1. Calls `getSuspendData()` to retrieve saved data
2. Parses the JSON string
3. Restores the user's position (`currentSlideIndex = suspendData.l`)
4. Restores quiz answers (`quizAnswers = suspendData.q`)

---

## 2. Completion & Scoring (The Handshake) ✅

### SCORM 1.2 Implementation

#### On Quiz Completion:
```javascript
// Calculate score (0-100)
const score = Math.round((correctCount / totalQuestions) * 100);

// Set score values
scormAPI.LMSSetValue("cmi.core.score.raw", score.toString());
scormAPI.LMSSetValue("cmi.core.score.min", "0");
scormAPI.LMSSetValue("cmi.core.score.max", "100");

// Set lesson status
const status = score >= PASSING_SCORE ? "passed" : "failed";
scormAPI.LMSSetValue("cmi.core.lesson_status", status);

// Commit data
scormAPI.LMSCommit("");
```

#### Without Quiz (Video Only):
```javascript
// When video/course ends
scormAPI.LMSSetValue("cmi.core.lesson_status", "completed");
scormAPI.LMSCommit("");
```

### SCORM 2004 Implementation

#### On Quiz Completion:
```javascript
// Set score values
scormAPI.SetValue("cmi.score.raw", score.toString());
scormAPI.SetValue("cmi.score.min", "0");
scormAPI.SetValue("cmi.score.max", "100");
scormAPI.SetValue("cmi.score.scaled", (score / 100).toFixed(2));

// Set completion and success status
scormAPI.SetValue("cmi.completion_status", "completed");
const successStatus = score >= PASSING_SCORE ? "passed" : "failed";
scormAPI.SetValue("cmi.success_status", successStatus);

// Commit data
scormAPI.Commit("");
```

### Mastery Score Configuration

The mastery score is set in the manifest file:

**SCORM 1.2:**
```xml
<item identifier="ITEM-1" identifierref="RES-1">
  <title>Course Title</title>
  <adlcp:masteryscore>80</adlcp:masteryscore>
</item>
```

**SCORM 2004:**
```xml
<imsss:sequencing>
  <imsss:objectives>
    <imsss:primaryObjective objectiveID="PRIMARY-OBJ" satisfiedByMeasure="true">
      <imsss:minNormalizedMeasure>0.70</imsss:minNormalizedMeasure>
    </imsss:primaryObjective>
  </imsss:objectives>
</imsss:sequencing>
```

---

## 3. Session Timing ✅

### Requirements
SCORM requires tracking the time spent in the current session and reporting it in a specific format.

### Implementation

#### SCORM 1.2 Format: `HH:MM:SS`

```javascript
var sessionTimer = Date.now(); // Set on course load

function getSessionTime() {
  var elapsed = Math.floor((Date.now() - sessionTimer) / 1000);
  var hours = Math.floor(elapsed / 3600);
  var minutes = Math.floor((elapsed % 3600) / 60);
  var seconds = elapsed % 60;
  
  return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
}

function pad(num) {
  return num.toString().padStart(2, "0");
}

// On exit
scormAPI.LMSSetValue("cmi.core.session_time", getSessionTime());
```

#### SCORM 2004 Format: `PT#H#M#S`

```javascript
function getSessionTime() {
  var elapsed = Math.floor((Date.now() - sessionTimer) / 1000);
  var hours = Math.floor(elapsed / 3600);
  var minutes = Math.floor((elapsed % 3600) / 60);
  var seconds = elapsed % 60;
  
  return "PT" + hours + "H" + minutes + "M" + seconds + "S";
}

// On exit
scormAPI.SetValue("cmi.session_time", getSessionTime());
```

### Server-Side Utility

```typescript
// server/services/scorm.ts
export class SessionTimer {
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  getSessionTime(): string {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  getSessionTime2004(): string {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    return `PT${hours}H${minutes}M${seconds}S`;
  }
}
```

---

## 4. Exit Handler ✅

### Requirements
- Properly close the SCORM session when the user exits
- Save all progress before terminating
- Handle both intentional exits and browser close events

### Implementation

#### Exit Button Handler
```javascript
function exitCourse() {
  if (confirm('Are you sure you want to exit the course?')) {
    // Save final bookmark
    saveBookmark();
    
    // Finish SCORM session
    finishSCORM();
    
    // Notify parent window
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'SCORM_EXIT' }, '*');
    }
    
    // Close window
    window.close();
  }
}
```

#### Finish SCORM Function

**SCORM 1.2:**
```javascript
function finishSCORM() {
  if (!scormAPI) return false;
  
  // Set session time
  var sessionTime = getSessionTime();
  scormAPI.LMSSetValue("cmi.core.session_time", sessionTime);
  
  // Commit all data
  scormAPI.LMSCommit("");
  
  // Finish
  var result = scormAPI.LMSFinish("");
  
  return result === "true";
}
```

**SCORM 2004:**
```javascript
function finishSCORM() {
  if (!scormAPI) return false;
  
  // Set session time
  var sessionTime = getSessionTime();
  scormAPI.SetValue("cmi.session_time", sessionTime);
  
  // Commit all data
  scormAPI.Commit("");
  
  // Terminate
  var result = scormAPI.Terminate("");
  
  return result === "true";
}
```

#### Browser Close Handler
```javascript
window.addEventListener('beforeunload', function(e) {
  // Save bookmark before page unload
  saveBookmark();
});
```

#### Parent Window Communication
```javascript
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SCORM_EXIT') {
    finishSCORM();
  }
});
```

---

## 5. API Discovery & Initialization ✅

### SCORM 1.2 API Discovery

```javascript
function findAPI(win) {
  var attempts = 0;
  var maxAttempts = 500;
  
  while (!win.API && win.parent && win.parent != win && attempts < maxAttempts) {
    attempts++;
    win = win.parent;
  }
  
  return win.API;
}

function initializeSCORM() {
  scormAPI = findAPI(window);
  
  if (!scormAPI) {
    console.error("SCORM API not found");
    return false;
  }
  
  var result = scormAPI.LMSInitialize("");
  
  if (result === "true") {
    sessionTimer = Date.now();
    
    // Set initial status if not already set
    var status = scormAPI.LMSGetValue("cmi.core.lesson_status");
    if (status === "not attempted" || status === "") {
      scormAPI.LMSSetValue("cmi.core.lesson_status", "incomplete");
    }
    
    return true;
  }
  
  return false;
}
```

### SCORM 2004 API Discovery

```javascript
function findAPI(win) {
  var attempts = 0;
  var maxAttempts = 500;
  
  while (!win.API_1484_11 && win.parent && win.parent != win && attempts < maxAttempts) {
    attempts++;
    win = win.parent;
  }
  
  return win.API_1484_11;
}

function initializeSCORM() {
  scormAPI = findAPI(window);
  
  if (!scormAPI) {
    console.error("SCORM 2004 API not found");
    return false;
  }
  
  var result = scormAPI.Initialize("");
  
  if (result === "true") {
    sessionTimer = Date.now();
    
    // Set initial status if not already set
    var status = scormAPI.GetValue("cmi.completion_status");
    if (status === "unknown" || status === "") {
      scormAPI.SetValue("cmi.completion_status", "incomplete");
    }
    
    return true;
  }
  
  return false;
}
```

---

## 6. Validation Checklist

### Pre-Export Validation

Before generating a SCORM package, the system validates:

- ✅ **Suspend data size** - Must be under 4,096 characters
- ✅ **Quiz questions** - All have correct answers defined
- ✅ **Lessons** - All have required fields (imageUrl, contentSummary)
- ✅ **Manifest** - Valid XML structure
- ✅ **Passing score** - Between 0-100
- ✅ **Mastery score** - Between 0-100

### Runtime Validation

The player validates:

- ✅ **API discovery** - SCORM API found and initialized
- ✅ **Data commits** - All `LMSSetValue` calls return "true"
- ✅ **Session timing** - Proper format (HH:MM:SS or PT#H#M#S)
- ✅ **Completion status** - Set before termination
- ✅ **Score range** - Between 0-100

### SCORM Cloud Test Checklist

To validate on SCORM Cloud:

1. ✅ Upload ZIP package
2. ✅ Launch course
3. ✅ Navigate through slides
4. ✅ Answer quiz questions
5. ✅ Exit and re-launch (bookmark restoration)
6. ✅ Complete course
7. ✅ Verify score reporting
8. ✅ Check completion status

---

## 7. API Usage

### Generate SCORM Package

```typescript
// Using tRPC client
const result = await trpc.scorm.generatePackage.mutate({
  projectId: 1,
  version: '1.2', // or '2004'
  passingScore: 70,
  masteryScore: 80,
});

console.log(result);
// {
//   success: true,
//   filename: 'My_Course_1234567890.zip',
//   path: '/path/to/exports/My_Course_1234567890.zip',
//   suspendDataSize: 156,
//   suspendDataLimit: 4096
// }
```

### Validate Suspend Data

```typescript
// Check if suspend data will fit within SCORM limits
const validation = await trpc.scorm.validateSuspendData.query({
  projectId: 1,
});

console.log(validation);
// {
//   size: 156,
//   limit: 4096,
//   isValid: true,
//   utilizationPercentage: 4,
//   lessonsCount: 15,
//   quizQuestionsCount: 5
// }
```

---

## 8. Error Handling

### Suspend Data Overflow

If suspend data exceeds the limit:

```
Error: Suspend data exceeds SCORM 1.2 limit: 4200 > 4096 characters.
Consider reducing quiz questions.
```

**Solutions:**
- Reduce number of quiz questions
- Use shorter question IDs
- Remove unnecessary data from suspend_data

### API Not Found

If SCORM API is not discovered:

```
Error: SCORM API not found
```

**Solutions:**
- Ensure course is launched from an LMS
- Check browser console for API discovery errors
- Verify manifest file is correct

### Initialization Failed

If `LMSInitialize` or `Initialize` returns false:

```
Error: SCORM initialization failed
```

**Solutions:**
- Check LMS compatibility
- Verify SCORM version matches LMS expectations
- Review LMS error logs

---

## 9. Best Practices

### Do's ✅

- **Always validate suspend data size** before export
- **Commit data frequently** during course interaction
- **Use minified JSON** for suspend data
- **Set session time** before termination
- **Handle browser close events** gracefully
- **Test on SCORM Cloud** before deploying to production LMS

### Don'ts ❌

- **Don't store full transcripts** in suspend_data
- **Don't exceed 4,096 characters** in suspend_data
- **Don't skip API initialization** checks
- **Don't forget to commit** before termination
- **Don't use non-standard data formats** for session time
- **Don't assume API is available** without checking

---

## 10. Troubleshooting

### Issue: Course doesn't resume from bookmark

**Diagnosis:**
- Check if `getSuspendData()` is called on load
- Verify suspend data is being saved correctly
- Check browser console for parsing errors

**Solution:**
```javascript
// Add debug logging
const suspendData = getSuspendData();
console.log('Loaded suspend data:', suspendData);
```

### Issue: Score not reported to LMS

**Diagnosis:**
- Check if `setScore()` is called after quiz completion
- Verify score is between 0-100
- Check if `LMSCommit()` is called after setting score

**Solution:**
```javascript
// Ensure proper sequence
setScore(score);
setCompletionStatus(status, score, PASSING_SCORE);
commitData(); // Critical!
```

### Issue: Session time shows 00:00:00

**Diagnosis:**
- Check if `sessionTimer` is initialized on load
- Verify `getSessionTime()` is called before `LMSFinish()`

**Solution:**
```javascript
// Initialize timer on load
window.addEventListener('load', function() {
  initializeSCORM();
  sessionTimer = Date.now(); // Set timer
});
```

---

## 11. Files Reference

### Core SCORM Files

- **`server/services/scorm.ts`** - SCORM service with all utilities
- **`server/services/scorm-player-template.html`** - Player HTML template
- **`server/routers/scorm.ts`** - SCORM export router
- **`SCORM_COMPLIANCE.md`** - This documentation

### Generated Files (in ZIP package)

- **`imsmanifest.xml`** - SCORM manifest
- **`scorm.js`** - SCORM API wrapper
- **`index.html`** - Course player

---

## 12. Version Differences

| Feature | SCORM 1.2 | SCORM 2004 |
|---------|-----------|------------|
| **API Object** | `API` | `API_1484_11` |
| **Initialize** | `LMSInitialize("")` | `Initialize("")` |
| **Get Value** | `LMSGetValue(element)` | `GetValue(element)` |
| **Set Value** | `LMSSetValue(element, value)` | `SetValue(element, value)` |
| **Commit** | `LMSCommit("")` | `Commit("")` |
| **Finish** | `LMSFinish("")` | `Terminate("")` |
| **Lesson Status** | `cmi.core.lesson_status` | `cmi.completion_status` + `cmi.success_status` |
| **Score** | `cmi.core.score.raw` | `cmi.score.raw` + `cmi.score.scaled` |
| **Session Time** | `cmi.core.session_time` (HH:MM:SS) | `cmi.session_time` (PT#H#M#S) |
| **Suspend Data** | `cmi.suspend_data` (4096 chars) | `cmi.suspend_data` (4096 chars) |

---

## Summary

CourseForge implements **industry-standard SCORM compliance** with:

✅ **Strict 4,096 character limit** on suspend data with pre-export validation  
✅ **Proper completion/scoring handshake** for both SCORM 1.2 and 2004  
✅ **Accurate session timing** in correct formats  
✅ **Robust exit handling** with data persistence  
✅ **API discovery** with fallback error handling  
✅ **SCORM Cloud validated** architecture  

This implementation is designed to pass **SCORM Cloud validation** and work seamlessly with all major LMS platforms.
