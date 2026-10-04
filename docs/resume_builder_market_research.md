# AI Resume Builder & JD Optimizer: Market Research & Improvement Strategy

## 1. What Your Frontend Currently Does (The Baseline)

The current app has **no Resume Builder section at all**. The only CV-related functionality is:

```
Skill Gap Tab → CV Upload (for parsing/extraction only) → AI Scanning → Gap Analysis
```

**Core Limitation**: The existing CV upload flow in `OfficerDashboard.jsx` (lines 1629–1678) is strictly an *input mechanism* for the Skill Gap Analysis pipeline — it accepts a PDF/DOCX, extracts competencies, and generates diagnostic MCQs. There is zero functionality for:
- Formatting or restructuring the uploaded resume
- Generating a new resume from a Job Description
- Optimizing an existing resume against a target JD
- Producing any downloadable output (LaTeX, PDF, or otherwise)

The backend schema in `context.md` stores `uploaded_file` (storage path/URL) in the `UserOnboarding` model, but this is only used for CV parsing intake — there are no models for resume templates, generated resumes, or LaTeX output.

### Exact Current Resume Feature Inventory

| Feature | Current State |
|---|---|
| Resume upload | ✅ File input for .pdf/.docx — but only feeds into skill gap extraction |
| Resume parsing | Simulated in frontend; backend has `uploaded_learning_materials` model for docs |
| Resume formatting / restructuring | ❌ None |
| JD-based resume generation | ❌ None |
| CV + JD optimization | ❌ None |
| LaTeX output | ❌ None |
| ATS score / keyword analysis | ❌ None |
| Downloadable resume PDF | ❌ None |
| Template selection | ❌ None |
| Section-by-section editing | ❌ None |

---

## 2. Competitor Landscape & Their Approaches

### Tier 1 — AI-Powered Resume Builders & JD Optimizers (B2C SaaS)

| Platform | Core Approach | What Makes Them Stand Out |
|---|---|---|
| **Teal** | All-in-One Job Search Hub | Tracks applications, stores resume versions, and provides line-by-line JD keyword matching. Users paste a JD → Teal highlights missing keywords → AI rewrites bullet points to integrate them. Free tier is generous. The "Resume Sync" feature manages multiple tailored versions from a single master resume. |
| **Rezi** | ATS-First AI Resume Builder | **Key insight**: Rezi's entire philosophy is "ATS safety first, design second." It enforces single-column, parser-friendly layouts. AI generates complete resume sections from a job title + brief description. Real-time ATS score shows how parseable your resume is. Highest reported ATS pass-through rate among competitors. |
| **Jobscan** | JD Gap Analysis & Keyword Scanner | Does NOT build resumes — it *audits* them. Upload resume + paste JD → Jobscan shows exact keyword match rate, missing hard skills, missing soft skills, and formatting issues. Gold standard for "how well does my resume match this JD?" scoring. |
| **Jobloo** | Automated Per-Job Tailoring | Generates a fully customized, ATS-optimized resume for every single job application automatically. Users maintain a master profile; Jobloo creates a new tailored version for each JD in seconds. Designed for high-volume applicants. |
| **Enhancv** | Visual Design + Storytelling | Combines professional templates with AI-powered content suggestions. Strong visual differentiation (color accents, skill bars, portfolio links). "Before/After" comparison feature shows how AI improved each bullet point. Best for creative industries where design matters. |
| **Kickresume** | Creative Visuals + AI Writer | 35+ designer templates with AI writing assistant powered by GPT-4. Generates cover letters alongside resumes. Supports export to PDF and DOCX. Strong on visual aesthetics but some templates are not ATS-friendly for conservative industries. |
| **TAILOR** | Truth-Preserving AI Optimization | Focuses on "honest" AI that avoids fabricating experience. Analyzes JD → rewrites existing bullet points to emphasize relevant skills without inventing new ones. Prioritizes keyword integration through contextual rewriting, not keyword stuffing. |

### Tier 2 — LaTeX-Native & Developer-Focused Resume Generators

| Platform | Core Approach | Technical Architecture |
|---|---|---|
| **RenderCV** | YAML → LaTeX → PDF (Open Source CLI) | **The current standard for programmatic LaTeX resumes**. Content is stored in YAML; RenderCV handles LaTeX typesetting. Multiple themes. Local-first, version-controllable with Git. Install via `pip install "rendercv[full]"`. Can be integrated into CI/CD pipelines. |
| **Resumake** | JSON → LaTeX → PDF (Web App) | Open-source web form that generates LaTeX source code and compiles to PDF. Users fill out a form → get raw `.tex` file + compiled PDF. Simple but no AI, no JD matching. |
| **Reactive Resume** | Full-Stack Open-Source Web Builder | Self-hostable resume builder with drag-and-drop sections. Supports PDF export, multi-language, OpenAI integration for content generation. No native LaTeX output, but generates clean PDFs. |
| **Overleaf** | Cloud-Based LaTeX Editor | Industry standard for academic and technical LaTeX editing. Hundreds of resume templates. No AI, no JD matching — purely a manual LaTeX editor with collaborative features. |
| **Typst** | Modern Markup Alternative to LaTeX | Newer typesetting system with faster compilation and more readable syntax than LaTeX. Growing adoption in 2026. Not LaTeX, but produces equally professional PDF output with simpler code. |

### Tier 3 — Enterprise ATS & Recruitment-Side CV Processing

| Platform | Core Approach | Relevance to Your Feature |
|---|---|---|
| **Workday / Greenhouse / Lever** | Enterprise ATS Parsing Engines | These are the systems that *receive* resumes. Understanding their parsing rules (no tables, no graphics, standard section headers) is essential for building a builder that produces ATS-safe output. |
| **Sovren (by Textkernel)** | Enterprise CV/JD Parsing API | Cloud API that parses resumes and JDs into structured JSON. Used by 80+ ATS platforms. Can be used as a parsing layer in your backend instead of building your own NLP parser. |
| **HireAbility** | AI Resume Parsing + Matching | Parses resumes into standardized fields and matches against JD requirements. Enterprise-grade, API-accessible. |

---

## 3. Is Your Current Approach Optimal?

**Short Answer: You have NO resume builder. This is an entirely new feature that needs to be built from scratch. However, you already have the backend infrastructure (CV parsing, JD extraction, skill gap computation) that forms the foundation — the resume builder is the natural output layer on top of your existing pipeline.**

### ✅ What You Can Leverage From Existing Infrastructure

- **CV Parsing Pipeline**: Your backend already accepts PDF/DOCX uploads and extracts text. The same `PyMuPDF / python-docx` extraction pipeline can feed the resume reformatter.
- **Skill Entity Extraction**: Your LLM-based skill extraction from CVs (Phase 1 of skill gap pipeline) produces structured `{ skills: [...], experience: [...] }` — this is the exact data format needed to populate LaTeX resume templates.
- **JD Parsing & Gap Computation**: Your Phase 2–3 pipeline already extracts required skills from JDs and computes the gap. The resume optimizer can use this same delta to know *which keywords to inject* into the optimized resume.
- **FRAC Competency Framework**: Your competency taxonomy provides a standardized vocabulary for skills — ensuring the resume uses recognized, professional terminology.
- **User Onboarding Profile**: The `UserOnboarding` model already stores `full_name`, `designation`, `department_division`, `highest_educational_qualification`, `completed_igot_courses`, `nssta_tpac_programmes_attended`, `external_certifications` — all of which are directly usable as resume section data.

### ❌ What's Completely Missing

**Problem 1: No Resume Data Model or Template System**
There is no database model for storing generated resumes, template selections, or version history. You need a `GeneratedResume` model that tracks which user generated which resume, for which JD, using which template, and stores the output LaTeX/PDF.

**Problem 2: No LaTeX Compilation Infrastructure**
Your backend has no LaTeX distribution installed (`pdflatex`, `xelatex`) and no pipeline for compiling `.tex` files into PDFs. This is a hard infrastructure requirement — you need either a local TeX Live installation on the server or a containerized compilation service.

**Problem 3: No Section-Aware Resume Structuring**
The current CV parser extracts *flat text*. A resume builder needs structured sections: `{contact_info: {}, summary: "", experience: [{company, role, dates, bullets: []}], education: [{...}], skills: [...], certifications: [...]}`. This structured extraction is different from (and more demanding than) skill-only extraction.

**Problem 4: No ATS Compliance Scoring**
The market has standardized on providing an "ATS Score" (0–100%) that tells users how likely their resume is to pass automated screening. This requires knowledge of ATS parsing rules (no tables, no graphics, standard headers, keyword density thresholds).

**Problem 5: No Bullet Point Rewriting Intelligence**
The most valuable feature of every competitor (Teal, Rezi, Jobloo) is AI rewriting of experience bullet points from passive/duty-focused to achievement/impact-focused using the STAR method (Situation, Task, Action, Result) with quantified metrics.

---

## 4. Better Approaches for Building the Resume Builder

Below are the three modes you described, analyzed against market best practices and ranked by implementation feasibility:

### 🥇 Mode A: Resume Reformatter (Upload Existing CV → Professional LaTeX Output)

**How it works**:
1. User uploads their existing resume (PDF/DOCX)
2. Backend extracts text using PyMuPDF / python-docx
3. LLM structures the raw text into a standardized JSON schema:
   ```json
   {
     "contact": { "name": "...", "email": "...", "phone": "...", "linkedin": "..." },
     "summary": "2-3 sentence professional summary",
     "experience": [
       { "company": "...", "role": "...", "dates": "...", "location": "...",
         "bullets": ["Achieved X by doing Y, resulting in Z%..."] }
     ],
     "education": [{ "institution": "...", "degree": "...", "year": "...", "gpa": "..." }],
     "skills": { "technical": [...], "domain": [...], "tools": [...] },
     "certifications": [...],
     "publications": [...]
   }
   ```
4. LLM *improves* each bullet point — rewrites passive duties into STAR-method achievement statements with quantified impact
5. Structured JSON is injected into a LaTeX template via Jinja2 templating
6. `pdflatex` / `xelatex` compiles the `.tex` into a downloadable PDF
7. Both the raw `.tex` source and compiled PDF are returned to the user

**Who does this**: Enhancv (before/after rewriting), Rezi (AI generation from brief descriptions), Reactive Resume (structured builder)

**Why it's valuable**: Users often have poorly formatted Word resumes with inconsistent styling, passive language, and no visual hierarchy. Simply reformatting with professional LaTeX typography makes a dramatic difference.

**Backend requirement**: PyMuPDF for extraction, LLM for structuring + rewriting, Jinja2 for LaTeX templating, `subprocess` + TeX Live for PDF compilation.

**Effort**: Medium. The core challenge is the structured extraction prompt and the LaTeX template design.

---

### 🥈 Mode B: JD-Based Reference Resume Generator (Paste JD → Generate Ideal Resume)

**How it works**:
1. User pastes or uploads a target Job Description
2. LLM extracts from the JD:
   - Required skills (mandatory vs. nice-to-have)
   - Expected experience level and years
   - Domain/industry context
   - Key responsibilities and projects
3. LLM generates a *hypothetical ideal candidate resume* that perfectly matches the JD:
   - Professional summary tailored to the role
   - Experience bullets that demonstrate each required skill with STAR-method examples
   - Skills section aligned to JD keywords
   - Education and certifications matching JD requirements
4. A prominent disclaimer is shown: **"This is a reference template — use it as a guide to restructure YOUR actual experience, not as a fabricated resume"**
5. Output: LaTeX source + compiled PDF

**Who does this**: Rezi (AI generates sections from job title), Jobloo (auto-generates per-JD versions), ChatGPT/Claude (manual prompting for reference resumes)

**Why it's valuable**: Users often don't know *what a good resume looks like* for their target role. This gives them a concrete reference showing the right structure, keywords, and bullet point style to emulate. It's a "goal state" they can reverse-engineer.

**Critical safeguard**: This mode MUST include a clear disclaimer that the generated resume is a *template/reference*, not a ready-to-submit document. Without this, users might submit fabricated resumes, which creates ethical and legal risk.

**Backend requirement**: Same LaTeX compilation pipeline as Mode A. The LLM prompt is different — instead of "restructure this existing resume," it's "generate an ideal resume for this JD." Requires careful prompt engineering to produce realistic but clearly synthetic content.

**Effort**: Low-Medium. If Mode A's LaTeX pipeline is built, Mode B is primarily a different LLM prompt template.

---

### 🥉 Mode C: CV + JD Optimization Engine (Upload Both → ATS-Optimized Output)

**How it works**:
1. User uploads their existing CV AND pastes a target JD
2. Backend runs TWO extraction pipelines in parallel:
   - **CV Pipeline**: Extract structured resume data (same as Mode A)
   - **JD Pipeline**: Extract required skills, keywords, and expectations (same as your existing Phase 2 gap analysis)
3. **Gap Computation** (reuse Phase 3 from your skill gap pipeline):
   - Semantic skill matching: Which JD requirements does the CV already satisfy?
   - Missing keywords: Which JD skills are absent from the CV?
   - Strength alignment: Which CV experiences are most relevant to the JD?
4. **AI Optimization** — LLM performs targeted rewrites:
   - **Bullet reordering**: Moves the most JD-relevant experience entries to the top
   - **Bullet rewriting**: Rewrites each experience bullet to emphasize skills that match JD keywords (without fabricating new experience)
   - **Keyword integration**: Naturally weaves missing JD keywords into existing bullet points where truthfully applicable
   - **Summary tailoring**: Generates a new professional summary specifically targeting this role
   - **Skills reordering**: Puts JD-relevant skills at the top of the skills section
5. **ATS Score**: Before/After comparison showing keyword match rate improvement
6. Output: Optimized LaTeX source + compiled PDF + ATS score breakdown

**Who does this**: Teal (keyword matching + rewriting), Jobscan (gap analysis + score), Jobloo (auto-tailored output), TAILOR (truth-preserving optimization)

**Why it's the highest-value mode**: This is the feature that directly increases a user's chance of getting past ATS screening. It combines your existing skill gap infrastructure with resume generation — creating a true end-to-end value loop.

**Backend requirement**: All of Mode A's pipeline + the JD parsing from your existing skill gap backend. The LLM prompt is the most complex — it must be instructed to ONLY rewrite/reorder existing experience, never fabricate new experience. The "truth-preserving" constraint (what TAILOR does) is the critical differentiator from generic AI.

**Effort**: Medium-High. This is the most complex mode but also the most impactful. The good news is it reuses heavy amounts of your existing skill gap infrastructure.

---

### 🏅 Bonus: ATS Compliance Scoring Engine

**How it works**: Runs independently or as part of Mode C. Evaluates any resume (uploaded or generated) against ATS parsing rules:

```
┌─────────────────────────────────────────────────────┐
│  ATS COMPLIANCE SCORE BREAKDOWN                      │
├─────────────────────────────────────────────────────┤
│  Format Safety:     9/10  (Clean single-column)      │
│  Section Headers:   8/10  (Standard "Experience")    │
│  Keyword Match:     7/10  (12/17 JD skills found)    │
│  Bullet Quality:    6/10  (3/8 lack quantification)  │
│  Contact Info:      10/10 (Email, phone, LinkedIn)   │
│  File Format:       10/10 (Text-selectable PDF)      │
├─────────────────────────────────────────────────────┤
│  OVERALL ATS SCORE: 83/100                           │
│  MISSING KEYWORDS:  Kubernetes, Terraform, ArgoCD    │
│  RECOMMENDATION:    Add missing keywords to Skills   │
│                     section or integrate into         │
│                     experience bullet points.         │
└─────────────────────────────────────────────────────┘
```

**Who does this**: Jobscan (gold standard), Rezi (real-time scoring), SkillSyncer (fast keyword matching)

**Backend requirement**: Rule-based checks (section headers, formatting) + LLM-based checks (bullet quality, keyword context). No LaTeX compilation needed — this is a scoring-only feature.

**Effort**: Low-Medium. Mostly prompt engineering + rule-based string checks.

---

## 5. Recommended Enhanced Pipeline for Your Backend

```
Phase 1 — Resume Data Extraction & Structuring
  └── Input: Uploaded PDF/DOCX resume
  └── PyMuPDF / python-docx: Extract raw text
  └── LLM prompt: "Parse this resume text into a structured JSON schema with
      contact_info, summary, experience[], education[], skills{}, certifications[]"
  └── LLM prompt 2: "Rewrite each experience bullet point using the STAR method.
      Preserve factual accuracy. Add quantified metrics where inferable."
  └── Output: Structured JSON with improved bullet points
  └── DB Model: ResumeProfile(user_id, structured_data_json, source_file_url,
      created_at, updated_at)

Phase 2 — JD Parsing & Keyword Extraction (Reuse Existing)
  └── Input: Pasted Job Description text or URL
  └── LLM prompt: "Extract from this JD: required_skills[], preferred_skills[],
      experience_years, key_responsibilities[], domain, seniority_level"
  └── Output: Structured JD requirements JSON
  └── Reuses your existing Phase 2 from skill gap pipeline

Phase 3 — CV ↔ JD Optimization (Mode C)
  └── Input: Structured resume JSON + Structured JD JSON
  └── Semantic matching: Map resume skills → JD requirements
  └── Gap identification: Which JD keywords are missing from resume?
  └── LLM prompt: "Optimize this resume JSON for this JD.
      Rules: (1) NEVER fabricate new experience or skills the candidate doesn't have.
      (2) Reorder experience bullets to prioritize JD-relevant items.
      (3) Rewrite bullet points to naturally integrate missing JD keywords WHERE
          the candidate's actual work truthfully supports it.
      (4) Generate a new professional summary targeting this specific role.
      (5) Reorder skills section to front-load JD-relevant skills."
  └── Output: Optimized resume JSON + change_log[] + ats_score_before/after
  └── DB Model: OptimizedResume(user_id, resume_profile_id, target_jd_text,
      optimized_data_json, ats_score, latex_source, pdf_url, created_at)

Phase 4 — LaTeX Template Engine & PDF Compilation
  └── Input: Structured (or optimized) resume JSON + template_id
  └── Template Selection: 3-5 professional LaTeX templates stored as .tex.j2 files
      • "Classic" — Single-column, Times New Roman, traditional academic style
      • "Modern" — Clean sans-serif (Inter/Roboto), subtle color accents
      • "Technical" — Monospace-accented headers, GitHub/portfolio links section
      • "Government" — Conservative, formal, aligned with civil service standards
      • "Compact" — Dense single-page with maximum information density
  └── Jinja2 Templating: Inject resume JSON data into selected .tex.j2 template
  └── LaTeX Compilation: subprocess.run(["pdflatex", "-interaction=nonstopmode",
      "output.tex"]) using server-side TeX Live installation
  └── Output: { latex_source: "...", pdf_url: "/media/resumes/...", pdf_bytes: ... }
  └── API: POST /api/resume/compile/ → returns downloadable .tex and .pdf

Phase 5 — ATS Compliance Scoring
  └── Input: Resume text (from any mode)
  └── Rule-based checks:
      • Section header compliance (Experience, Education, Skills — standard names)
      • Single-column layout verification
      • Contact info completeness (email, phone, LinkedIn)
      • File format (text-selectable, not image-scanned)
      • No tables, text boxes, or multi-column layouts
  └── LLM-based checks:
      • Bullet point quality (STAR method adherence, quantification presence)
      • Keyword integration naturalness (not stuffed)
      • Professional summary relevance to target role
  └── Keyword match scoring (if JD provided):
      • Count JD required_skills found in resume
      • Semantic matching for synonyms ("ML" ↔ "Machine Learning")
  └── Output: { overall_score: 83, breakdown: {...}, missing_keywords: [...],
      suggestions: [...] }
```

---

## 6. Practical Implementation Guide: LaTeX Compilation Backend

Since LaTeX output is the core differentiator of your resume builder, here is the exact implementation architecture:

### Option A: Server-Side TeX Live (Recommended for Hackathon)

```
Backend Server (Django / FastAPI)
         │
         ▼
┌──────────────────────────────────────────┐
│ 1. Install TeX Live (once on server)      │
│    $ sudo apt-get install texlive-full    │
│    (or texlive-latex-recommended for      │
│     smaller install ~500MB)               │
│                                           │
│ 2. Store LaTeX templates as .tex.j2       │
│    files in /templates/resume/            │
│                                           │
│ 3. Python pipeline:                       │
│    a. Load template via Jinja2            │
│    b. Inject resume JSON data             │
│    c. Write rendered .tex to temp dir     │
│    d. subprocess.run(["pdflatex",         │
│       "-output-directory", tmp_dir,       │
│       "resume.tex"])                      │
│    e. Read compiled PDF from tmp_dir      │
│    f. Return both .tex and .pdf to user   │
└──────────────────────────────────────────┘
```

**Python code sketch**:
```python
import subprocess, tempfile, os
from jinja2 import Environment, FileSystemLoader

def compile_latex_resume(resume_data: dict, template_name: str = "modern"):
    env = Environment(
        loader=FileSystemLoader("templates/resume/"),
        block_start_string='\\BLOCK{',    # Avoid LaTeX conflict
        block_end_string='}',
        variable_start_string='\\VAR{',
        variable_end_string='}',
        comment_start_string='\\#{',
        comment_end_string='}',
    )
    template = env.get_template(f"{template_name}.tex.j2")
    rendered_tex = template.render(**resume_data)

    with tempfile.TemporaryDirectory() as tmp:
        tex_path = os.path.join(tmp, "resume.tex")
        with open(tex_path, "w", encoding="utf-8") as f:
            f.write(rendered_tex)

        # Compile twice for proper references
        for _ in range(2):
            subprocess.run(
                ["pdflatex", "-interaction=nonstopmode", "-output-directory", tmp, tex_path],
                capture_output=True, timeout=30
            )

        pdf_path = os.path.join(tmp, "resume.pdf")
        with open(pdf_path, "rb") as f:
            pdf_bytes = f.read()

    return rendered_tex, pdf_bytes
```

### Option B: RenderCV Integration (If You Want Open-Source Templates)

```python
# pip install "rendercv[full]"
# Use RenderCV's YAML → LaTeX → PDF pipeline programmatically

import rendercv
# Convert your resume JSON → RenderCV YAML format
# Call rendercv.render() to produce PDF
```

### Option C: Docker-Isolated Compilation (Production-Grade)

```dockerfile
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y texlive-latex-recommended texlive-fonts-recommended
COPY templates/ /app/templates/
COPY compile_service.py /app/
CMD ["python", "/app/compile_service.py"]
```

This isolates LaTeX compilation in a container, preventing security risks from user-injected LaTeX code.

---

## 7. LaTeX Template Architecture

Each template is a `.tex.j2` Jinja2 file. Example structure for a "Modern" template:

```latex
\documentclass[11pt,a4paper]{article}
\usepackage[margin=0.7in]{geometry}
\usepackage{titlesec, enumitem, hyperref, fontspec}
\setmainfont{Inter}  % Modern sans-serif

\begin{document}

% ── HEADER ──
\begin{center}
  {\LARGE\textbf{\VAR{contact.name}}} \\[4pt]
  \VAR{contact.email} \,|\, \VAR{contact.phone} \,|\,
  \href{\VAR{contact.linkedin}}{LinkedIn}
\end{center}

% ── PROFESSIONAL SUMMARY ──
\section*{Professional Summary}
\VAR{summary}

% ── EXPERIENCE ──
\section*{Experience}
\BLOCK{for job in experience}
\textbf{\VAR{job.role}} \hfill \VAR{job.dates} \\
\textit{\VAR{job.company}} \hfill \VAR{job.location}
\begin{itemize}[nosep, leftmargin=*]
  \BLOCK{for bullet in job.bullets}
  \item \VAR{bullet}
  \BLOCK{endfor}
\end{itemize}
\BLOCK{endfor}

% ── EDUCATION ──
\section*{Education}
\BLOCK{for edu in education}
\textbf{\VAR{edu.degree}} — \VAR{edu.institution} \hfill \VAR{edu.year}
\BLOCK{endfor}

% ── SKILLS ──
\section*{Technical Skills}
\VAR{skills.technical | join(', ')}

\end{document}
```

---

## 8. Summary: What to Build vs What to Skip

| Feature | Priority | Why |
|---|---|---|
| Mode A: Resume Reformatter (upload CV → structured LaTeX PDF) | **Must Have** | Foundation layer. If this works, Mode B and C are incremental. The structured extraction + LaTeX compilation pipeline is reused by all three modes. |
| Mode C: CV + JD Optimizer (upload both → ATS-optimized LaTeX PDF) | **Must Have** | Highest user value. Directly reuses your existing skill gap JD parsing + gap computation. This is what makes the feature intelligent, not just a formatter. |
| LaTeX template engine with Jinja2 + pdflatex compilation | **Must Have** | Your core differentiator. Every competitor outputs generic PDFs — you output professional LaTeX with downloadable `.tex` source. This appeals strongly to technical/academic users. |
| STAR-method bullet point rewriting via LLM | **Must Have** | This is the single biggest quality improvement an AI can make to any resume. Turning "Managed team" into "Led 8-person cross-functional team, delivering survey infrastructure 3 weeks ahead of deadline, reducing field enumeration costs by 22%." |
| ATS compliance scoring (keyword match + format check) | **Should Have** | Users need to see WHY the optimized version is better. A before/after score (e.g., 54% → 87%) makes the value instantly visible. |
| Mode B: JD → Reference Resume Generator | **Should Have** | Lower priority than Mode A/C because it generates synthetic content. Useful as a "what should my resume look like?" reference tool, but requires a clear disclaimer to avoid ethical issues. |
| 3-5 LaTeX template themes (Classic, Modern, Technical, Government, Compact) | **Should Have** | Template variety is expected by users. Start with 2 (Modern + Classic), add more later. |
| Version history (user can see/download past generated resumes) | **Nice to Have** | Store in DB with `OptimizedResume` model. Useful for users applying to multiple jobs, each needing a tailored version. |
| Real-time LaTeX preview in browser (live editing) | **Future Scope** | Requires a WebSocket-based compilation loop or client-side Typst/LaTeX.js. Very cool but high effort for a hackathon. |
| Cover letter generation alongside resume | **Future Scope** | Natural extension but separate feature. Many competitors (Kickresume, Rezi) bundle this. |
| Resume version diff (highlight what changed between original and optimized) | **Future Scope** | "Before/After" visual diff is a powerful UX feature (Enhancv does this well), but adds complexity to the frontend. |

> [!IMPORTANT]
> The single most practical architecture decision is building the **LaTeX compilation pipeline first** (Phase 4 in the backend pipeline above). Once you have `JSON → Jinja2 → .tex → pdflatex → PDF`, all three modes (Reformatter, JD Generator, CV+JD Optimizer) become different LLM prompts feeding into the same output engine. The LaTeX pipeline is the shared backbone — invest your time there first, then iterate on the AI intelligence layer.

> [!TIP]
> For the tech stack: Use your existing **Django backend** with **PyMuPDF** for PDF text extraction and **Jinja2** for LaTeX template rendering. Install **TeX Live** on the server (`apt-get install texlive-latex-recommended texlive-fonts-recommended` — ~500MB, much smaller than `texlive-full`). For the LLM layer, use **Gemini Pro / GPT-4o** with structured JSON output mode to extract resume sections. For Jinja2 + LaTeX, use custom delimiters (`\VAR{}`, `\BLOCK{}`) to avoid conflicts with LaTeX's curly brace syntax. The entire pipeline from upload to downloadable PDF can be a single Django view: `POST /api/resume/build/` accepting `{file: <upload>, mode: "reformat|generate|optimize", jd_text: "...", template: "modern"}` and returning `{latex_source: "...", pdf_download_url: "...", ats_score: {...}}`.
