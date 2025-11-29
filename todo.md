# CourseForge - Development Roadmap

**Status:** Core MVP Complete ✅  
**Focus:** R&D Phase + High-ROI Features  
**Last Updated:** 2025-11-29

---

## 🎯 Strategic Overview

### Core MVP (Complete ✅)
- ✅ Database infrastructure (SQLite dev / MySQL prod)
- ✅ SCORM 1.2/2004 export with compliance validation
- ✅ Quiz Editor with undo/redo (deep clone support)
- ✅ S3 storage with security hardening
- ✅ tRPC v11 end-to-end type safety
- ✅ React 19 + Vite + Tailwind v4 frontend

### Current Phase: R&D + Scale
Focus on high-ROI features that differentiate CourseForge from competitors.

---

## Phase 15: Legacy Video Remastering (R&D Priority)

### Overview
**The "Glow Up" Engine** - Transform outdated training videos into modern, professional courses by replacing old slides with AI-generated 4K graphics while preserving the original audio.

**Value Proposition:** "Give your 2015 webinar a 2025 makeover in 10 minutes."

**Target Markets:**
- Corporate L&D (refresh training libraries)
- Content Creators (upgrade old YouTube videos)
- Course Creators (transform webinars into premium courses)

---

### 15.1 Architecture
- [ ] **Design `RemasterService`** (Video + Transcript Ingestion)
  - [ ] Input validation (video format, size limits)
  - [ ] Transcript extraction (if not provided)
  - [ ] Video metadata extraction (duration, resolution, audio track)
  - [ ] Storage strategy for source files and outputs
  - [ ] Queue system for long-running remaster jobs

- [ ] **Service Structure**
  ```typescript
  interface RemasterInput {
    videoFile: File;
    transcript?: string;
    options: {
      targetResolution: '1080p' | '4K';
      slideStyle: 'corporate' | 'modern' | 'minimal';
      brandColors?: string[];
      logo?: File;
    };
  }
  ```

---

### 15.2 AI Director Agent
- [ ] **Implement "Course Forge Architect" agent** (Transcript → Visual Stream JSON)
  - [ ] Reuse existing prompt logic from SCORM generation
  - [ ] Adapt for video remastering context
  - [ ] Add visual style parameters
  - [ ] Include brand guideline inputs

- [ ] **Topic Detection Logic**
  - [ ] Use Gemini to identify natural topic boundaries
  - [ ] Analyze semantic changes in content
  - [ ] Detect slide-worthy moments (definitions, lists, diagrams)
  - [ ] Generate Visual Stream JSON with image prompts

- [ ] **Output Format**
  ```json
  {
    "visual_stream": [
      {
        "slide_id": 1,
        "timestamp_start": "00:00",
        "timestamp_end": "01:30",
        "content_summary": "Introduction to SCORM compliance",
        "nano_banana_prompt": "Professional corporate slide showing 'SCORM Compliance' as main title. 4K, navy blue and white.",
        "key_text_overlay": "SCORM Compliance Made Simple"
      }
    ]
  }
  ```

---

### 15.3 Visual Engine
- [ ] **Integrate Image Gen API** (Nano Banana/Imagen) for slide creation
  - [ ] **Primary:** Google Imagen 3 via Vertex AI
  - [ ] **Fallback:** DALL-E 3 via OpenAI
  - [ ] Aspect ratio enforcement (16:9, 3840x2160 for 4K)
  - [ ] Batch processing (generate multiple slides in parallel)
  - [ ] Quality control (text legibility, brand colors, resolution)

- [ ] **Prompt Enhancement**
  ```typescript
  function enhancePrompt(basePrompt: string, options: RemasterOptions): string {
    return `${basePrompt}. 16:9 aspect ratio. 4K resolution. ${options.slideStyle} corporate aesthetic. Color palette: ${options.brandColors.join(', ')}`;
  }
  ```

- [ ] **Post-Processing**
  - [ ] Upscaling (if needed)
  - [ ] Color correction
  - [ ] Sharpening
  - [ ] Compression (for web delivery)

---

### 15.4 Remaster UI
- [ ] **Build `RemasterEditor`** (Timeline View with Slide Overlay)
  - [ ] Video player with timeline scrubber
  - [ ] Waveform visualization (audio track)
  - [ ] Timestamp markers for topic shifts
  - [ ] Playback controls (play, pause, seek, speed)

- [ ] **Slide Track Overlay**
  - [ ] Visual representation of slide segments
  - [ ] Thumbnail previews of generated slides
  - [ ] Timestamp ranges for each slide
  - [ ] Drag-to-adjust slide timing

- [ ] **Interactive Editing**
  - [ ] Regenerate slide with same prompt
  - [ ] Edit prompt and regenerate
  - [ ] Upload custom image
  - [ ] Delete slide (extend previous/next)
  - [ ] Split slide into two
  - [ ] Merge with adjacent slide

- [ ] **Preview Mode**
  - [ ] Side-by-side comparison (original vs. remastered)
  - [ ] Full-screen preview
  - [ ] A/B toggle for quick comparison

---

### 15.5 Rendering Engine
- [ ] **FFmpeg Integration** (burn slides over original video)
  - [ ] Overlay slides at specified timestamps
  - [ ] Maintain original audio track
  - [ ] Apply transitions (fade, slide, etc.)
  - [ ] Encode to target resolution (4K, 1080p)
  - [ ] Hardware acceleration (GPU encoding)

- [ ] **Output Formats**
  - [ ] MP4 (H.264 for compatibility)
  - [ ] WebM (VP9 for web)
  - [ ] 4K and 1080p versions
  - [ ] Thumbnail generation

---

### 15.6 Database Schema
- [ ] **Add remaster-specific tables**
  ```sql
  CREATE TABLE remaster_jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT REFERENCES projects(id),
    original_video_url VARCHAR(512),
    transcript_text TEXT,
    visual_stream JSON,
    status ENUM('pending', 'processing', 'completed', 'failed'),
    progress_percentage INT DEFAULT 0,
    remastered_video_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
  );
  
  CREATE TABLE generated_slides (
    id INT PRIMARY KEY AUTO_INCREMENT,
    remaster_job_id INT REFERENCES remaster_jobs(id),
    slide_id INT,
    timestamp_start VARCHAR(20),
    timestamp_end VARCHAR(20),
    prompt TEXT,
    image_url VARCHAR(512),
    generation_provider ENUM('imagen', 'dalle3'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

---

### 15.7 Success Metrics
- [ ] Average remaster time < 5 minutes (for 10-min video)
- [ ] Slide generation accuracy > 90% (minimal manual edits)
- [ ] Customer satisfaction score > 4.5/5
- [ ] Remaster completion rate > 95%
- [ ] Average cost per minute < $0.50 (API costs)

---

### 15.8 Timeline
**Total:** ~12 weeks to production-ready remastering engine

- **Week 1-2:** Architecture design, database schema
- **Week 3-4:** AI Director Agent implementation
- **Week 5-6:** Image generation pipeline integration
- **Week 7-8:** Frontend Studio (RemasterEditor.tsx)
- **Week 9-10:** FFmpeg rendering engine
- **Week 11-12:** Testing, optimization, beta launch

---

## 🚀 Active Backlog (High-ROI Features)

### Priority 1: Learner Analytics UI
**Why:** Teachers need visibility into student progress. This is a core LMS feature.

- [ ] **Build charts for `analyticsSessions` data** (Teacher View)
  - [ ] Student progress dashboard
  - [ ] Completion rates by lesson
  - [ ] Quiz performance analytics
  - [ ] Time spent per lesson
  - [ ] Drop-off points visualization

- [ ] **Data Visualization Components**
  - [ ] Line charts (progress over time)
  - [ ] Bar charts (quiz scores)
  - [ ] Heatmaps (engagement patterns)
  - [ ] Table view (student list with filters)

- [ ] **Export Options**
  - [ ] CSV export (raw data)
  - [ ] PDF report generation
  - [ ] Email digest (weekly/monthly)

**Timeline:** 2-3 weeks  
**Impact:** High (required for corporate/education markets)

---

### Priority 2: PDF/Text Ingestion
**Why:** Not all content starts as video. Many courses come from documents.

- [ ] **Upgrade `batchImport` to accept PDFs/Docs** (not just VTTs)
  - [ ] PDF parsing (extract text and structure)
  - [ ] Word document parsing (.docx)
  - [ ] Markdown parsing
  - [ ] Plain text parsing

- [ ] **Content Structuring**
  - [ ] Auto-detect headings (H1, H2, H3)
  - [ ] Convert headings to lesson boundaries
  - [ ] Extract images from documents
  - [ ] Preserve formatting (bold, italic, lists)

- [ ] **AI Enhancement**
  - [ ] Use Gemini to improve extracted text
  - [ ] Generate slide prompts from document sections
  - [ ] Auto-create quiz questions from content

**Timeline:** 3-4 weeks  
**Impact:** High (expands use cases beyond video)

---

### Priority 3: Advanced Branding
**Why:** Corporate clients need white-label capabilities.

- [ ] **Finish Color Picker/Font Selector UI**
  - [ ] Brand color palette picker (primary, secondary, accent)
  - [ ] Font selection (Google Fonts integration)
  - [ ] Logo upload and positioning
  - [ ] Preview mode (see changes in real-time)

- [ ] **Brand Template System**
  - [ ] Save brand presets
  - [ ] Apply brand to all slides
  - [ ] Export brand guidelines (PDF)

- [ ] **White-Label Options**
  - [ ] Remove CourseForge branding (premium feature)
  - [ ] Custom domain support
  - [ ] Custom email templates

**Timeline:** 2-3 weeks  
**Impact:** Medium-High (required for enterprise sales)

---

## 📋 Phase 14: Marketing & Website (Ongoing)

### 14.1 Three-Market Strategy
- [ ] **Draft 3-way homepage copy** (Creators vs. Corporate vs. Coaches)
  - [ ] Hero section with market selector
  - [ ] Value propositions per segment
  - [ ] Tailored CTAs and social proof

### 14.2 Content Creator Funnel
- [ ] **"AdSense vs. Course" calculator** (lead magnet)
- [ ] **Identify top 50 "Edu-Tuber" targets** for beta outreach

### 14.3 Corporate Funnel
- [ ] **SCORM Compliance whitepaper** (using Phase 12b technical details)
- [ ] **LMS Integration Guide** (Moodle, Canvas, Blackboard)

### 14.4 Zoom Coach Funnel
- [ ] **Research Zoom App Marketplace** submission requirements
- [ ] **"Zoom Recording to Course" workflow** documentation

### 14.5 Website Infrastructure
- [ ] **WordPress + Elementor + MemberPress** validation
- [ ] **Three-tiered pricing** setup (Creator, Corporate, Coach)

**Timeline:** ~10 weeks (parallel with R&D)

---

## 🧊 The Icebox (Deprioritized / Future)

### Rationale
These features are valuable but not critical for initial market traction. Moving to "Future / On Hold" to maintain focus on high-ROI work.

---

### Native Mobile Apps (iOS/Android)
**Why Deprioritized:** Web-first approach is sufficient. Mobile apps require significant maintenance overhead.

**Future Consideration:**
- [ ] React Native wrapper (if demand is high)
- [ ] Progressive Web App (PWA) as interim solution

**Estimated Timeline:** 6-8 months (if prioritized)

---

### Social Learning / Forums
**Why Deprioritized:** Not a core differentiator. Existing tools (Slack, Discord) can integrate.

**Future Consideration:**
- [ ] Discussion boards per course
- [ ] Peer review system
- [ ] Community Q&A

**Estimated Timeline:** 3-4 months (if prioritized)

---

### Voice Cloning
**Why Deprioritized:** Too expensive for current pricing model. API costs are $0.10-0.50 per minute.

**Future Consideration:**
- [ ] ElevenLabs integration (if costs drop)
- [ ] Premium add-on ($50/month)
- [ ] Limited to enterprise tier

**Estimated Timeline:** 2-3 months (if prioritized)

---

### A/B Testing
**Why Deprioritized:** Premature optimization. Need baseline metrics first.

**Future Consideration:**
- [ ] A/B test slide variations
- [ ] Test quiz question effectiveness
- [ ] Optimize completion rates

**Estimated Timeline:** 2-3 months (if prioritized)

---

### Other Deprioritized Features
- [ ] **Gamification** (badges, leaderboards) - Nice-to-have, not critical
- [ ] **Live Webinar Integration** - Complex, low ROI initially
- [ ] **Multi-language UI** - English-first, expand later
- [ ] **Advanced Video Editing** - Out of scope, use external tools
- [ ] **Blockchain Certificates** - Buzzword, low demand

---

## 📊 Success Metrics (Overall)

### Phase 15 (Remastering) KPIs
- Average remaster time < 5 minutes (for 10-min video)
- Slide generation accuracy > 90%
- Customer satisfaction > 4.5/5
- Remaster completion rate > 95%

### Active Backlog KPIs
- **Learner Analytics:** 80% of teachers use analytics weekly
- **PDF Ingestion:** 30% of projects start from documents
- **Advanced Branding:** 50% of corporate clients use custom branding

### Phase 14 (Marketing) KPIs
- 3-way homepage conversion rate > 5%
- Email capture rate > 15% (lead magnets)
- Beta waitlist: 100+ signups (50 per market)

---

## 🗓️ Timeline Summary

### Q1 2025 (Current)
- **Phase 15:** Legacy Video Remastering (12 weeks)
- **Active Backlog:** Learner Analytics, PDF Ingestion, Branding (8 weeks)
- **Phase 14:** Marketing website and funnels (10 weeks, parallel)

### Q2 2025
- Beta launch with remastering engine
- Soft launch to 3 target markets
- Iterate based on user feedback

### Q3 2025
- Scale infrastructure
- Add features from Icebox (based on demand)
- Expand to additional markets

---

## 🔗 Dependencies

### Technical Dependencies (Complete ✅)
- ✅ SCORM export functionality (Phase 12b)
- ✅ Database production readiness (Phase 13)
- ✅ Quiz editor with undo/redo (Phase 13)
- ✅ S3 storage with security hardening (Phase 13)

### New Dependencies (In Progress)
- ⏳ Vertex AI / OpenAI API (image generation)
- ⏳ FFmpeg installation (video processing)
- ⏳ Large file storage (S3 optimization)

### Business Dependencies
- Pricing strategy finalized
- Legal review (terms of service, privacy policy)
- Payment processing setup (Stripe/PayPal)
- Customer support infrastructure

---

## 🎯 Competitive Positioning

**vs. Teachable/Thinkific:**
- We focus on course *creation*, they focus on course *hosting*
- AI-powered generation is 10x faster
- Export to any LMS (SCORM)

**vs. Articulate/Captivate:**
- 10x faster with AI automation
- Modern, web-based interface
- More affordable for small teams

**vs. Generic AI tools:**
- Purpose-built for course creation
- SCORM compliance out of the box
- Integrated workflow (transcript → slides → quiz → export)

**vs. Descript/Runway:**
- Descript focuses on editing, not slide generation
- Runway is generative video, not course-specific
- CourseForge is purpose-built for training/education

---

## 📁 Repository

**GitHub:** https://github.com/rfeineis/courseforge-mvp

**Status:** Core MVP Complete ✅  
**Current Focus:** Phase 15 (Remastering) + High-ROI Features

---

*Last updated: 2025-11-29*
