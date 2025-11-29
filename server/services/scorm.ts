/**
 * SCORM Compliance Service
 * Ensures strict adherence to SCORM 1.2 and SCORM 2004 standards
 * Designed to pass SCORM Cloud validation
 */

import AdmZip from 'adm-zip';
import path from 'path';

/**
 * SCORM Version Enum
 */
export enum SCORMVersion {
  SCORM_1_2 = '1.2',
  SCORM_2004 = '2004',
}

/**
 * Minified Suspend Data Structure
 * CRITICAL: Must stay under 4,096 characters for SCORM 1.2
 */
export interface SuspendData {
  l: number; // Lesson ID (current slide)
  t: number; // Timestamp in seconds
  q: Record<string, string>; // Quiz answers (questionId: answer)
}

/**
 * SCORM Configuration
 */
export interface SCORMConfig {
  version: SCORMVersion;
  courseTitle: string;
  courseDescription: string;
  passingScore: number; // Percentage (0-100)
  masteryScore: number; // Percentage (0-100)
  maxTimeAllowed?: string; // Format: HH:MM:SS
}

/**
 * Session Timing Utilities
 */
export class SessionTimer {
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Get session time in SCORM format (HH:MM:SS)
   */
  getSessionTime(): string {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  /**
   * Get session time in SCORM 2004 format (PT#H#M#S)
   */
  getSessionTime2004(): string {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    return `PT${hours}H${minutes}M${seconds}S`;
  }

  private pad(num: number): string {
    return num.toString().padStart(2, '0');
  }
}

/**
 * Suspend Data Manager
 * Handles minification and validation of bookmark data
 */
export class SuspendDataManager {
  private static readonly MAX_LENGTH = 4096;

  /**
   * Serialize suspend data to minified JSON
   * @throws Error if data exceeds SCORM 1.2 limit
   */
  static serialize(data: SuspendData): string {
    const json = JSON.stringify(data);

    if (json.length > this.MAX_LENGTH) {
      throw new Error(
        `Suspend data exceeds SCORM 1.2 limit: ${json.length} > ${this.MAX_LENGTH} characters`
      );
    }

    return json;
  }

  /**
   * Deserialize suspend data from JSON string
   */
  static deserialize(json: string): SuspendData | null {
    if (!json || json.trim() === '') {
      return null;
    }

    try {
      const data = JSON.parse(json) as SuspendData;
      return data;
    } catch (error) {
      console.error('Failed to parse suspend data:', error);
      return null;
    }
  }

  /**
   * Validate suspend data size
   */
  static validate(data: SuspendData): boolean {
    try {
      const json = JSON.stringify(data);
      return json.length <= this.MAX_LENGTH;
    } catch {
      return false;
    }
  }

  /**
   * Get current data size in characters
   */
  static getSize(data: SuspendData): number {
    return JSON.stringify(data).length;
  }
}

/**
 * SCORM Completion Status
 */
export enum CompletionStatus {
  COMPLETED = 'completed',
  INCOMPLETE = 'incomplete',
  PASSED = 'passed',
  FAILED = 'failed',
  BROWSED = 'browsed',
  NOT_ATTEMPTED = 'not attempted',
}

/**
 * Score Calculator
 */
export class ScoreCalculator {
  /**
   * Calculate score based on quiz answers
   * @param answers User's answers
   * @param correctAnswers Correct answers
   * @returns Score as percentage (0-100)
   */
  static calculateScore(
    answers: Record<string, string>,
    correctAnswers: Record<string, string>
  ): number {
    const totalQuestions = Object.keys(correctAnswers).length;

    if (totalQuestions === 0) {
      return 0;
    }

    let correctCount = 0;

    for (const [questionId, correctAnswer] of Object.entries(correctAnswers)) {
      if (answers[questionId] === correctAnswer) {
        correctCount++;
      }
    }

    return Math.round((correctCount / totalQuestions) * 100);
  }

  /**
   * Determine completion status based on score
   */
  static getCompletionStatus(
    score: number,
    passingScore: number,
    hasQuiz: boolean
  ): CompletionStatus {
    if (!hasQuiz) {
      return CompletionStatus.COMPLETED;
    }

    return score >= passingScore
      ? CompletionStatus.PASSED
      : CompletionStatus.FAILED;
  }
}

/**
 * SCORM API Wrapper Generator
 * Generates JavaScript code for SCORM API communication
 */
export class SCORMAPIWrapper {
  /**
   * Generate SCORM 1.2 API wrapper
   */
  static generateSCORM12Wrapper(): string {
    return `
// SCORM 1.2 API Wrapper
var scormAPI = null;
var sessionTimer = null;

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

function getSuspendData() {
  if (!scormAPI) return null;
  
  var data = scormAPI.LMSGetValue("cmi.suspend_data");
  
  if (!data || data === "") return null;
  
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse suspend data:", e);
    return null;
  }
}

function setSuspendData(data) {
  if (!scormAPI) return false;
  
  var json = JSON.stringify(data);
  
  if (json.length > 4096) {
    console.error("Suspend data exceeds 4096 character limit:", json.length);
    return false;
  }
  
  return scormAPI.LMSSetValue("cmi.suspend_data", json) === "true";
}

function setScore(score) {
  if (!scormAPI) return false;
  
  scormAPI.LMSSetValue("cmi.core.score.raw", score.toString());
  scormAPI.LMSSetValue("cmi.core.score.min", "0");
  scormAPI.LMSSetValue("cmi.core.score.max", "100");
  
  return true;
}

function setCompletionStatus(status, score, passingScore) {
  if (!scormAPI) return false;
  
  var lessonStatus = status;
  
  // Determine lesson_status based on score if quiz exists
  if (score !== null && score !== undefined) {
    lessonStatus = score >= passingScore ? "passed" : "failed";
  }
  
  scormAPI.LMSSetValue("cmi.core.lesson_status", lessonStatus);
  
  return true;
}

function getSessionTime() {
  if (!sessionTimer) return "00:00:00";
  
  var elapsed = Math.floor((Date.now() - sessionTimer) / 1000);
  var hours = Math.floor(elapsed / 3600);
  var minutes = Math.floor((elapsed % 3600) / 60);
  var seconds = elapsed % 60;
  
  return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
}

function pad(num) {
  return num.toString().padStart(2, "0");
}

function commitData() {
  if (!scormAPI) return false;
  
  return scormAPI.LMSCommit("") === "true";
}

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

// Initialize on load
window.addEventListener("load", function() {
  initializeSCORM();
});

// Handle page unload
window.addEventListener("beforeunload", function() {
  commitData();
});
`;
  }

  /**
   * Generate SCORM 2004 API wrapper
   */
  static generateSCORM2004Wrapper(): string {
    return `
// SCORM 2004 API Wrapper
var scormAPI = null;
var sessionTimer = null;

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

function getSuspendData() {
  if (!scormAPI) return null;
  
  var data = scormAPI.GetValue("cmi.suspend_data");
  
  if (!data || data === "") return null;
  
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse suspend data:", e);
    return null;
  }
}

function setSuspendData(data) {
  if (!scormAPI) return false;
  
  var json = JSON.stringify(data);
  
  if (json.length > 4096) {
    console.error("Suspend data exceeds 4096 character limit:", json.length);
    return false;
  }
  
  return scormAPI.SetValue("cmi.suspend_data", json) === "true";
}

function setScore(score) {
  if (!scormAPI) return false;
  
  scormAPI.SetValue("cmi.score.raw", score.toString());
  scormAPI.SetValue("cmi.score.min", "0");
  scormAPI.SetValue("cmi.score.max", "100");
  scormAPI.SetValue("cmi.score.scaled", (score / 100).toFixed(2));
  
  return true;
}

function setCompletionStatus(status, score, passingScore) {
  if (!scormAPI) return false;
  
  // Set completion status
  var completionStatus = status === "passed" || status === "failed" ? "completed" : status;
  scormAPI.SetValue("cmi.completion_status", completionStatus);
  
  // Set success status if quiz exists
  if (score !== null && score !== undefined) {
    var successStatus = score >= passingScore ? "passed" : "failed";
    scormAPI.SetValue("cmi.success_status", successStatus);
  }
  
  return true;
}

function getSessionTime() {
  if (!sessionTimer) return "PT0H0M0S";
  
  var elapsed = Math.floor((Date.now() - sessionTimer) / 1000);
  var hours = Math.floor(elapsed / 3600);
  var minutes = Math.floor((elapsed % 3600) / 60);
  var seconds = elapsed % 60;
  
  return "PT" + hours + "H" + minutes + "M" + seconds + "S";
}

function commitData() {
  if (!scormAPI) return false;
  
  return scormAPI.Commit("") === "true";
}

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

// Initialize on load
window.addEventListener("load", function() {
  initializeSCORM();
});

// Handle page unload
window.addEventListener("beforeunload", function() {
  commitData();
});
`;
  }
}

/**
 * SCORM Package Generator
 */
export class SCORMPackageGenerator {
  /**
   * Generate imsmanifest.xml for SCORM 1.2
   */
  static generateManifestSCORM12(config: SCORMConfig): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="com.courseforge.${Date.now()}" version="1.0"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                              http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  
  <organizations default="ORG-1">
    <organization identifier="ORG-1">
      <title>${this.escapeXml(config.courseTitle)}</title>
      <item identifier="ITEM-1" identifierref="RES-1">
        <title>${this.escapeXml(config.courseTitle)}</title>
        <adlcp:masteryscore>${config.masteryScore}</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  
  <resources>
    <resource identifier="RES-1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      <file href="scorm.js"/>
    </resource>
  </resources>
  
</manifest>`;
  }

  /**
   * Generate imsmanifest.xml for SCORM 2004
   */
  static generateManifestSCORM2004(config: SCORMConfig): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="com.courseforge.${Date.now()}" version="1.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
          xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
          xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
                              http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd
                              http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd
                              http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd
                              http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd">
  
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  
  <organizations default="ORG-1">
    <organization identifier="ORG-1">
      <title>${this.escapeXml(config.courseTitle)}</title>
      <item identifier="ITEM-1" identifierref="RES-1">
        <title>${this.escapeXml(config.courseTitle)}</title>
        <imsss:sequencing>
          <imsss:objectives>
            <imsss:primaryObjective objectiveID="PRIMARY-OBJ" satisfiedByMeasure="true">
              <imsss:minNormalizedMeasure>${(config.passingScore / 100).toFixed(2)}</imsss:minNormalizedMeasure>
            </imsss:primaryObjective>
          </imsss:objectives>
        </imsss:sequencing>
      </item>
    </organization>
  </organizations>
  
  <resources>
    <resource identifier="RES-1" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html"/>
      <file href="scorm.js"/>
    </resource>
  </resources>
  
</manifest>`;
  }

  /**
   * Escape XML special characters
   */
  private static escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Create SCORM package ZIP
   */
  static async createPackage(
    config: SCORMConfig,
    htmlContent: string,
    outputPath: string
  ): Promise<void> {
    const zip = new AdmZip();

    // Generate manifest
    const manifest =
      config.version === SCORMVersion.SCORM_1_2
        ? this.generateManifestSCORM12(config)
        : this.generateManifestSCORM2004(config);

    // Generate SCORM API wrapper
    const scormJS =
      config.version === SCORMVersion.SCORM_1_2
        ? SCORMAPIWrapper.generateSCORM12Wrapper()
        : SCORMAPIWrapper.generateSCORM2004Wrapper();

    // Add files to ZIP
    zip.addFile('imsmanifest.xml', Buffer.from(manifest, 'utf-8'));
    zip.addFile('scorm.js', Buffer.from(scormJS, 'utf-8'));
    zip.addFile('index.html', Buffer.from(htmlContent, 'utf-8'));

    // Write ZIP file
    zip.writeZip(outputPath);
  }
}

/**
 * Export all utilities
 */
export {
  SessionTimer,
  SuspendDataManager,
  ScoreCalculator,
  SCORMAPIWrapper,
  SCORMPackageGenerator,
};
