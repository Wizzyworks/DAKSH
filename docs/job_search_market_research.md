# AI Job Search Assistant & Opportunity Hub: Market Research & Improvement Strategy

## 1. What Your Frontend Currently Does (The Baseline)

The current app has **no Job Search Assistant section at all**. The navigation in `OfficerDashboard.jsx` (lines 726–733) contains these tabs:

```
Home | Skill Gap Analysis | Learning Hub | SETU AI | Transcript & Vault | Settings
```

There is no "Job Search", "Opportunities", or "Career Explorer" tab. The closest existing features are:

- **CALENDAR_EVENTS** in `mockData.js` (line 1631): 5 hardcoded NSSTA/iGOT training events with RSVP functionality — but these are internal training workshops, not external job listings or hackathons.
- **Settings → Notifications** (line 2749): A basic notification preferences panel with toggles for "Gazette Notifications & Manual Releases" — but no job alert subscription or criteria-based notification system.
- **`target_role_career_goal`** in `UserOnboarding` model: Stores the user's target career role — this is useful context for job matching but isn't connected to any search functionality.

### Exact Current Job Search Feature Inventory

| Feature | Current State |
|---|---|
| Job listing aggregation | ❌ None |
| Multi-source job scraping | ❌ None |
| Career page crawling | ❌ None |
| Role / location / type filtering | ❌ None |
| Direct application links | ❌ None |
| Job alert subscription | ❌ None — only gazette notification toggles exist |
| Criteria-based notifications | ❌ None |
| Hackathon / event discovery | ❌ None — only 5 hardcoded NSSTA training events |
| Open-source event finder | ❌ None |
| Community / newsletter suggestions | ❌ None |
| Profile-aware job matching | ❌ None — `target_role_career_goal` exists but is unused |

---

## 2. Competitor Landscape & Their Approaches

### Tier 1 — AI-Powered Job Search Assistants & Aggregators

| Platform | Core Approach | What Makes Them Stand Out |
|---|---|---|
| **Jobright** | AI Copilot for Job Search | All-in-one: discovers jobs from 1M+ listings, auto-tailors resume per listing, provides "Insider Connections" (identifies contacts at target companies), and tracks application status. Uses AI to explain *why* a job matches your profile. Paid subscription model. |
| **Teal** | Job Search CRM + Resume Optimizer | Tracks applications across a kanban board (Saved → Applied → Interview → Offer). Chrome extension auto-saves job listings from any site. Matches resume keywords against each JD. Free tier is generous. Doesn't scrape — user manually saves listings. |
| **LoopCV** | Autonomous Auto-Apply Agent | "Set it and forget it" model. User uploads resume + sets criteria → LoopCV searches daily across multiple boards → auto-applies to matching positions. Tracks responses. Designed for remote/global job seekers. Risk: some platforms detect automated applications. |
| **Simplify** | Browser Autofill + Job Discovery | Chrome extension that autofills job application forms across thousands of ATS platforms (Workday, Greenhouse, Lever). Also surfaces a curated feed of "Simplify-verified" job listings. Free core product. |
| **LazyApply** | High-Volume Bulk Auto-Apply | Applies to hundreds of jobs per day automatically. User defines criteria once → bot applies to everything matching. Highest quantity, lowest personalization. Risk: can trigger shadow-bans on platforms. |
| **Jobloo** | Per-JD Automated Tailoring | Generates a customized, ATS-optimized resume for every single job application. Fully automated: scrapes → tailors → applies. Designed for high-volume but with personalized output per listing. |

### Tier 2 — Job Board Aggregators & API/Scraping Infrastructure

| Platform | Core Approach | Technical Architecture |
|---|---|---|
| **Indeed** | World's largest job aggregator | Aggregates listings from company career pages, ATS systems, and direct postings. No public API for developers since 2019. Requires scraping (with anti-bot defenses) or third-party wrappers. |
| **LinkedIn Jobs** | Social graph + job matching | Leverages your professional network to surface "who you know at this company." No public scraping API. Strict anti-bot enforcement — scraping risks account suspension. |
| **Google Jobs** | SERP-based meta-aggregator | Aggregates from Indeed, LinkedIn, Glassdoor, ZipRecruiter, company career pages. Accessible via **SerpAPI** (managed) or **JSearch** (RapidAPI). The most comprehensive single source — Google already crawls career pages. |
| **Glassdoor** | Reviews + salary + listings | Unique value: salary data and employee reviews per company. Useful for filtering opportunities by company culture, not just role match. |
| **Naukri.com** | India's largest job portal | Dominant in the Indian market. No public API — requires custom scraping. Critical for any India-focused job search tool. |
| **JobSpy** (Open Source) | Python scraping library | MIT-licensed. Single function call scrapes LinkedIn, Indeed, Glassdoor, ZipRecruiter, Google Jobs. Returns pandas DataFrame. Free but fragile — breaks when sites update anti-bot measures. |
| **SerpAPI** | Managed Google Jobs API | Industry standard for reliable SERP data. Handles CAPTCHAs, proxy rotation, anti-bot. Returns clean JSON. Free tier: 100 searches/month. Production: paid. |
| **JSearch** (RapidAPI) | Google Jobs wrapper API | Easy integration, clean JSON, free tier available. Good for rapid prototyping. Aggregates from Google's job index which already covers most major boards. |

### Tier 3 — Hackathon & Event Discovery Platforms

| Platform | Core Approach | Data Access |
|---|---|---|
| **Devpost** | Global hackathon discovery + project showcase | Lists thousands of hackathons worldwide. No public API — scrapeable via Apify actors or custom scraping. The de facto standard for hackathon submissions and judging. |
| **Devfolio** | Hackathon discovery (strong in India/Web3/AI) | Popular in the Indian developer ecosystem. "Apply with Devfolio" SDK for organizers. Community-focused with featured events. |
| **MLH (Major League Hacking)** | Student hackathon community | Curated calendar of verified student hackathons. MyMLH OAuth API for user authentication. Global Hack Week events for structured participation. |
| **HackerEarth** | Enterprise hackathons + hiring challenges | Combines hackathon management with recruitment pipelines. Coding challenges that double as job applications. Strong in India and Southeast Asia. |
| **Eventbrite** | General event discovery | Public API with event search, filtering, and ticketing. Covers tech meetups, workshops, and conferences. Well-documented REST API. |
| **CodeTriage** | Open-source contribution finder | Sends GitHub issues to your inbox based on language preferences. Helps find "good-first-issue" opportunities for resume building. |
| **GitHub Explore** | Trending repos + topics | `good-first-issue` label search. Trending repositories by language. Topic-based discovery (`open-source-contribution`, `hacktoberfest`). API-accessible. |

### Tier 4 — Government & India-Specific Job Portals

| Portal | Relevance to Your App |
|---|---|
| **mospi.gov.in** | MoSPI official — relevant vacancies for statistical officers |
| **nssta.gov.in** | NSSTA — training programmes that double as career advancement |
| **igot.gov.in** | iGOT Karmayogi — certifications that affect posting/promotion eligibility |
| **ssc.nic.in** | Staff Selection Commission — Group B/C recruitment for central govt |
| **upsc.gov.in** | UPSC — ISS/IES cadre recruitment relevant to MoSPI officials |
| **ncs.gov.in** | National Career Service — Government's own job portal |
| **sarkariresult.com / freejobalert.com** | Popular aggregators for government job notifications in India |

---

## 3. Is Your Current Approach Optimal?

**Short Answer: You have ZERO job search functionality. This is a completely new feature. However, unlike the other sections (Skill Gap, Learning Hub, Interview Room, Resume Builder), this feature has a unique challenge — it depends on external data sources (job listings, hackathon events) that you don't control. The architecture must be fundamentally different from your other AI-driven features.**

### ✅ What You Can Leverage From Existing Infrastructure

- **User Profile Data**: `UserOnboarding` already stores `designation`, `department_division`, `statistical_cadre`, `target_role_career_goal`, `highest_educational_qualification` — all directly usable as job matching criteria.
- **Skill Gap Data**: `user_competency_scores` and `skill_gaps` tables provide a precise picture of what the user is qualified for and what they're aspiring to — enabling intelligent job matching ("show me jobs that match my current skills" vs "show me jobs that match my target skills").
- **FRAC Competency Framework**: Your standardized skill taxonomy can be used to semantically match JD requirements against user competencies, going beyond keyword matching.
- **Notification Preferences UI**: The Settings → Notifications panel already exists with toggle switches — this can be extended with job alert criteria.
- **Calendar Events Infrastructure**: `CALENDAR_EVENTS` and the RSVP/register flow already exist in the frontend — hackathon/event listings can reuse this exact UI pattern.

### ❌ Critical Challenges Unique to This Feature

**Problem 1: You Don't Own the Data**
Unlike Skill Gap Analysis (your FRAC data), Learning Hub (your course catalog), Interview Room (your generated questions), and Resume Builder (user's own CV), job listings belong to external platforms. You must either:
- **Scrape** them (fragile, legally risky, requires maintenance)
- **Use APIs** (reliable, but paid or rate-limited)
- **Aggregate via Google Jobs** (the meta-aggregator that already crawls career pages)

**Problem 2: Anti-Bot Defenses Are Sophisticated in 2026**
LinkedIn, Indeed, and Naukri all deploy advanced anti-bot measures: TLS fingerprinting, CAPTCHA challenges, behavioral analysis, IP rate limiting. Building reliable scrapers for these platforms is a full-time engineering effort. For a hackathon, this is not feasible.

**Problem 3: Data Freshness & Deduplication**
The same job posted on Indeed, LinkedIn, and the company's career page appears as 3 listings. Without deduplication, your search results will be cluttered with duplicates. And if your data is stale (scraped yesterday, job filled today), users lose trust.

**Problem 4: "Ghost Jobs" Problem**
An estimated 18–22% of online job postings in 2026 are "ghost jobs" — listings that companies keep active with no intention to fill. No technical solution fully solves this, but recency filtering and source verification help.

**Problem 5: Hackathon/Event Data is Fragmented**
There is no single API that lists all hackathons globally. Data is spread across Devpost, Devfolio, MLH, HackerEarth, Eventbrite, and hundreds of individual organizer websites. Aggregation requires scraping multiple sources.

---

## 4. Better Approaches for Building the Job Search Assistant

### 🥇 Approach A: API-First Aggregation via Google Jobs (Most Practical for Hackathon)

**How it works**: Instead of scraping 20 different job boards individually, leverage **Google Jobs** as the meta-aggregator. Google already crawls Indeed, LinkedIn, Glassdoor, ZipRecruiter, company career pages, and government portals — essentially doing the aggregation work for you.

**Implementation**:
1. Use **SerpAPI** (managed, reliable) or **JSearch** (RapidAPI, free tier) to query Google Jobs
2. User inputs: `{ role: "Data Analyst", location: "Delhi", experience: "3-5 years", job_type: "Government" }`
3. API returns structured JSON: `[{ title, company, location, date_posted, description, apply_link, source_platform }]`
4. Your backend enriches results: parse JD with LLM to extract required skills → match against user's competency scores → compute a "match score" per listing
5. Frontend displays results with filters, sort, and direct "Apply" links to original sources

**Who does this**: Jobright (uses aggregated data + AI matching), Teal (manual saving + keyword matching)

**Why it's the best approach for hackathon**: You avoid the entire anti-bot/scraping infrastructure problem. Google has already solved aggregation, deduplication, and crawling. You focus your engineering on the *intelligence layer* — matching, scoring, and recommending.

**Backend requirement**: SerpAPI key ($0 for 100 searches/month free tier) or JSearch RapidAPI key (free tier available). Django view that proxies requests and enriches results with user-profile matching.

**Effort**: Low-Medium. The API integration is straightforward — the value is in the matching/scoring intelligence.

---

### 🥈 Approach B: Direct Career Page & Government Portal Monitoring

**How it works**: For your specific domain (MoSPI, government statistical cadre), the most relevant job postings are on government portals that are NOT well-indexed by Google Jobs. Build a lightweight scraper for these specific sources:

**Target Sources**:
```
Government Portals:
  ├── mospi.gov.in/vacancies
  ├── ssc.nic.in/noticeboards
  ├── upsc.gov.in/examinations
  ├── ncs.gov.in (National Career Service)
  ├── nssta.gov.in/programmes
  └── igot.gov.in/opportunities

Popular Aggregators:
  ├── sarkariresult.com
  └── freejobalert.com

Direct ATS Endpoints (for private sector):
  ├── boards.greenhouse.io/{company}
  ├── jobs.lever.co/{company}
  └── {company}.ashbyhq.com/api
```

**Implementation**:
1. Python scraping workers using `httpx` + `BeautifulSoup` (government sites are simple HTML, no anti-bot)
2. Scheduled runs via Django management command or Celery beat (every 6-12 hours)
3. Parse each page → extract: `{ title, organization, location, deadline, apply_url, notification_pdf_url }`
4. Store in PostgreSQL with deduplication (hash of title + org + deadline)
5. LLM enrichment: parse notification PDFs to extract eligibility criteria, age limits, required qualifications
6. Match against user profile: "This ISS Exam requires M.Stat — user has M.Stat ✅"

**Who does this**: freehire (open-source career page crawler), Sarkari Result (manual aggregation of government notifications)

**Why it's valuable**: Government portals are poorly indexed by commercial job aggregators. For your specific user base (MoSPI statistical officers), this is the most relevant data source. Government sites have minimal anti-bot defenses.

**Effort**: Medium. The scraping is simple (government HTML is basic), but you need to maintain scrapers as site layouts change.

---

### 🥉 Approach C: Hackathon & Event Discovery Engine

**How it works**: Aggregate hackathon, coding challenge, and open-source events from multiple platforms into a unified discovery feed:

**Data Sources**:
```
Hackathon Platforms:
  ├── Devpost (scrape listing pages or use Apify actor)
  ├── Devfolio (scrape event feed)
  ├── MLH (scrape season calendar)
  ├── HackerEarth (scrape challenges page)
  └── Unstop / D2C (India-specific coding events)

Open Source Events:
  ├── GitHub Trending (API: /trending)
  ├── GitHub "good-first-issue" search (API: /search/issues?q=label:"good first issue")
  ├── CodeTriage (scrape or RSS)
  └── Hacktoberfest / Google Summer of Code (seasonal scraping)

Tech Events & Conferences:
  ├── Eventbrite API (free tier, well-documented)
  ├── Meetup.com (GraphQL API)
  └── Luma (scrape event pages)
```

**Implementation**:
1. Scheduled scraping workers for each platform (run daily)
2. Normalize into a unified schema:
   ```json
   {
     "event_type": "hackathon | coding_challenge | open_source | conference | meetup",
     "title": "...",
     "organizer": "...",
     "dates": { "start": "...", "end": "...", "deadline": "..." },
     "location": "online | city_name",
     "prizes": "...",
     "themes": ["AI", "Web3", "FinTech"],
     "difficulty": "beginner | intermediate | advanced",
     "url": "...",
     "source_platform": "devpost | devfolio | mlh | hackerearth"
   }
   ```
3. Frontend: Calendar view (reuse your existing `CALENDAR_EVENTS` UI pattern) + list view with filters
4. Filters: `event_type`, `themes`, `location` (online/in-person), `difficulty`, `date_range`

**Who does this**: No single platform aggregates ALL of these. This is a genuine differentiator.

**Effort**: Medium. Each platform scraper is ~50-100 lines of Python. The value is in the aggregation across fragmented sources.

---

### 🏅 Approach D: Smart Alert & Notification System

**How it works**: User defines alert criteria → system monitors sources → notifies user when matching listings appear:

```
┌────────────────────────────────────────────────────────────┐
│  ALERT PREFERENCES                                          │
├────────────────────────────────────────────────────────────┤
│  Role Keywords:     "Statistical Officer", "Data Analyst"   │
│  Locations:         Delhi, Kolkata, Remote                  │
│  Job Type:          Government, PSU                         │
│  Experience Level:  5-10 years                              │
│  Salary Range:      Level 10+ (7th CPC)                     │
│  Alert Frequency:   Daily Digest (8:00 AM)                  │
│  Channels:          In-App + Email                          │
├────────────────────────────────────────────────────────────┤
│  HACKATHON ALERTS                                           │
│  Themes:            AI/ML, Data Science, GovTech            │
│  Mode:              Online only                             │
│  Alert:             Immediate (when new event found)        │
└────────────────────────────────────────────────────────────┘
```

**Architecture**:
1. **User Preferences**: Stored in DB as `JobAlertPreference(user_id, criteria_json, frequency, channels[])`
2. **Matching Engine**: When scraper finds new listings, compare each against all active alert preferences
   - Simple approach: keyword matching + location filter + job type filter
   - Advanced approach: Semantic matching using embeddings (user profile embedding ↔ job description embedding)
3. **Notification Delivery**:
   - **In-App**: WebSocket or polling — badge count on Job Search tab + notification tray
   - **Email**: Django email backend (already configured in your `settings.py` as console backend for dev)
   - **Push**: Web Push API (browser notification) — requires service worker + VAPID keys
4. **Digest vs Real-Time**: User chooses between:
   - **Immediate**: Notify as soon as a matching listing is found
   - **Daily Digest**: Batch all matches into a single 8AM email/notification
   - **Weekly Summary**: Weekly roundup with trends ("12 new Data Analyst openings in Delhi this week")

**Who does this**: LinkedIn (email alerts for saved searches), Indeed (daily job alerts), Teal (application tracking notifications)

**Effort**: Medium. The matching logic is simple (mostly filtering). The notification plumbing (email, push, in-app) requires infrastructure setup.

---

### 🎖️ Approach E: Community & Subscription Recommendations

**How it works**: Instead of just showing job listings, proactively recommend communities, newsletters, and subscription services where the user can stay updated:

**Curated Recommendations Based on User Profile**:
```
For a Statistical Officer targeting Senior Analyst roles:

📬 Newsletters to Subscribe:
  • MoSPI Gazette Notifications (mospi.gov.in/circulars)
  • Employment News (employmentnews.gov.in)
  • Data Science Weekly (datascienceweekly.org)
  • Analytics India Magazine (analyticsindiamag.com/newsletter)

👥 Communities to Join:
  • ISS Officers Forum (internal ministry group)
  • r/datascience & r/IndiaJobs (Reddit)
  • DataTau (Hacker News for data science)
  • LinkedIn Groups: "Indian Statistical Service", "MoSPI Network"

🏆 Platforms to Monitor:
  • Kaggle Competitions (kaggle.com/competitions)
  • Devpost Hackathons (devpost.com/hackathons?themes[]=data)
  • HackerEarth Challenges (hackerearth.com/challenges)
  • Google Summer of Code (summerofcode.withgoogle.com)
```

**Implementation**: LLM generates personalized recommendations based on `user.designation`, `user.department_division`, `user.target_role_career_goal`, and `user.skill_gaps[]`. Recommendations are cached and refreshed monthly.

**Effort**: Low. Mostly curated content + LLM personalization. High value for user engagement.

---

## 5. Recommended Enhanced Pipeline for Your Backend

```
Phase 1 — Job Listing Ingestion (Multi-Source)
  └── Primary: Google Jobs via SerpAPI / JSearch API
      • Query: Constructed from user filters (role + location + type + experience)
      • Returns: Structured JSON with title, company, location, date, apply_link, description
      • Rate: 100 free searches/month (SerpAPI) — sufficient for demo/hackathon
  └── Government Portal Scraper (Scheduled):
      • Targets: mospi.gov.in, ssc.nic.in, upsc.gov.in, ncs.gov.in
      • Schedule: Every 12 hours via Django management command / Celery beat
      • Parser: httpx + BeautifulSoup (government sites have minimal anti-bot)
      • Stores raw HTML + extracted structured data
  └── DB Model: JobListing(listing_id, title, company, location, job_type,
      experience_level, description, apply_url, source_platform, date_posted,
      date_scraped, is_active, skills_extracted[])

Phase 2 — LLM Enrichment & Skill Extraction
  └── Input: Raw job description text
  └── LLM prompt: "Extract from this JD: required_skills[], preferred_skills[],
      experience_years, education_required, job_type (government/private/psu),
      salary_range, application_deadline"
  └── Output: Structured enrichment JSON stored alongside listing
  └── Reuses your existing JD parsing from skill gap pipeline

Phase 3 — Profile-Aware Job Matching & Scoring
  └── Input: User profile (competencies, skills, experience, target_role) + Job listing
  └── Matching dimensions:
      • Skill match: % of JD required_skills found in user competency scores
      • Experience match: user years of service vs JD experience requirement
      • Education match: user qualification vs JD education requirement
      • Location match: user preferences vs JD location
      • Career alignment: user target_role vs JD role title similarity
  └── Output: match_score (0-100%) + match_breakdown per dimension
  └── DB Model: JobMatch(user_id, listing_id, match_score, breakdown_json,
      is_bookmarked, application_status, matched_at)

Phase 4 — Hackathon & Event Aggregation
  └── Sources: Devpost, Devfolio, MLH, HackerEarth, Unstop, Eventbrite API,
      GitHub good-first-issue search
  └── Schedule: Daily scraping workers
  └── Normalize to unified schema:
      EventListing(event_id, event_type, title, organizer, start_date, end_date,
      registration_deadline, location, is_online, themes[], difficulty, prizes,
      url, source_platform, is_active)
  └── Frontend: Reuse CALENDAR_EVENTS UI pattern + list view with filters

Phase 5 — Alert Subscription & Notification Engine
  └── DB Model: AlertPreference(user_id, criteria_json, frequency,
      channels[], is_active, created_at)
      • criteria_json: { role_keywords: [], locations: [], job_types: [],
          experience_range: [min, max], themes: [] }
      • frequency: "immediate" | "daily_digest" | "weekly_summary"
      • channels: ["in_app", "email", "push"]
  └── Matching: When new listings ingested → compare against all active preferences
      • Simple: keyword + location + type filter
      • Advanced: Embedding cosine similarity (user profile ↔ JD)
  └── Delivery:
      • In-App: Badge count + notification tray (WebSocket or polling)
      • Email: Django send_mail() with HTML template
      • Push: Web Push API with VAPID keys + service worker
  └── Digest: Celery beat task at 8AM daily → aggregate matches → send single email

Phase 6 — Community & Resource Recommendations
  └── Input: User profile (designation, department, target_role, skill_gaps)
  └── LLM prompt: "Based on this government official's profile, recommend:
      (1) 5 newsletters they should subscribe to
      (2) 5 online communities to join
      (3) 5 platforms to monitor for career development"
  └── Cache recommendations per user (refresh monthly)
  └── DB Model: CommunityRecommendation(user_id, category, title, url,
      description, relevance_reason, generated_at)
```

---

## 6. Data Source Strategy: What to Scrape vs What to API

| Source | Method | Why | Effort |
|---|---|---|---|
| Google Jobs (via SerpAPI / JSearch) | **API** | Already aggregates Indeed, LinkedIn, Glassdoor, ZipRecruiter, career pages. Reliable, structured JSON. Free tier sufficient for hackathon. | Low |
| mospi.gov.in, ssc.nic.in, upsc.gov.in | **Scrape** | Government sites have minimal anti-bot. These are the most relevant sources for your user base. Not indexed well by commercial aggregators. | Low |
| ncs.gov.in (National Career Service) | **API / Scrape** | India's official job portal. May have a public API. Simple HTML if scraping. | Low |
| Devpost, Devfolio, MLH | **Scrape** | No public APIs for event listings. Simple HTML scraping. Updated infrequently (events are posted days/weeks in advance). | Low-Medium |
| Eventbrite | **API** | Well-documented REST API. Free tier for event search and discovery. | Low |
| GitHub (good-first-issue, trending) | **API** | Excellent public API. Search endpoint for issues with specific labels. Trending endpoint for repos. | Low |
| LinkedIn Jobs | **SKIP for v1** | Aggressive anti-bot. Account suspension risk. Google Jobs already indexes LinkedIn listings. | High (avoid) |
| Indeed | **SKIP for v1** | No public API since 2019. Anti-bot defenses. Google Jobs already indexes Indeed listings. | High (avoid) |
| Naukri.com | **SKIP for v1** | Heavy anti-bot. Custom scraping required. Consider for v2 if India-specific private sector jobs are needed. | High (avoid) |

---

## 7. Summary: What to Build vs What to Skip

| Feature | Priority | Why |
|---|---|---|
| Google Jobs API integration (SerpAPI / JSearch) | **Must Have** | Foundation layer. Single API call covers 80%+ of job listings across all major boards. Avoids anti-bot/scraping complexity entirely. Free tier sufficient for hackathon demo. |
| Profile-aware job matching & scoring | **Must Have** | This is what makes it intelligent, not just a search box. Connects to your existing FRAC competency data and skill gap scores. "85% match — you're strong in 12/14 required skills." |
| Search filters (role, location, job type, experience level) | **Must Have** | Basic UX requirement. Users must be able to narrow results. Maps directly to API query parameters. |
| Direct application links to original sources | **Must Have** | Users must be able to click through to the actual job posting and apply. Without this, the feature is useless. |
| Government portal scraping (mospi.gov.in, ssc.nic.in, upsc.gov.in) | **Must Have** | Your primary user base is government statistical officers. These portals are the most relevant and least covered by commercial aggregators. Scraping is easy (simple HTML, no anti-bot). |
| Job alert subscription with criteria matching | **Should Have** | High retention value. User sets preferences once → gets notified when matching jobs appear. Requires scheduled scraping + notification delivery (email/in-app). |
| Hackathon & event discovery aggregation | **Should Have** | Unique differentiator. Aggregating Devpost + Devfolio + MLH + HackerEarth + GitHub into one feed is genuinely useful and no competitor does it comprehensively. Reuse your existing calendar event UI. |
| LLM-enriched JD parsing (extract skills, qualifications from listings) | **Should Have** | Enables intelligent matching. Reuses your existing JD parsing from skill gap pipeline. Turns unstructured JD text into structured, matchable data. |
| Community & newsletter recommendations | **Should Have** | Low-effort, high-engagement. LLM generates personalized recommendations. Cache and refresh monthly. |
| Daily/weekly email digest of matching jobs | **Nice to Have** | Requires Django email configuration beyond console backend. High user value but lower demo impact. |
| Browser push notifications | **Nice to Have** | Requires Web Push API + service worker + VAPID keys. Nice UX but significant frontend infrastructure for hackathon. |
| LinkedIn / Indeed / Naukri direct scraping | **Future Scope** | High anti-bot complexity. Google Jobs already indexes their listings. Not worth the engineering effort for v1. |
| Application status tracking (Applied → Interview → Offer) | **Future Scope** | CRM-like functionality (what Teal does). Useful but adds significant state management complexity. |
| Auto-apply bot | **Future Scope** | Ethically questionable. Risk of platform bans. Not appropriate for a government-focused learning platform. |
| Resume-to-job auto-matching (passive mode) | **Future Scope** | System proactively searches for jobs matching user's latest resume without user initiating search. Enterprise-grade feature. |

> [!IMPORTANT]
> The single biggest architectural decision is **using Google Jobs (via SerpAPI or JSearch) as your primary data source** rather than scraping individual job boards. Google already crawls and aggregates Indeed, LinkedIn, Glassdoor, ZipRecruiter, and millions of company career pages — including many "non-popular" ones. This means one API call replaces 20+ individual scrapers. You avoid all anti-bot complexity, and the data is already deduplicated and fresh. Reserve custom scraping ONLY for government portals (mospi.gov.in, ssc.nic.in) that Google doesn't index well.

> [!TIP]
> For the tech stack: Use **SerpAPI** (100 free searches/month) or **JSearch on RapidAPI** (free tier) for job listings. Use **httpx + BeautifulSoup** for government portal scraping (these sites are simple HTML). For hackathon aggregation, scrape Devpost/Devfolio pages with the same httpx stack. For notifications, start with **Django's built-in email** (switch from console to SMTP backend) and **in-app badge counts** (simple polling endpoint). For job matching, reuse your existing **FRAC competency scores** — compare `user_competency_scores.current_level` against JD extracted `required_skills` to compute a match percentage. Store everything in your existing PostgreSQL. The entire feature can be built as a Django app with 3 models (`JobListing`, `EventListing`, `AlertPreference`), 2 scheduled tasks (government scraper + event scraper), and 1 API integration (Google Jobs).
