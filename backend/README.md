# DAKSH AI Career Acceleration Platform - Backend

Django REST Framework backend powering authentication, registration, candidate onboarding, skill taxonomies, learning roadmaps, AI interview simulations, resume ATS audits, and job matching for the **DAKSH** ecosystem.

---

## 🚀 Key Features Implemented

1. **Authentication & Authorization (JWT)**:
   - Email-based registration with role selection (`candidate`, `mentor`, `admin`).
   - Secure password hashing using Django cryptographic validators.
   - JWT tokens (Access + Refresh) powered by `djangorestframework-simplejwt`.
   - Token refresh, token verify, logout (token blacklisting), and password change APIs.

2. **Candidate Onboarding System**:
   - Comprehensive multi-step or single-payload onboarding API.
   - **Academic Details**: College name, tier, degree, branch/discipline, graduation year, semester, student/job status.
   - **Career Aspirations**: Target role, target company types (e.g. `['Product MNC', 'High Growth Startup']`), years/months of experience, personal bio.
   - **Skills Selection & Profiling**: Searchable skill master taxonomy, user proficiency levels (`beginner`, `intermediate`, `advanced`), and source tracking.
   - **Socials & Portfolios**: GitHub, LinkedIn, portfolio links, and resume URL.
   - **Onboarding Progress & Status Tracker**: Dynamic calculation of completion percentage (0–100%) and per-step breakdown.
   - **Gamification Rewards**: Automatic initial +50 XP bonus on onboarding completion.

3. **Complete Database Schema Models** (Faithfully mapped from `daksh_schema_dump.sql`):
   - **Accounts**: `User`, `UserProfile`, `UserGamificationProfile`, `UserSkill`
   - **Skills**: `SkillMaster`, `SkillAlias`, `RoleSkillRequirement`
   - **Jobs & Opportunities**: `JobRoleTaxonomy`, `JobListing`, `JobAlertPreference`, `UserJobMatch`, `EventHackathonListing`, `UserOpportunityBookmark`, `SkillGapReport`, `SkillGapItem`, `GithubPortfolioAnalysis`
   - **Learning Hub**: `Course`, `DynamicLearningRoadmap`, `RoadmapStage`, `UserCourseProgress`, `SpacedRepetitionSchedule`
   - **Interviews**: `InterviewSession`, `InterviewRound`, `InterviewQuestion`, `UserInterviewResponse`, `AIEvaluationFeedback`, `InterviewScorecard`
   - **Resumes**: `TargetJobDescription`, `ResumeMaster`, `ResumeStructuredContent`, `ResumeCompilation`, `ResumeATSAudit`

---

## 🛠️ Tech Stack

- **Framework**: Python 3.12+ / Django 5.x / Django 6.x
- **API Engine**: Django REST Framework (DRF)
- **Token Auth**: SimpleJWT (JSON Web Tokens)
- **CORS**: `django-cors-headers`
- **Database**: PostgreSQL (with schema `daksh`) / SQLite for zero-config local development

---

## 📁 Project Architecture

```
backend/
│
├── manage.py
├── requirements.txt
├── .env / .env.example
├── README.md
│
├── daksh_project/                  # Django project configuration
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
└── apps/                           # Modular domain applications
    ├── accounts/                   # Auth, User, Profile, Gamification, Onboarding
    │   ├── models.py
    │   ├── serializers.py
    │   ├── views.py
    │   ├── urls.py
    │   ├── managers.py
    │   ├── signals.py
    │   ├── permissions.py
    │   ├── tests.py
    │   └── admin.py
    │
    ├── skills/                     # Skills Master taxonomy & seed command
    │   ├── models.py
    │   ├── serializers.py
    │   ├── views.py
    │   ├── urls.py
    │   ├── admin.py
    │   └── management/commands/seed_data.py
    │
    ├── jobs/                       # Job taxonomy, opportunities, skill gap models
    ├── learning/                   # Courses, dynamic roadmaps, progress models
    ├── interviews/                 # Interview sessions, rounds, AI scoring models
    └── resumes/                    # Resumes, LaTeX compilations, ATS audits models
```

---

## ⚡ Quick Start & Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment (`.env`)
Create a `.env` file in the `backend/` folder (or copy from `.env.example`):
```ini
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOW_ALL_ORIGINS=True

# Set to True to connect to PostgreSQL with daksh schema, or False for local SQLite
USE_POSTGRES=False
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_SCHEMA=daksh
```

### 3. Run Migrations & Seed Taxonomy Data
```bash
python manage.py migrate
python manage.py seed_data
```

### 4. Run Automated Test Suite
```bash
python manage.py test
```

### 5. Start Development Server
```bash
python manage.py runserver 8000
```
API Root available at: `http://localhost:8000/api/`  
Admin Panel available at: `http://localhost:8000/admin/`

---

## 📡 API Reference & Endpoints

### 1. Auth: Registration
**`POST /api/auth/register/`**
```json
{
  "email": "candidate@example.com",
  "password": "SecurePassword123!",
  "confirm_password": "SecurePassword123!",
  "first_name": "Aarav",
  "last_name": "Sharma",
  "phone_number": "+919876543210",
  "role": "candidate"
}
```
**Response (201 Created):**
```json
{
  "message": "Registration successful. Welcome to DAKSH!",
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsIn...",
    "refresh": "eyJhbGciOiJIUzI1NiIsIn..."
  },
  "user": {
    "id": "c71e2e1a-4d2b-426d-a602-53b9287c88b9",
    "email": "candidate@example.com",
    "role": "candidate",
    "is_active": true,
    "is_verified": false,
    "profile": {
      "first_name": "Aarav",
      "last_name": "Sharma",
      "is_onboarded": false,
      "onboarding_completion_percentage": 20
    }
  }
}
```

---

### 2. Auth: Login
**`POST /api/auth/login/`**
```json
{
  "email": "candidate@example.com",
  "password": "SecurePassword123!"
}
```
**Response (200 OK):**
```json
{
  "message": "Login successful.",
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsIn...",
    "refresh": "eyJhbGciOiJIUzI1NiIsIn..."
  },
  "user": {
    "id": "c71e2e1a-4d2b-426d-a602-53b9287c88b9",
    "email": "candidate@example.com",
    "role": "candidate",
    "profile": { ... },
    "gamification": {
      "total_xp": 0,
      "current_streak_days": 1,
      "longest_streak_days": 1,
      "tier_badge": "Bronze"
    }
  }
}
```

---

### 3. Current User & Profile
- **`GET /api/auth/me/`** - Returns current user details, profile, gamification profile, and skills.
- **`GET /api/auth/profile/`** - Returns current profile.
- **`PATCH /api/auth/profile/`** - Partially updates profile information.
- **`POST /api/auth/token/refresh/`** - Exchange refresh token for new access token.
- **`POST /api/auth/logout/`** - Invalidate/blacklist refresh token.
- **`POST /api/auth/change-password/`** - Update account password.

---

### 4. Candidate Onboarding
- **`GET /api/auth/onboarding/status/`**
  Returns real-time onboarding breakdown and step status:
  ```json
  {
    "is_onboarded": false,
    "completion_percentage": 40,
    "steps": {
      "personal_info": { "completed": true, "data": { ... } },
      "academic_info": { "completed": false, "data": { ... } },
      "career_goals": { "completed": false, "data": { ... } },
      "skills": { "completed": false, "count": 0, "data": [] },
      "links_and_resume": { "completed": false, "data": { ... } }
    }
  }
  ```

- **`POST /api/auth/onboarding/`**
  Save onboarding information (step-wise or complete payload):
  ```json
  {
    "college_name": "Indian Institute of Technology",
    "college_tier": "Tier-1",
    "degree": "B.Tech",
    "branch_discipline": "Computer Science & Engineering",
    "graduation_year": 2025,
    "current_semester": "7th",
    "current_status": "Final Year Student",
    "experience_months": 6,
    "target_role": "Backend Engineer",
    "target_company_types": ["Product MNC", "High Growth Startup"],
    "github_url": "https://github.com/aaravsharma",
    "linkedin_url": "https://linkedin.com/in/aaravsharma",
    "portfolio_url": "https://aaravsharma.dev",
    "bio": "Aspiring backend engineer building distributed web services.",
    "skills": [
      { "skill_name": "Python", "proficiency": "intermediate" },
      { "skill_name": "Django", "proficiency": "intermediate" },
      { "skill_name": "PostgreSQL", "proficiency": "beginner" }
    ]
  }
  ```
  **Response (200 OK):**
  ```json
  {
    "message": "Onboarding details saved successfully.",
    "is_onboarded": true,
    "completion_percentage": 100,
    "user": { ... }
  }
  ```

---

### 5. Skills & Taxonomy Search (For Onboarding UI)
- **`GET /api/skills/?search=python`** - Search standardized skill taxonomy.
- **`GET /api/jobs/roles/?search=backend`** - Search standardized target job roles.
- **`GET /api/auth/skills/`** - List candidate's selected skills.
- **`POST /api/auth/skills/`** - Add or update a user skill (`skill_name`, `proficiency`, `category`).
- **`DELETE /api/auth/skills/<skill_id>/`** - Remove a skill from candidate profile.
