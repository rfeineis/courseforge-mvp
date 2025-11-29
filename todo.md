# CourseForge - Development Roadmap

## Phase 14: Marketing & Website Architecture (Preparation)

### Overview
Preparing for market launch targeting three specific markets: YouTubers, Corporate, and Zoom Coaches.

---

### 14.1 Define "Splitter" Strategy
- [ ] **Draft copy for the 3-way homepage** (Creators vs. Corporate vs. Coaches)
  - [ ] Hero section with market selector
  - [ ] Value proposition for each segment
  - [ ] CTA buttons for each funnel
  - [ ] Social proof tailored to each market

---

### 14.2 Content Creator Funnel

#### Lead Magnet Development
- [ ] **Draft "AdSense vs. Course" calculator logic** (for lead magnet)
  - [ ] Input fields: Monthly views, CPM, niche, subscriber count
  - [ ] Calculate current AdSense revenue
  - [ ] Project course revenue (based on conversion rates)
  - [ ] Show ROI comparison
  - [ ] Email capture for full report

#### Beta Outreach
- [ ] **Identify top 50 "Edu-Tuber" targets** for beta outreach
  - [ ] Research educational YouTube channels (100k-1M subscribers)
  - [ ] Filter by niche (tech, business, design, productivity)
  - [ ] Create outreach spreadsheet with contact info
  - [ ] Draft personalized outreach email template
  - [ ] Set up beta program landing page

---

### 14.3 Corporate Funnel

#### Content Marketing
- [ ] **Create "SCORM Compliance" whitepaper/PDF** (using our Phase 12b technical details)
  - [ ] Executive summary
  - [ ] SCORM 1.2 vs 2004 comparison
  - [ ] Compliance checklist
  - [ ] Implementation guide
  - [ ] Case studies (if available)
  - [ ] Download gate with email capture

#### Additional Corporate Assets
- [ ] **LMS Integration Guide**
  - [ ] Moodle integration steps
  - [ ] Canvas integration steps
  - [ ] Blackboard integration steps
  - [ ] SCORM Cloud validation guide

- [ ] **Enterprise Feature Sheet**
  - [ ] Bulk user management
  - [ ] SSO integration
  - [ ] Custom branding
  - [ ] Analytics and reporting
  - [ ] SLA and support tiers

---

### 14.4 Zoom Coach Funnel

#### Zoom Integration Research
- [ ] **Research Zoom App Marketplace submission requirements**
  - [ ] Review Zoom Apps SDK documentation
  - [ ] Identify required OAuth scopes
  - [ ] Understand approval process timeline
  - [ ] Check compliance requirements
  - [ ] Review app listing guidelines

#### Workflow Documentation
- [ ] **Draft "Zoom Recording to Course" workflow documentation**
  - [ ] Step 1: Connect Zoom account
  - [ ] Step 2: Select recording
  - [ ] Step 3: Auto-transcribe with Gemini
  - [ ] Step 4: Generate slides from transcript
  - [ ] Step 5: Add quiz questions
  - [ ] Step 6: Publish course
  - [ ] Include screenshots and video walkthrough

#### Coach-Specific Features
- [ ] **Define coach-specific features**
  - [ ] Webinar replay packaging
  - [ ] Drip content scheduling
  - [ ] Student progress tracking
  - [ ] Certificate generation
  - [ ] Payment integration (Stripe/PayPal)

---

### 14.5 Website Tech Stack Validation

#### Platform Selection
- [ ] **Validate WordPress + Elementor + MemberPress** can handle "Three Tiered Pricing"
  - [ ] Test pricing table creation
  - [ ] Verify plan switching functionality
  - [ ] Test payment gateway integration
  - [ ] Check mobile responsiveness
  - [ ] Validate SEO capabilities

#### Pricing Tiers Research
- [ ] **Define pricing structure**
  - [ ] **Creator Plan**
    - Monthly price point
    - Feature limits (projects, storage, exports)
    - Target: Solo creators, educators
  - [ ] **Corporate Plan**
    - Monthly/annual pricing
    - Enterprise features (SSO, bulk users, custom branding)
    - Target: Training departments, HR teams
  - [ ] **Coach Plan**
    - Monthly price point
    - Zoom integration, drip content, certificates
    - Target: Online coaches, consultants

#### Website Infrastructure
- [ ] **Set up hosting environment**
  - [ ] Choose hosting provider (WP Engine, Kinsta, or Cloudways)
  - [ ] Configure CDN (Cloudflare)
  - [ ] Set up SSL certificate
  - [ ] Configure backup system
  - [ ] Set up staging environment

- [ ] **Install and configure plugins**
  - [ ] Elementor Pro
  - [ ] MemberPress
  - [ ] WooCommerce (if needed)
  - [ ] SEO plugin (Yoast or Rank Math)
  - [ ] Analytics (Google Analytics, Hotjar)
  - [ ] Email marketing integration (ConvertKit, Mailchimp)

---

### 14.6 Marketing Assets

#### Visual Assets
- [ ] **Design marketing materials**
  - [ ] Logo and brand guidelines
  - [ ] Social media templates
  - [ ] Email templates
  - [ ] Presentation deck
  - [ ] Demo video script

#### Content Strategy
- [ ] **Blog content calendar**
  - [ ] "How to monetize YouTube with courses" (Creator)
  - [ ] "SCORM compliance made easy" (Corporate)
  - [ ] "Turn Zoom recordings into revenue" (Coach)
  - [ ] SEO keyword research for each market

#### Social Proof
- [ ] **Collect testimonials and case studies**
  - [ ] Beta user testimonials
  - [ ] Before/after metrics
  - [ ] Video testimonials
  - [ ] Logo wall (if corporate clients)

---

### 14.7 Launch Preparation

#### Pre-Launch Checklist
- [ ] **Set up analytics and tracking**
  - [ ] Google Analytics 4
  - [ ] Facebook Pixel
  - [ ] LinkedIn Insight Tag
  - [ ] Conversion tracking

- [ ] **Email sequences**
  - [ ] Welcome sequence (for each market)
  - [ ] Onboarding sequence
  - [ ] Nurture sequence
  - [ ] Re-engagement sequence

- [ ] **Support infrastructure**
  - [ ] Knowledge base articles
  - [ ] FAQ page
  - [ ] Support ticket system
  - [ ] Live chat (Intercom, Drift)

#### Go-to-Market Strategy
- [ ] **Launch timeline**
  - [ ] Soft launch (beta users)
  - [ ] Product Hunt launch
  - [ ] Social media announcement
  - [ ] Email blast to waitlist
  - [ ] Paid advertising (if budget allows)

---

## Notes

### Market Segmentation Rationale

**YouTubers/Creators:**
- Pain point: AdSense revenue is unpredictable and declining
- Solution: Turn existing content into courses for recurring revenue
- Key feature: YouTube transcript import, auto-slide generation

**Corporate:**
- Pain point: Expensive LMS implementations, SCORM compliance headaches
- Solution: Fast, compliant course creation with SCORM export
- Key feature: SCORM 1.2/2004 compliance, enterprise features

**Zoom Coaches:**
- Pain point: Manual course creation from webinar recordings
- Solution: Automated course generation from Zoom recordings
- Key feature: Zoom integration, drip content, certificates

### Competitive Positioning

**vs. Teachable/Thinkific:**
- We focus on course *creation*, they focus on course *hosting*
- Our AI-powered generation is faster
- We export to any LMS (SCORM)

**vs. Articulate/Captivate:**
- We're 10x faster with AI automation
- Modern, web-based interface
- More affordable for small teams

**vs. Generic AI tools:**
- We're purpose-built for course creation
- SCORM compliance out of the box
- Integrated workflow (transcript → slides → quiz → export)

---

## Success Metrics

### Phase 14 KPIs
- [ ] 3-way homepage conversion rate > 5%
- [ ] Email capture rate > 15% (lead magnets)
- [ ] Beta waitlist: 100+ signups (50 per market)
- [ ] SCORM whitepaper downloads: 50+
- [ ] Zoom integration research complete
- [ ] Pricing validated with 10+ user interviews

---

## Timeline Estimate

- **Week 1-2:** Copy writing, asset creation
- **Week 3-4:** Website development (WordPress setup)
- **Week 5-6:** Lead magnet development, beta outreach
- **Week 7-8:** Content creation, SEO optimization
- **Week 9-10:** Testing, refinement, soft launch prep

**Total:** ~10 weeks to market-ready website and marketing assets

---

## Dependencies

### Technical Dependencies
- SCORM export functionality (Phase 12b) ✅ Complete
- Database production readiness ✅ Complete
- Quiz editor with undo/redo ✅ Complete

### Business Dependencies
- Pricing strategy finalized
- Legal review (terms of service, privacy policy)
- Payment processing setup (Stripe/PayPal)
- Customer support infrastructure

---

## Next Steps

1. **Immediate:** Draft 3-way homepage copy
2. **This week:** Research top 50 Edu-Tubers
3. **Next week:** Create SCORM whitepaper outline
4. **Month 1:** Complete all Phase 14 tasks
5. **Month 2:** Soft launch with beta users

---

*Last updated: 2025-11-29*


---

## Phase 15: Legacy Video Remastering (The "Glow Up" Engine)

### Overview
Transform outdated training videos into modern, professional courses by replacing old slides with AI-generated 4K graphics while preserving the original audio and content.

**Value Proposition:** "Give your 2015 webinar a 2025 makeover in 10 minutes."

---

### 15.1 Architecture Design

#### RemasterService
- [ ] **Design the `RemasterService` to ingest a video file + transcript**
  - [ ] Input validation (video format, size limits)
  - [ ] Transcript extraction (if not provided)
  - [ ] Video metadata extraction (duration, resolution, audio track)
  - [ ] Storage strategy for source files and outputs
  - [ ] Queue system for long-running remaster jobs

#### Service Structure
- [ ] **Create service architecture**
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
  
  interface RemasterOutput {
    remasteredVideo: string;  // URL to final video
    slideImages: string[];    // URLs to generated slides
    visualStream: VisualStreamItem[];
    processingTime: number;
  }
  ```

---

### 15.2 AI Director Agent

#### Course Forge Architect Integration
- [ ] **Implement the "Course Forge Architect" prompt logic**
  - [ ] Reuse existing prompt from SCORM generation
  - [ ] Adapt for video remastering context
  - [ ] Add visual style parameters
  - [ ] Include brand guideline inputs

#### Topic Detection Logic
- [ ] **Analyze transcript → Detect topic shifts → Output "Visual Stream" JSON**
  - [ ] **Topic Shift Detection:**
    - [ ] Use Gemini to identify natural topic boundaries
    - [ ] Analyze semantic changes in content
    - [ ] Detect speaker transitions (if multiple speakers)
    - [ ] Identify slide-worthy moments (definitions, lists, diagrams)
  
  - [ ] **Visual Stream Generation:**
    ```json
    {
      "visual_stream": [
        {
          "slide_id": 1,
          "timestamp_start": "00:00",
          "timestamp_end": "01:30",
          "content_summary": "Introduction to SCORM compliance",
          "nano_banana_prompt": "Professional corporate slide showing 'SCORM Compliance' as main title with abstract network connections in background. High fidelity, 4K resolution, modern minimalist aesthetic. Color scheme: navy blue and white.",
          "visual_reasoning": "Opening slide needs to establish authority and professionalism",
          "key_text_overlay": "SCORM Compliance Made Simple"
        }
      ]
    }
    ```

#### AI Director Configuration
- [ ] **Prompt engineering for visual consistency**
  - [ ] Style guide enforcement across all slides
  - [ ] Brand color consistency
  - [ ] Typography standards
  - [ ] Layout templates (title slide, content slide, diagram slide)

---

### 15.3 Image Generation Pipeline

#### API Integration
- [ ] **Integrate "Nano Banana Pro" (Google Imagen / DALL-E 3) API**
  - [ ] **Primary:** Google Imagen 3 via Vertex AI
    - [ ] Set up Vertex AI credentials
    - [ ] Implement rate limiting
    - [ ] Handle quota management
    - [ ] Error handling and retries
  
  - [ ] **Fallback:** DALL-E 3 via OpenAI
    - [ ] Configure OpenAI API client
    - [ ] Implement prompt optimization for DALL-E
    - [ ] Handle style consistency differences

#### Generation Logic
- [ ] **Auto-generate 4K 16:9 slides based on Visual Stream prompts**
  - [ ] **Aspect Ratio Enforcement:** 16:9 (3840x2160 for 4K, 1920x1080 for HD)
  - [ ] **Batch Processing:** Generate multiple slides in parallel
  - [ ] **Quality Control:**
    - [ ] Text legibility check (OCR verification)
    - [ ] Brand color validation
    - [ ] Resolution verification
    - [ ] Aspect ratio validation
  
  - [ ] **Prompt Enhancement:**
    ```typescript
    function enhancePrompt(basePrompt: string, options: RemasterOptions): string {
      const aspectRatio = "16:9 aspect ratio, horizontal orientation";
      const resolution = "4K resolution, ultra high definition";
      const style = `${options.slideStyle} corporate aesthetic`;
      const colors = options.brandColors 
        ? `Color palette: ${options.brandColors.join(', ')}` 
        : '';
      
      return `${basePrompt}. ${aspectRatio}. ${resolution}. ${style}. ${colors}`;
    }
    ```

#### Post-Processing
- [ ] **Image optimization and enhancement**
  - [ ] Upscaling (if needed)
  - [ ] Color correction
  - [ ] Sharpening
  - [ ] Compression (for web delivery)
  - [ ] Watermark addition (optional)

---

### 15.4 Frontend Studio (RemasterEditor.tsx)

#### Timeline View
- [ ] **Build a "Timeline View" showing the original video track**
  - [ ] Video player with timeline scrubber
  - [ ] Waveform visualization (audio track)
  - [ ] Timestamp markers for topic shifts
  - [ ] Playback controls (play, pause, seek)
  - [ ] Speed controls (0.5x, 1x, 1.5x, 2x)

#### Slide Track Overlay
- [ ] **Overlay the generated "Slide Track" on top**
  - [ ] Visual representation of slide segments
  - [ ] Thumbnail previews of generated slides
  - [ ] Timestamp ranges for each slide
  - [ ] Transition indicators
  - [ ] Drag-to-adjust slide timing

#### Interactive Editing
- [ ] **Allow swapping/regenerating individual slides**
  - [ ] **Slide Actions:**
    - [ ] Regenerate with same prompt
    - [ ] Edit prompt and regenerate
    - [ ] Upload custom image
    - [ ] Delete slide (extend previous/next)
    - [ ] Split slide into two
    - [ ] Merge with adjacent slide
  
  - [ ] **UI Components:**
    ```tsx
    interface SlideEditorProps {
      slide: VisualStreamItem;
      onRegenerate: (slideId: number, newPrompt?: string) => void;
      onReplace: (slideId: number, imageFile: File) => void;
      onDelete: (slideId: number) => void;
      onTimingAdjust: (slideId: number, start: number, end: number) => void;
    }
    ```

#### Preview Mode
- [ ] **Real-time preview of remastered video**
  - [ ] Side-by-side comparison (original vs. remastered)
  - [ ] Full-screen preview
  - [ ] Export preview (low-res for speed)
  - [ ] A/B toggle for quick comparison

---

### 15.5 Rendering Engine

#### FFmpeg Integration
- [ ] **Use `ffmpeg` to burn the new slides over the old video (keeping original audio)**
  - [ ] **Video Composition Strategy:**
    ```bash
    # Pseudocode for ffmpeg command
    ffmpeg -i original_video.mp4 \
           -i slide_001.png -i slide_002.png -i slide_003.png \
           -filter_complex "[0:v][1:v]overlay=enable='between(t,0,90)'[v1]; \
                            [v1][2:v]overlay=enable='between(t,90,180)'[v2]; \
                            [v2][3:v]overlay=enable='between(t,180,270)'[out]" \
           -map "[out]" -map 0:a \
           -c:v libx264 -preset slow -crf 18 \
           -c:a copy \
           output.mp4
    ```

#### Rendering Pipeline
- [ ] **Implement rendering service**
  - [ ] **Input Preparation:**
    - [ ] Extract audio from original video
    - [ ] Prepare slide images with correct timing
    - [ ] Generate transition effects (optional)
  
  - [ ] **Rendering Process:**
    - [ ] Overlay slides at specified timestamps
    - [ ] Maintain original audio track
    - [ ] Apply transitions (fade, slide, etc.)
    - [ ] Encode to target resolution
    - [ ] Optimize for web streaming
  
  - [ ] **Output Formats:**
    - [ ] MP4 (H.264 for compatibility)
    - [ ] WebM (VP9 for web)
    - [ ] 4K and 1080p versions
    - [ ] Thumbnail generation

#### Performance Optimization
- [ ] **Rendering optimization**
  - [ ] Hardware acceleration (GPU encoding)
  - [ ] Parallel processing for multiple videos
  - [ ] Progress tracking and estimation
  - [ ] Resume capability for failed renders
  - [ ] Queue management for batch jobs

---

### 15.6 Additional Features

#### Brand Consistency
- [ ] **Brand asset management**
  - [ ] Logo placement (corner watermark)
  - [ ] Color palette enforcement
  - [ ] Font selection and consistency
  - [ ] Template library (title slides, end cards)

#### Quality Assurance
- [ ] **Automated QA checks**
  - [ ] Text legibility verification
  - [ ] Audio sync validation
  - [ ] Resolution verification
  - [ ] Color accuracy check
  - [ ] File size optimization

#### Export Options
- [ ] **Multiple export formats**
  - [ ] Video formats (MP4, WebM, MOV)
  - [ ] Resolution options (4K, 1080p, 720p)
  - [ ] Compression presets (web, archive, presentation)
  - [ ] Slide deck export (PDF, PPTX)
  - [ ] Transcript export (SRT, VTT)

---

### 15.7 Backend Infrastructure

#### Database Schema
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

#### API Endpoints
- [ ] **Create tRPC routers for remastering**
  ```typescript
  export const remasterRouter = router({
    // Start remaster job
    create: publicProcedure
      .input(z.object({
        projectId: z.number(),
        videoUrl: z.string().url(),
        transcript: z.string().optional(),
        options: z.object({
          targetResolution: z.enum(['1080p', '4K']),
          slideStyle: z.enum(['corporate', 'modern', 'minimal']),
          brandColors: z.array(z.string()).optional(),
        }),
      }))
      .mutation(async ({ ctx, input }) => {
        // Create remaster job
      }),
    
    // Get job status
    getStatus: publicProcedure
      .input(z.object({ jobId: z.number() }))
      .query(async ({ ctx, input }) => {
        // Return job status and progress
      }),
    
    // Regenerate specific slide
    regenerateSlide: publicProcedure
      .input(z.object({
        jobId: z.number(),
        slideId: z.number(),
        newPrompt: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Regenerate single slide
      }),
    
    // Finalize and render
    render: publicProcedure
      .input(z.object({ jobId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Start final rendering
      }),
  });
  ```

---

### 15.8 Use Cases & Target Markets

#### Primary Use Cases
1. **Corporate Training Refresh**
   - Problem: 5-year-old training videos look dated
   - Solution: Remaster with modern slides, keep proven audio
   - ROI: Avoid expensive re-recording

2. **YouTube Content Upgrade**
   - Problem: Old videos have low CTR due to poor visuals
   - Solution: Remaster thumbnails and slides
   - ROI: Improved engagement and watch time

3. **Webinar Repurposing**
   - Problem: Zoom recordings have boring screen shares
   - Solution: Replace with professional slides
   - ROI: Convert webinars into sellable courses

4. **Conference Talk Enhancement**
   - Problem: Conference recordings have poor slide visibility
   - Solution: Regenerate slides in 4K
   - ROI: Professional portfolio pieces

#### Target Customers
- **Corporate L&D:** Refresh training libraries without re-recording
- **Content Creators:** Upgrade old videos for better performance
- **Course Creators:** Transform webinars into premium courses
- **Speakers/Consultants:** Enhance conference talks for portfolios

---

### 15.9 Pricing Strategy

#### Remaster Credits System
- [ ] **Define credit pricing**
  - [ ] 1 credit = 1 minute of video remastered
  - [ ] Bulk discounts (100 credits, 500 credits, 1000 credits)
  - [ ] Subscription tiers include monthly credits
  
- [ ] **Credit consumption**
  - [ ] Standard remaster (1080p): 1 credit/min
  - [ ] 4K remaster: 2 credits/min
  - [ ] Slide regeneration: 0.1 credit/slide
  - [ ] Custom brand assets: +0.5 credits/min

#### Add-On Pricing
- [ ] **Premium features**
  - [ ] Priority rendering queue: +$50/month
  - [ ] Custom brand templates: $200 one-time
  - [ ] White-label export: +$100/month
  - [ ] API access: Custom pricing

---

### 15.10 Success Metrics

#### Phase 15 KPIs
- [ ] Average remaster time < 5 minutes (for 10-min video)
- [ ] Slide generation accuracy > 90% (minimal manual edits)
- [ ] Customer satisfaction score > 4.5/5
- [ ] Remaster completion rate > 95% (jobs not abandoned)
- [ ] Average slides per minute: 0.5-1.5 (optimal pacing)

#### Technical Metrics
- [ ] Image generation success rate > 98%
- [ ] FFmpeg rendering success rate > 99%
- [ ] Average cost per minute < $0.50 (API costs)
- [ ] Storage efficiency (compression ratio > 50%)

---

### 15.11 Timeline Estimate

- **Week 1-2:** Architecture design, database schema
- **Week 3-4:** AI Director Agent implementation
- **Week 5-6:** Image generation pipeline integration
- **Week 7-8:** Frontend Studio (RemasterEditor.tsx)
- **Week 9-10:** FFmpeg rendering engine
- **Week 11-12:** Testing, optimization, beta launch

**Total:** ~12 weeks to production-ready remastering engine

---

### 15.12 Dependencies

#### Technical Dependencies
- ✅ SCORM export (Phase 12b) - Reuse Visual Stream logic
- ✅ Database hardening (Phase 13) - Production-ready infrastructure
- ✅ Quiz Editor (Phase 13) - Undo/redo patterns for slide editing
- ⏳ Video storage (S3) - Large file handling
- ⏳ FFmpeg installation - Server-side video processing
- ⏳ Vertex AI / OpenAI API - Image generation

#### Business Dependencies
- [ ] Imagen/DALL-E API budget allocation
- [ ] Video storage cost analysis
- [ ] Rendering infrastructure (CPU/GPU servers)
- [ ] Legal review (copyright, fair use for remasters)

---

### 15.13 Competitive Analysis

#### vs. Manual Video Editing
- **Traditional:** 2-4 hours per 10-min video
- **CourseForge:** 10 minutes (90% automated)
- **Cost:** $200-500 (freelancer) vs. $5-10 (our credits)

#### vs. AI Video Tools (Descript, Runway)
- **Descript:** Focuses on editing, not slide generation
- **Runway:** Generative video, not course-specific
- **CourseForge:** Purpose-built for training/education content

#### vs. PowerPoint + Screen Recording
- **Manual Process:** Create slides, re-record, edit
- **Time:** 4-8 hours
- **CourseForge:** Automated slide generation, no re-recording

---

### 15.14 Risk Mitigation

#### Technical Risks
- [ ] **Image generation quality inconsistent**
  - Mitigation: Manual regeneration, prompt refinement
  
- [ ] **FFmpeg rendering failures**
  - Mitigation: Retry logic, error logging, fallback encoders

- [ ] **High API costs**
  - Mitigation: Caching, batch processing, cost caps

#### Business Risks
- [ ] **Copyright concerns (remixing others' videos)**
  - Mitigation: Terms of service, user owns content, watermarking

- [ ] **Low adoption (feature complexity)**
  - Mitigation: Guided onboarding, templates, presets

---

### 15.15 Future Enhancements

#### Phase 15B (Future)
- [ ] **AI voice cloning** (replace audio with better quality)
- [ ] **Multi-language support** (generate slides in different languages)
- [ ] **Animated slides** (motion graphics, transitions)
- [ ] **Speaker detection** (auto-generate speaker labels)
- [ ] **Background music** (AI-generated or library)
- [ ] **Captions/subtitles** (auto-generated, burned-in)

---

## Notes

### The "Glow Up" Value Proposition

**Before:** Outdated 2015 webinar with pixelated slides  
**After:** Modern 4K course with professional AI-generated graphics  
**Time:** 10 minutes  
**Cost:** $5-10 in credits  

**Tagline:** "Give your old videos a 2025 makeover."

### Market Positioning

This feature differentiates CourseForge from:
- Generic AI video tools (not course-specific)
- Traditional video editors (too manual)
- Course platforms (no remastering capability)

**Unique Selling Point:** "The only platform that can upgrade your entire video library in an afternoon."

---

*Last updated: 2025-11-29*
