# 🚀 Daksh Frontend

Frontend client for the **Daksh Platform** — an AI-powered career readiness, skill benchmarking, and dynamic learning roadmap system. Built with React, Vite, Tailwind CSS v4, Framer Motion, and Lucide React.

---

## 🛠️ Tech Stack

- **Framework / UI Library:** React (ES Modules / JSX)
- **Build Tool & Dev Server:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Routing:** [React Router v7](https://reactrouter.com/) (`react-router-dom`)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 💻 Local Setup & Running

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)

### Installation & Execution Commands

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   > The local development server will start at `http://localhost:5173` (or the next available port).

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

---

## 📁 Directory & File Architecture

```
frontend/
├── public/                     # Static public assets (Favicon, logos, SVGs)
│   ├── daksh-logo.png          # Main Daksh platform brand logo
│   ├── favicon.svg             # Browser tab icon
│   └── icons.svg               # SVG icon sprites
├── src/
│   ├── assets/                 # Bundled static images and media
│   │   ├── hero.png            # Hero visual assets
│   │   ├── typescript.svg
│   │   └── vite.svg
│   ├── components/             # Reusable UI & layout components
│   │   ├── AuthLayout.jsx      # Split-screen wrapper for Login/Signup pages
│   │   ├── Button.jsx          # Standardized button component
│   │   ├── CalibrationModal.jsx# Interactive calibration dialog for skill verification
│   │   ├── Combobox.jsx        # Searchable autocomplete dropdown selector
│   │   ├── ComingSoonView.jsx  # Placeholder view for WIP feature modules
│   │   ├── DashboardLayout.jsx # App shell containing the collapsible Sidebar and top header
│   │   ├── ErrorState.jsx      # Generic UI error banner / fallback component
│   │   ├── FeatureCard.jsx     # Card component for landing page feature highlights
│   │   ├── Footer.jsx          # Global footer component
│   │   ├── FormField.jsx       # Wrapper for label, input, and error message
│   │   ├── Hero3DCanvas.jsx    # Interactive canvas element for landing page hero
│   │   ├── Input.jsx           # Styled text input component
│   │   ├── LoadingState.jsx    # Spinner / skeleton loading state
│   │   ├── Navbar.jsx          # Top navigation bar with theme toggle and user status
│   │   ├── OnboardingField.jsx # Dynamic form input renderer for onboarding steps
│   │   ├── OnboardingStep.jsx  # Step container with header & description
│   │   ├── PasswordInput.jsx   # Password field with toggleable show/hide visibility
│   │   ├── ProductPreview.jsx  # Interactive UI mockup preview on landing page
│   │   ├── ProgressIndicator.jsx# Multi-step progress bar component
│   │   ├── SectionHeading.jsx  # Reusable section title and subtitle
│   │   ├── Sidebar.jsx         # Dashboard navigation sidebar with module links & collapse
│   │   └── ThemeToggle.jsx     # Dark/Light mode switcher toggle
│   ├── context/                # React Context state management
│   │   ├── AuthContext.jsx     # Authentication state, login, signup, logout & onboarding tracking
│   │   └── ThemeContext.jsx    # Theme state (dark/light) with localStorage sync
│   ├── data/                   # Schemas and static configuration data
│   │   └── onboardingSchema.js # Form questions, step definitions, and options for onboarding
│   ├── features/               # Modular feature views (routed via Dashboard)
│   │   ├── home/
│   │   │   └── HomeView.jsx    # Dashboard home view
│   │   ├── interview-room/
│   │   │   └── InterviewRoomView.jsx # AI mock interview simulator view
│   │   ├── job-search/
│   │   │   └── JobSearchView.jsx     # Job search & matching workspace
│   │   ├── learning-roadmap/
│   │   │   └── LearningRoadmapView.jsx # Personalized learning milestone view
│   │   ├── resume-builder/
│   │   │   └── ResumeBuilderView.jsx # Resume builder & optimizer view
│   │   ├── settings/
│   │   │   └── SettingsView.jsx      # User profile and application settings view
│   │   ├── setu-ai/
│   │   │   └── SetuAiView.jsx        # Setu AI assistant chat & copilot interface
│   │   └── skill-gap/          # Comprehensive 5-stage Skill Gap Analysis Engine
│   │       ├── SkillGapWorkspace.jsx    # Master container & step coordinator for skill gap analysis
│   │       ├── Step1ResumeIntake.jsx    # Step 1: Resume upload & raw profile intake
│   │       ├── Step2TargetBenchmark.jsx # Step 2: Target role selection & industry benchmarking
│   │       ├── Step3GapReport.jsx       # Step 3: Visual skill gap analytics & breakdown report
│   │       ├── Step4DiagnosticArena.jsx # Step 4: Interactive diagnostic assessment arena
│   │       ├── Step5CalibratedRoadmap.jsx# Step 5: Final calibrated learning path & next steps
│   │       └── skillGapData.js          # Mock data models, skill clusters, questions & benchmarks
│   ├── pages/                  # Main routed page views
│   │   ├── DashboardPage.jsx   # Main application dashboard coordinating feature views
│   │   ├── DashboardPlaceholder.jsx # Fallback placeholder for nested dashboard routes
│   │   ├── LandingPage.jsx     # High-impact landing page with hero, showcases, & CTA
│   │   ├── LoginPage.jsx       # User sign-in page with credential validation
│   │   ├── OnboardingPage.jsx  # Multi-step onboarding wizard for new users
│   │   └── SignupPage.jsx      # User registration page
│   ├── App.jsx                 # Route definitions and application provider wrapping
│   ├── index.css               # Global CSS, Tailwind CSS imports, and custom design tokens
│   ├── main.jsx                # DOM entry point mount (`ReactDOM.createRoot`)
│   └── style.css               # Additional shared utility styling
├── index.html                  # HTML entry point template
├── package.json                # Project dependencies, scripts, and package metadata
├── package-lock.json           # Exact dependency lockfile
└── vite.config.js              # Vite configuration with React & Tailwind plugins
```

---

## 🔍 Detailed File Responsibilities

### 1. Root & Configuration
| File | Purpose |
| :--- | :--- |
| `index.html` | Root HTML template where the React application mounts (`#root`). Configures meta tags and fonts. |
| `vite.config.js` | Configures Vite bundler plugins (`@vitejs/plugin-react` and `@tailwindcss/vite`). |
| `package.json` | Defines project dependencies, versions, and npm run scripts (`dev`, `build`, `preview`). |

### 2. Core Application Entry
| File | Purpose |
| :--- | :--- |
| `src/main.jsx` | React entry file that renders `<App />` into the DOM. |
| `src/App.jsx` | Configures top-level routing, route guards (`ProtectedRoute`, `OnboardingRoute`, `AuthRoute`), and wraps the app with `ThemeProvider` and `AuthProvider`. |
| `src/index.css` | Tailwind CSS v4 entry point with design tokens, CSS variables (dark/light themes), scrollbars, and keyframe animations. |

### 3. Context & Global State (`src/context/`)
| File | Purpose |
| :--- | :--- |
| `AuthContext.jsx` | Manages user session state, simulated authentication (login/signup/logout), and onboarding completion status in `localStorage`. |
| `ThemeContext.jsx` | Manages dark/light theme toggle, toggling the `dark` class on the root HTML document and persisting preference. |

### 4. Page Components (`src/pages/`)
| File | Purpose |
| :--- | :--- |
| `LandingPage.jsx` | Public landing page featuring interactive hero canvases, feature highlights, product previews, testimonials, and navigation. |
| `LoginPage.jsx` | User login form with email/password validation, demo login capabilities, and navigation to signup. |
| `SignupPage.jsx` | Registration form collecting user credentials before redirecting to the onboarding flow. |
| `OnboardingPage.jsx` | Multi-step interactive onboarding flow capturing education, role preferences, current skill levels, and learning goals. |
| `DashboardPage.jsx` | Authenticated dashboard shell managing active tabs and rendering feature views (e.g. Skill Gap Workspace, Home, Setu AI). |

### 5. Skill Gap Feature Engine (`src/features/skill-gap/`)
| File | Purpose |
| :--- | :--- |
| `SkillGapWorkspace.jsx` | Master orchestrator for the 5-step Skill Gap calibration experience. Manages current step progress and transition states. |
| `Step1ResumeIntake.jsx` | Step 1: Upload resume PDF or parse user profile data. |
| `Step2TargetBenchmark.jsx` | Step 2: Select target role/seniority and view expected competency benchmarks. |
| `Step3GapReport.jsx` | Step 3: Comparative gap analysis report with match percentage, missing skills, and priority matrix. |
| `Step4DiagnosticArena.jsx` | Step 4: Interactive diagnostic questions / mini-coding challenges to calibrate claimed vs actual skill levels. |
| `Step5CalibratedRoadmap.jsx` | Step 5: Final customized growth roadmap with milestones, time estimates, and actionable learning modules. |
| `skillGapData.js` | Benchmark datasets, mock test questions, rubric evaluation metrics, and initial state presets. |

### 6. Shared Components (`src/components/`)
| Component | Purpose |
| :--- | :--- |
| `Navbar.jsx` | Top navigation bar for landing & marketing pages. |
| `Sidebar.jsx` | Collapsible sidebar navigation for the dashboard view. |
| `DashboardLayout.jsx` | Two-column layout with sidebar and main content area. |
| `AuthLayout.jsx` | Clean split-screen container for authentication pages. |
| `CalibrationModal.jsx` | Pop-up modal for adjusting and verifying skill levels. |
| `Combobox.jsx` | Searchable dropdown selector with keyboard navigation. |
| `Hero3DCanvas.jsx` | Canvas-based geometric background animation for the hero section. |
| `ThemeToggle.jsx` | Smooth theme switcher (Light / Dark mode). |
| `ProductPreview.jsx` | Interactive tabbed preview showing platform capabilities on landing page. |
| `Button.jsx` / `Input.jsx` / `FormField.jsx` / `PasswordInput.jsx` | Standardized atomic form and interactive elements. |
| `ComingSoonView.jsx` | Placeholder card for modules currently under development. |

---

## 🔒 Route Protection & Flow

- **Public Routes:** `/` (Landing Page)
- **Auth Routes:** `/login`, `/signup` *(redirects to dashboard if already logged in)*
- **Onboarding Route:** `/onboarding` *(gated by authentication; redirects to dashboard if already completed)*
- **Protected Routes:** `/dashboard`, `/skill-gap` *(redirects to `/login` if unauthenticated)*
