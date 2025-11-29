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
