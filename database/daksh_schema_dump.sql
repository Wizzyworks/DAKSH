--
-- PostgreSQL database dump
--

\restrict jEX3JDIbFcaZ3MiBiU5OhaUa5MsufHHHxo0P50nMIGaeeJDbsL5w5nDCCDAUa7F

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: daksh; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA daksh;


ALTER SCHEMA daksh OWNER TO postgres;

--
-- Name: alert_frequency_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.alert_frequency_enum AS ENUM (
    'instant',
    'daily',
    'weekly'
);


ALTER TYPE daksh.alert_frequency_enum OWNER TO postgres;

--
-- Name: bloom_level_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.bloom_level_enum AS ENUM (
    'Remember',
    'Understand',
    'Apply',
    'Analyze',
    'Evaluate',
    'Create'
);


ALTER TYPE daksh.bloom_level_enum OWNER TO postgres;

--
-- Name: compilation_status_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.compilation_status_enum AS ENUM (
    'pending',
    'success',
    'failed'
);


ALTER TYPE daksh.compilation_status_enum OWNER TO postgres;

--
-- Name: content_type_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.content_type_enum AS ENUM (
    'video',
    'pdf',
    'lab'
);


ALTER TYPE daksh.content_type_enum OWNER TO postgres;

--
-- Name: course_progress_status_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.course_progress_status_enum AS ENUM (
    'not_started',
    'in_progress',
    'completed'
);


ALTER TYPE daksh.course_progress_status_enum OWNER TO postgres;

--
-- Name: difficulty_level_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.difficulty_level_enum AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
);


ALTER TYPE daksh.difficulty_level_enum OWNER TO postgres;

--
-- Name: event_type_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.event_type_enum AS ENUM (
    'hackathon',
    'sprint',
    'webinar',
    'hiring_challenge'
);


ALTER TYPE daksh.event_type_enum OWNER TO postgres;

--
-- Name: gap_severity_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.gap_severity_enum AS ENUM (
    'Low',
    'Medium',
    'High',
    'Critical'
);


ALTER TYPE daksh.gap_severity_enum OWNER TO postgres;

--
-- Name: interview_status_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.interview_status_enum AS ENUM (
    'pending',
    'in_progress',
    'completed'
);


ALTER TYPE daksh.interview_status_enum OWNER TO postgres;

--
-- Name: job_type_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.job_type_enum AS ENUM (
    'full_time',
    'part_time',
    'internship',
    'contract'
);


ALTER TYPE daksh.job_type_enum OWNER TO postgres;

--
-- Name: match_status_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.match_status_enum AS ENUM (
    'suggested',
    'saved',
    'applied',
    'rejected'
);


ALTER TYPE daksh.match_status_enum OWNER TO postgres;

--
-- Name: proficiency_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.proficiency_enum AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
);


ALTER TYPE daksh.proficiency_enum OWNER TO postgres;

--
-- Name: readiness_level_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.readiness_level_enum AS ENUM (
    'job_ready',
    'minor_gaps',
    'critical_gaps'
);


ALTER TYPE daksh.readiness_level_enum OWNER TO postgres;

--
-- Name: resume_mode_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.resume_mode_enum AS ENUM (
    'reformat',
    'generate',
    'optimize'
);


ALTER TYPE daksh.resume_mode_enum OWNER TO postgres;

--
-- Name: resume_template_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.resume_template_enum AS ENUM (
    'classic',
    'modern',
    'technical'
);


ALTER TYPE daksh.resume_template_enum OWNER TO postgres;

--
-- Name: roadmap_status_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.roadmap_status_enum AS ENUM (
    'active',
    'completed',
    'paused'
);


ALTER TYPE daksh.roadmap_status_enum OWNER TO postgres;

--
-- Name: round_format_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.round_format_enum AS ENUM (
    'MCQ',
    'Descriptive',
    'Coding',
    'Voice'
);


ALTER TYPE daksh.round_format_enum OWNER TO postgres;

--
-- Name: session_type_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.session_type_enum AS ENUM (
    'mock',
    'domain',
    'remediation'
);


ALTER TYPE daksh.session_type_enum OWNER TO postgres;

--
-- Name: skill_category_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.skill_category_enum AS ENUM (
    'technical',
    'domain',
    'soft',
    'tool'
);


ALTER TYPE daksh.skill_category_enum OWNER TO postgres;

--
-- Name: skill_importance_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.skill_importance_enum AS ENUM (
    'mandatory',
    'preferred'
);


ALTER TYPE daksh.skill_importance_enum OWNER TO postgres;

--
-- Name: skill_source_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.skill_source_enum AS ENUM (
    'cv',
    'github',
    'quiz',
    'interview',
    'self'
);


ALTER TYPE daksh.skill_source_enum OWNER TO postgres;

--
-- Name: stage_status_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.stage_status_enum AS ENUM (
    'locked',
    'unlocked',
    'completed'
);


ALTER TYPE daksh.stage_status_enum OWNER TO postgres;

--
-- Name: stage_type_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.stage_type_enum AS ENUM (
    'course',
    'quiz',
    'lab',
    'assessment'
);


ALTER TYPE daksh.stage_type_enum OWNER TO postgres;

--
-- Name: user_role_enum; Type: TYPE; Schema: daksh; Owner: postgres
--

CREATE TYPE daksh.user_role_enum AS ENUM (
    'candidate',
    'mentor',
    'admin'
);


ALTER TYPE daksh.user_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ai_evaluations_feedback; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.ai_evaluations_feedback (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    response_id uuid NOT NULL,
    evaluated_by_model character varying(100),
    overall_score numeric(3,1),
    content_accuracy_score numeric(3,1),
    depth_score numeric(3,1),
    star_structure_score numeric(3,1),
    code_quality_score numeric(3,1),
    communication_score numeric(3,1),
    detailed_feedback text NOT NULL,
    missed_concepts jsonb,
    strengths jsonb,
    remediation_suggestions jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.ai_evaluations_feedback OWNER TO postgres;

--
-- Name: courses; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    provider character varying(100),
    content_type daksh.content_type_enum DEFAULT 'video'::daksh.content_type_enum,
    video_embed_url text,
    pdf_material_url text,
    difficulty_level daksh.difficulty_level_enum DEFAULT 'beginner'::daksh.difficulty_level_enum,
    duration_minutes integer,
    xp_reward integer DEFAULT 50,
    tags character varying[],
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.courses OWNER TO postgres;

--
-- Name: dynamic_learning_roadmaps; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.dynamic_learning_roadmaps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    gap_report_id uuid,
    title character varying(255) NOT NULL,
    target_role_goal character varying(150),
    total_stages integer DEFAULT 8,
    completed_stages integer DEFAULT 0,
    status daksh.roadmap_status_enum DEFAULT 'active'::daksh.roadmap_status_enum,
    generated_by_ai boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.dynamic_learning_roadmaps OWNER TO postgres;

--
-- Name: event_hackathon_listings; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.event_hackathon_listings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    organizer character varying(255) NOT NULL,
    event_type daksh.event_type_enum DEFAULT 'hackathon'::daksh.event_type_enum,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    registration_deadline timestamp without time zone,
    location_city character varying(100),
    is_online boolean DEFAULT true,
    themes_tags character varying[],
    difficulty_level daksh.difficulty_level_enum DEFAULT 'intermediate'::daksh.difficulty_level_enum,
    prize_pool character varying(100),
    registration_url text NOT NULL,
    source_platform character varying(50),
    is_active boolean DEFAULT true,
    scraped_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.event_hackathon_listings OWNER TO postgres;

--
-- Name: github_portfolio_analyses; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.github_portfolio_analyses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    github_username character varying(100),
    analyzed_repos_count integer DEFAULT 0,
    detected_languages jsonb,
    detected_frameworks jsonb,
    inferred_skills jsonb,
    commit_activity_score numeric(5,2),
    raw_insights jsonb,
    scanned_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.github_portfolio_analyses OWNER TO postgres;

--
-- Name: interview_questions; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.interview_questions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    round_id uuid NOT NULL,
    question_order integer NOT NULL,
    format daksh.round_format_enum DEFAULT 'MCQ'::daksh.round_format_enum,
    difficulty_level daksh.difficulty_level_enum DEFAULT 'intermediate'::daksh.difficulty_level_enum,
    competency_domain character varying(100),
    bloom_level daksh.bloom_level_enum,
    question_text text NOT NULL,
    options_json jsonb,
    correct_answer text,
    ideal_reference_answer text,
    coding_starter_code text,
    test_cases_json jsonb,
    evaluation_rubric_json jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.interview_questions OWNER TO postgres;

--
-- Name: interview_rounds; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.interview_rounds (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    round_number integer NOT NULL,
    round_format daksh.round_format_enum DEFAULT 'MCQ'::daksh.round_format_enum,
    title character varying(255) NOT NULL,
    time_limit_minutes integer,
    status daksh.interview_status_enum DEFAULT 'pending'::daksh.interview_status_enum,
    round_score numeric(5,2),
    started_at timestamp without time zone,
    ended_at timestamp without time zone
);


ALTER TABLE daksh.interview_rounds OWNER TO postgres;

--
-- Name: interview_scorecards; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.interview_scorecards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    radar_metrics_json jsonb,
    technical_score numeric(5,2),
    communication_score numeric(5,2),
    problem_solving_score numeric(5,2),
    ai_executive_summary text,
    actionable_takeaways jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.interview_scorecards OWNER TO postgres;

--
-- Name: interview_sessions; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.interview_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    session_type daksh.session_type_enum DEFAULT 'mock'::daksh.session_type_enum,
    target_role_id uuid,
    session_title character varying(255),
    status daksh.interview_status_enum DEFAULT 'pending'::daksh.interview_status_enum,
    overall_score numeric(5,2),
    total_rounds integer DEFAULT 4,
    current_round integer DEFAULT 1,
    started_at timestamp without time zone,
    ended_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.interview_sessions OWNER TO postgres;

--
-- Name: job_alert_preferences; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.job_alert_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role_keywords character varying[],
    preferred_locations character varying[],
    preferred_job_types character varying[],
    min_salary numeric,
    frequency daksh.alert_frequency_enum DEFAULT 'daily'::daksh.alert_frequency_enum,
    notification_channels character varying[],
    is_active boolean DEFAULT true,
    last_notified_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.job_alert_preferences OWNER TO postgres;

--
-- Name: job_listings; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.job_listings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    company_name character varying(255) NOT NULL,
    company_logo_url text,
    location character varying(150),
    is_remote boolean DEFAULT false,
    job_type daksh.job_type_enum DEFAULT 'full_time'::daksh.job_type_enum,
    experience_min_years numeric,
    experience_max_years numeric,
    salary_min numeric,
    salary_max numeric,
    salary_currency character varying(10) DEFAULT 'INR'::character varying,
    description_raw text NOT NULL,
    extracted_skills jsonb,
    application_url text NOT NULL,
    deadline_date timestamp without time zone,
    date_posted timestamp without time zone,
    source_platform character varying(50),
    is_active boolean DEFAULT true,
    scraped_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.job_listings OWNER TO postgres;

--
-- Name: job_roles_taxonomy; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.job_roles_taxonomy (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_title character varying(150) NOT NULL,
    role_slug character varying(150) NOT NULL,
    department_domain character varying(100),
    industry character varying(100),
    description text,
    seniority_level character varying(50),
    standard_required_skills jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.job_roles_taxonomy OWNER TO postgres;

--
-- Name: resume_ats_audits; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.resume_ats_audits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    resume_id uuid NOT NULL,
    target_jd_id uuid,
    overall_ats_score numeric(5,2),
    format_safety_score numeric(3,1),
    section_headers_score numeric(3,1),
    keyword_match_score numeric(3,1),
    bullet_quant_score numeric(3,1),
    matched_keywords jsonb,
    missing_keywords jsonb,
    actionable_recommendations jsonb,
    audited_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.resume_ats_audits OWNER TO postgres;

--
-- Name: resume_compilations; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.resume_compilations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    resume_id uuid NOT NULL,
    latex_source_code text NOT NULL,
    compiled_pdf_url text,
    compilation_status daksh.compilation_status_enum DEFAULT 'pending'::daksh.compilation_status_enum,
    compiler_log text,
    compiled_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.resume_compilations OWNER TO postgres;

--
-- Name: resume_structured_content; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.resume_structured_content (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    resume_id uuid NOT NULL,
    contact_info jsonb,
    professional_summary text,
    experience jsonb,
    education jsonb,
    skills jsonb,
    projects jsonb,
    certifications jsonb,
    publications_awards jsonb,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.resume_structured_content OWNER TO postgres;

--
-- Name: resumes_master; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.resumes_master (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    resume_title character varying(200) NOT NULL,
    version_number integer DEFAULT 1,
    mode daksh.resume_mode_enum DEFAULT 'generate'::daksh.resume_mode_enum,
    template_name daksh.resume_template_enum DEFAULT 'modern'::daksh.resume_template_enum,
    target_jd_id uuid,
    is_primary boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.resumes_master OWNER TO postgres;

--
-- Name: roadmap_stages; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.roadmap_stages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    roadmap_id uuid NOT NULL,
    stage_number integer NOT NULL,
    title character varying(255) NOT NULL,
    stage_type daksh.stage_type_enum DEFAULT 'course'::daksh.stage_type_enum,
    course_id uuid,
    target_skill_id uuid,
    xp_points integer DEFAULT 100,
    status daksh.stage_status_enum DEFAULT 'locked'::daksh.stage_status_enum,
    unlocked_at timestamp without time zone,
    completed_at timestamp without time zone
);


ALTER TABLE daksh.roadmap_stages OWNER TO postgres;

--
-- Name: role_skill_requirements; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.role_skill_requirements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_id uuid NOT NULL,
    skill_id uuid NOT NULL,
    importance daksh.skill_importance_enum DEFAULT 'mandatory'::daksh.skill_importance_enum,
    benchmark_score_min numeric(5,2),
    weightage numeric(3,2) DEFAULT 1.0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.role_skill_requirements OWNER TO postgres;

--
-- Name: skill_aliases; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.skill_aliases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    skill_id uuid NOT NULL,
    alias_name character varying(150) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE daksh.skill_aliases OWNER TO postgres;

--
-- Name: skill_gap_items; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.skill_gap_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    report_id uuid NOT NULL,
    skill_id uuid NOT NULL,
    user_current_score numeric(5,2),
    required_score numeric(5,2),
    gap_severity daksh.gap_severity_enum,
    recommended_action text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.skill_gap_items OWNER TO postgres;

--
-- Name: skill_gap_reports; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.skill_gap_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    target_role_id uuid,
    target_jd_id uuid,
    overall_match_score numeric(5,2),
    readiness_level daksh.readiness_level_enum,
    total_required_skills integer,
    skills_matched_count integer,
    skills_gap_count integer,
    analysis_summary text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.skill_gap_reports OWNER TO postgres;

--
-- Name: skills_master; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.skills_master (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    canonical_name character varying(150) NOT NULL,
    slug character varying(150) NOT NULL,
    category daksh.skill_category_enum NOT NULL,
    description text,
    is_verified boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE daksh.skills_master OWNER TO postgres;

--
-- Name: spaced_repetition_schedules; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.spaced_repetition_schedules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    concept_skill_id uuid NOT NULL,
    current_interval_days integer DEFAULT 1,
    repetition_count integer DEFAULT 0,
    ease_factor numeric(3,2) DEFAULT 2.50,
    last_reviewed_at timestamp without time zone,
    next_review_due_at timestamp without time zone NOT NULL,
    retention_streak integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.spaced_repetition_schedules OWNER TO postgres;

--
-- Name: target_job_descriptions; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.target_job_descriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    job_title character varying(200) NOT NULL,
    company_name character varying(200),
    raw_jd_text text NOT NULL,
    jd_source_url text,
    extracted_skills jsonb,
    experience_required_years numeric,
    parsed_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.target_job_descriptions OWNER TO postgres;

--
-- Name: user_course_progress; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.user_course_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    roadmap_stage_id uuid,
    watch_time_seconds integer DEFAULT 0,
    progress_percent numeric(5,2) DEFAULT 0.00,
    status daksh.course_progress_status_enum DEFAULT 'not_started'::daksh.course_progress_status_enum,
    last_accessed_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone
);


ALTER TABLE daksh.user_course_progress OWNER TO postgres;

--
-- Name: user_gamification_profile; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.user_gamification_profile (
    user_id uuid NOT NULL,
    total_xp integer DEFAULT 0 NOT NULL,
    current_streak_days integer DEFAULT 0 NOT NULL,
    longest_streak_days integer DEFAULT 0 NOT NULL,
    last_active_date date,
    tier_badge character varying(50) DEFAULT 'Bronze'::character varying NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE daksh.user_gamification_profile OWNER TO postgres;

--
-- Name: user_interview_responses; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.user_interview_responses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    question_id uuid NOT NULL,
    user_id uuid NOT NULL,
    response_format daksh.round_format_enum,
    user_submission_text text,
    code_output_stdout text,
    code_output_stderr text,
    audio_recording_url text,
    stt_transcription_text text,
    time_spent_seconds integer,
    submitted_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.user_interview_responses OWNER TO postgres;

--
-- Name: user_job_matches; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.user_job_matches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    job_listing_id uuid NOT NULL,
    match_percentage numeric(5,2),
    skill_match_ratio numeric(5,2),
    experience_match boolean,
    match_breakdown_json jsonb,
    status daksh.match_status_enum DEFAULT 'suggested'::daksh.match_status_enum,
    applied_date timestamp without time zone,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.user_job_matches OWNER TO postgres;

--
-- Name: user_opportunity_bookmarks; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.user_opportunity_bookmarks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    job_id uuid,
    event_id uuid,
    user_notes text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT chk_bookmark_target CHECK (((job_id IS NOT NULL) OR (event_id IS NOT NULL)))
);


ALTER TABLE daksh.user_opportunity_bookmarks OWNER TO postgres;

--
-- Name: user_profiles; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.user_profiles (
    user_id uuid NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    phone_number character varying(20),
    college_name character varying(255),
    college_tier character varying(20),
    degree character varying(100),
    branch_discipline character varying(150),
    current_status character varying(50),
    graduation_year integer,
    current_semester character varying(20),
    experience_months integer DEFAULT 0,
    target_role character varying(150),
    target_company_types character varying[],
    raw_resume_url text,
    github_url character varying(255),
    linkedin_url character varying(255),
    portfolio_url character varying(255),
    bio text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE daksh.user_profiles OWNER TO postgres;

--
-- Name: user_skills; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.user_skills (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    skill_id uuid NOT NULL,
    proficiency daksh.proficiency_enum DEFAULT 'beginner'::daksh.proficiency_enum,
    source daksh.skill_source_enum DEFAULT 'self'::daksh.skill_source_enum,
    verified boolean DEFAULT false,
    score numeric(5,2),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE daksh.user_skills OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: daksh; Owner: postgres
--

CREATE TABLE daksh.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role daksh.user_role_enum DEFAULT 'candidate'::daksh.user_role_enum NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE daksh.users OWNER TO postgres;

--
-- Name: ai_evaluations_feedback ai_evaluations_feedback_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.ai_evaluations_feedback
    ADD CONSTRAINT ai_evaluations_feedback_pkey PRIMARY KEY (id);


--
-- Name: ai_evaluations_feedback ai_evaluations_feedback_response_id_key; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.ai_evaluations_feedback
    ADD CONSTRAINT ai_evaluations_feedback_response_id_key UNIQUE (response_id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: courses courses_slug_key; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.courses
    ADD CONSTRAINT courses_slug_key UNIQUE (slug);


--
-- Name: dynamic_learning_roadmaps dynamic_learning_roadmaps_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.dynamic_learning_roadmaps
    ADD CONSTRAINT dynamic_learning_roadmaps_pkey PRIMARY KEY (id);


--
-- Name: event_hackathon_listings event_hackathon_listings_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.event_hackathon_listings
    ADD CONSTRAINT event_hackathon_listings_pkey PRIMARY KEY (id);


--
-- Name: github_portfolio_analyses github_portfolio_analyses_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.github_portfolio_analyses
    ADD CONSTRAINT github_portfolio_analyses_pkey PRIMARY KEY (id);


--
-- Name: interview_questions interview_questions_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.interview_questions
    ADD CONSTRAINT interview_questions_pkey PRIMARY KEY (id);


--
-- Name: interview_rounds interview_rounds_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.interview_rounds
    ADD CONSTRAINT interview_rounds_pkey PRIMARY KEY (id);


--
-- Name: interview_scorecards interview_scorecards_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.interview_scorecards
    ADD CONSTRAINT interview_scorecards_pkey PRIMARY KEY (id);


--
-- Name: interview_scorecards interview_scorecards_session_id_key; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.interview_scorecards
    ADD CONSTRAINT interview_scorecards_session_id_key UNIQUE (session_id);


--
-- Name: interview_sessions interview_sessions_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.interview_sessions
    ADD CONSTRAINT interview_sessions_pkey PRIMARY KEY (id);


--
-- Name: job_alert_preferences job_alert_preferences_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.job_alert_preferences
    ADD CONSTRAINT job_alert_preferences_pkey PRIMARY KEY (id);


--
-- Name: job_listings job_listings_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.job_listings
    ADD CONSTRAINT job_listings_pkey PRIMARY KEY (id);


--
-- Name: job_roles_taxonomy job_roles_taxonomy_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.job_roles_taxonomy
    ADD CONSTRAINT job_roles_taxonomy_pkey PRIMARY KEY (id);


--
-- Name: job_roles_taxonomy job_roles_taxonomy_role_slug_key; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.job_roles_taxonomy
    ADD CONSTRAINT job_roles_taxonomy_role_slug_key UNIQUE (role_slug);


--
-- Name: resume_ats_audits resume_ats_audits_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.resume_ats_audits
    ADD CONSTRAINT resume_ats_audits_pkey PRIMARY KEY (id);


--
-- Name: resume_compilations resume_compilations_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.resume_compilations
    ADD CONSTRAINT resume_compilations_pkey PRIMARY KEY (id);


--
-- Name: resume_structured_content resume_structured_content_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.resume_structured_content
    ADD CONSTRAINT resume_structured_content_pkey PRIMARY KEY (id);


--
-- Name: resume_structured_content resume_structured_content_resume_id_key; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.resume_structured_content
    ADD CONSTRAINT resume_structured_content_resume_id_key UNIQUE (resume_id);


--
-- Name: resumes_master resumes_master_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.resumes_master
    ADD CONSTRAINT resumes_master_pkey PRIMARY KEY (id);


--
-- Name: roadmap_stages roadmap_stages_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.roadmap_stages
    ADD CONSTRAINT roadmap_stages_pkey PRIMARY KEY (id);


--
-- Name: role_skill_requirements role_skill_requirements_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.role_skill_requirements
    ADD CONSTRAINT role_skill_requirements_pkey PRIMARY KEY (id);


--
-- Name: skill_aliases skill_aliases_alias_name_key; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.skill_aliases
    ADD CONSTRAINT skill_aliases_alias_name_key UNIQUE (alias_name);


--
-- Name: skill_aliases skill_aliases_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.skill_aliases
    ADD CONSTRAINT skill_aliases_pkey PRIMARY KEY (id);


--
-- Name: skill_gap_items skill_gap_items_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.skill_gap_items
    ADD CONSTRAINT skill_gap_items_pkey PRIMARY KEY (id);


--
-- Name: skill_gap_reports skill_gap_reports_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.skill_gap_reports
    ADD CONSTRAINT skill_gap_reports_pkey PRIMARY KEY (id);


--
-- Name: skills_master skills_master_canonical_name_key; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.skills_master
    ADD CONSTRAINT skills_master_canonical_name_key UNIQUE (canonical_name);


--
-- Name: skills_master skills_master_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.skills_master
    ADD CONSTRAINT skills_master_pkey PRIMARY KEY (id);


--
-- Name: skills_master skills_master_slug_key; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.skills_master
    ADD CONSTRAINT skills_master_slug_key UNIQUE (slug);


--
-- Name: spaced_repetition_schedules spaced_repetition_schedules_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.spaced_repetition_schedules
    ADD CONSTRAINT spaced_repetition_schedules_pkey PRIMARY KEY (id);


--
-- Name: target_job_descriptions target_job_descriptions_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.target_job_descriptions
    ADD CONSTRAINT target_job_descriptions_pkey PRIMARY KEY (id);


--
-- Name: skill_gap_items uq_report_skill_gap; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.skill_gap_items
    ADD CONSTRAINT uq_report_skill_gap UNIQUE (report_id, skill_id);


--
-- Name: role_skill_requirements uq_role_skill; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.role_skill_requirements
    ADD CONSTRAINT uq_role_skill UNIQUE (role_id, skill_id);


--
-- Name: user_skills uq_user_skill; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_skills
    ADD CONSTRAINT uq_user_skill UNIQUE (user_id, skill_id);


--
-- Name: user_course_progress user_course_progress_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_course_progress
    ADD CONSTRAINT user_course_progress_pkey PRIMARY KEY (id);


--
-- Name: user_gamification_profile user_gamification_profile_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_gamification_profile
    ADD CONSTRAINT user_gamification_profile_pkey PRIMARY KEY (user_id);


--
-- Name: user_interview_responses user_interview_responses_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_interview_responses
    ADD CONSTRAINT user_interview_responses_pkey PRIMARY KEY (id);


--
-- Name: user_job_matches user_job_matches_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_job_matches
    ADD CONSTRAINT user_job_matches_pkey PRIMARY KEY (id);


--
-- Name: user_opportunity_bookmarks user_opportunity_bookmarks_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_opportunity_bookmarks
    ADD CONSTRAINT user_opportunity_bookmarks_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (user_id);


--
-- Name: user_skills user_skills_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_skills
    ADD CONSTRAINT user_skills_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_interview_questions_round; Type: INDEX; Schema: daksh; Owner: postgres
--

CREATE INDEX idx_interview_questions_round ON daksh.interview_questions USING btree (round_id);


--
-- Name: idx_interview_rounds_session; Type: INDEX; Schema: daksh; Owner: postgres
--

CREATE INDEX idx_interview_rounds_session ON daksh.interview_rounds USING btree (session_id);


--
-- Name: idx_job_listings_active; Type: INDEX; Schema: daksh; Owner: postgres
--

CREATE INDEX idx_job_listings_active ON daksh.job_listings USING btree (is_active);


--
-- Name: idx_roadmap_stages_roadmap; Type: INDEX; Schema: daksh; Owner: postgres
--

CREATE INDEX idx_roadmap_stages_roadmap ON daksh.roadmap_stages USING btree (roadmap_id);


--
-- Name: idx_role_skill_req_role; Type: INDEX; Schema: daksh; Owner: postgres
--

CREATE INDEX idx_role_skill_req_role ON daksh.role_skill_requirements USING btree (role_id);


--
-- Name: idx_role_skill_req_skill; Type: INDEX; Schema: daksh; Owner: postgres
--

CREATE INDEX idx_role_skill_req_skill ON daksh.role_skill_requirements USING btree (skill_id);


--
-- Name: idx_skill_gap_items_report; Type: INDEX; Schema: daksh; Owner: postgres
--

CREATE INDEX idx_skill_gap_items_report ON daksh.skill_gap_items USING btree (report_id);


--
-- Name: idx_skill_gap_items_skill; Type: INDEX; Schema: daksh; Owner: postgres
--

CREATE INDEX idx_skill_gap_items_skill ON daksh.skill_gap_items USING btree (skill_id);


--
-- Name: idx_user_interview_responses_q; Type: INDEX; Schema: daksh; Owner: postgres
--

CREATE INDEX idx_user_interview_responses_q ON daksh.user_interview_responses USING btree (question_id);


--
-- Name: idx_user_job_matches_user; Type: INDEX; Schema: daksh; Owner: postgres
--

CREATE INDEX idx_user_job_matches_user ON daksh.user_job_matches USING btree (user_id, match_percentage DESC);


--
-- Name: idx_user_skills_skill; Type: INDEX; Schema: daksh; Owner: postgres
--

CREATE INDEX idx_user_skills_skill ON daksh.user_skills USING btree (skill_id);


--
-- Name: idx_user_skills_user; Type: INDEX; Schema: daksh; Owner: postgres
--

CREATE INDEX idx_user_skills_user ON daksh.user_skills USING btree (user_id);


--
-- Name: ai_evaluations_feedback ai_evaluations_feedback_response_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.ai_evaluations_feedback
    ADD CONSTRAINT ai_evaluations_feedback_response_id_fkey FOREIGN KEY (response_id) REFERENCES daksh.user_interview_responses(id) ON DELETE CASCADE;


--
-- Name: dynamic_learning_roadmaps dynamic_learning_roadmaps_gap_report_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.dynamic_learning_roadmaps
    ADD CONSTRAINT dynamic_learning_roadmaps_gap_report_id_fkey FOREIGN KEY (gap_report_id) REFERENCES daksh.skill_gap_reports(id) ON DELETE SET NULL;


--
-- Name: dynamic_learning_roadmaps dynamic_learning_roadmaps_user_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.dynamic_learning_roadmaps
    ADD CONSTRAINT dynamic_learning_roadmaps_user_id_fkey FOREIGN KEY (user_id) REFERENCES daksh.users(id) ON DELETE CASCADE;


--
-- Name: github_portfolio_analyses github_portfolio_analyses_user_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.github_portfolio_analyses
    ADD CONSTRAINT github_portfolio_analyses_user_id_fkey FOREIGN KEY (user_id) REFERENCES daksh.users(id) ON DELETE CASCADE;


--
-- Name: interview_questions interview_questions_round_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.interview_questions
    ADD CONSTRAINT interview_questions_round_id_fkey FOREIGN KEY (round_id) REFERENCES daksh.interview_rounds(id) ON DELETE CASCADE;


--
-- Name: interview_rounds interview_rounds_session_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.interview_rounds
    ADD CONSTRAINT interview_rounds_session_id_fkey FOREIGN KEY (session_id) REFERENCES daksh.interview_sessions(id) ON DELETE CASCADE;


--
-- Name: interview_scorecards interview_scorecards_session_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.interview_scorecards
    ADD CONSTRAINT interview_scorecards_session_id_fkey FOREIGN KEY (session_id) REFERENCES daksh.interview_sessions(id) ON DELETE CASCADE;


--
-- Name: interview_sessions interview_sessions_target_role_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.interview_sessions
    ADD CONSTRAINT interview_sessions_target_role_id_fkey FOREIGN KEY (target_role_id) REFERENCES daksh.job_roles_taxonomy(id) ON DELETE SET NULL;


--
-- Name: interview_sessions interview_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.interview_sessions
    ADD CONSTRAINT interview_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES daksh.users(id) ON DELETE CASCADE;


--
-- Name: job_alert_preferences job_alert_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.job_alert_preferences
    ADD CONSTRAINT job_alert_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES daksh.users(id) ON DELETE CASCADE;


--
-- Name: resume_ats_audits resume_ats_audits_resume_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.resume_ats_audits
    ADD CONSTRAINT resume_ats_audits_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES daksh.resumes_master(id) ON DELETE CASCADE;


--
-- Name: resume_ats_audits resume_ats_audits_target_jd_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.resume_ats_audits
    ADD CONSTRAINT resume_ats_audits_target_jd_id_fkey FOREIGN KEY (target_jd_id) REFERENCES daksh.target_job_descriptions(id) ON DELETE SET NULL;


--
-- Name: resume_compilations resume_compilations_resume_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.resume_compilations
    ADD CONSTRAINT resume_compilations_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES daksh.resumes_master(id) ON DELETE CASCADE;


--
-- Name: resume_structured_content resume_structured_content_resume_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.resume_structured_content
    ADD CONSTRAINT resume_structured_content_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES daksh.resumes_master(id) ON DELETE CASCADE;


--
-- Name: resumes_master resumes_master_target_jd_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.resumes_master
    ADD CONSTRAINT resumes_master_target_jd_id_fkey FOREIGN KEY (target_jd_id) REFERENCES daksh.target_job_descriptions(id) ON DELETE SET NULL;


--
-- Name: resumes_master resumes_master_user_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.resumes_master
    ADD CONSTRAINT resumes_master_user_id_fkey FOREIGN KEY (user_id) REFERENCES daksh.users(id) ON DELETE CASCADE;


--
-- Name: roadmap_stages roadmap_stages_course_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.roadmap_stages
    ADD CONSTRAINT roadmap_stages_course_id_fkey FOREIGN KEY (course_id) REFERENCES daksh.courses(id) ON DELETE SET NULL;


--
-- Name: roadmap_stages roadmap_stages_roadmap_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.roadmap_stages
    ADD CONSTRAINT roadmap_stages_roadmap_id_fkey FOREIGN KEY (roadmap_id) REFERENCES daksh.dynamic_learning_roadmaps(id) ON DELETE CASCADE;


--
-- Name: roadmap_stages roadmap_stages_target_skill_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.roadmap_stages
    ADD CONSTRAINT roadmap_stages_target_skill_id_fkey FOREIGN KEY (target_skill_id) REFERENCES daksh.skills_master(id) ON DELETE SET NULL;


--
-- Name: role_skill_requirements role_skill_requirements_role_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.role_skill_requirements
    ADD CONSTRAINT role_skill_requirements_role_id_fkey FOREIGN KEY (role_id) REFERENCES daksh.job_roles_taxonomy(id) ON DELETE CASCADE;


--
-- Name: role_skill_requirements role_skill_requirements_skill_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.role_skill_requirements
    ADD CONSTRAINT role_skill_requirements_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES daksh.skills_master(id) ON DELETE RESTRICT;


--
-- Name: skill_aliases skill_aliases_skill_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.skill_aliases
    ADD CONSTRAINT skill_aliases_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES daksh.skills_master(id) ON DELETE CASCADE;


--
-- Name: skill_gap_items skill_gap_items_report_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.skill_gap_items
    ADD CONSTRAINT skill_gap_items_report_id_fkey FOREIGN KEY (report_id) REFERENCES daksh.skill_gap_reports(id) ON DELETE CASCADE;


--
-- Name: skill_gap_items skill_gap_items_skill_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.skill_gap_items
    ADD CONSTRAINT skill_gap_items_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES daksh.skills_master(id) ON DELETE RESTRICT;


--
-- Name: skill_gap_reports skill_gap_reports_target_jd_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.skill_gap_reports
    ADD CONSTRAINT skill_gap_reports_target_jd_id_fkey FOREIGN KEY (target_jd_id) REFERENCES daksh.target_job_descriptions(id) ON DELETE SET NULL;


--
-- Name: skill_gap_reports skill_gap_reports_target_role_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.skill_gap_reports
    ADD CONSTRAINT skill_gap_reports_target_role_id_fkey FOREIGN KEY (target_role_id) REFERENCES daksh.job_roles_taxonomy(id) ON DELETE SET NULL;


--
-- Name: skill_gap_reports skill_gap_reports_user_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.skill_gap_reports
    ADD CONSTRAINT skill_gap_reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES daksh.users(id) ON DELETE CASCADE;


--
-- Name: spaced_repetition_schedules spaced_repetition_schedules_concept_skill_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.spaced_repetition_schedules
    ADD CONSTRAINT spaced_repetition_schedules_concept_skill_id_fkey FOREIGN KEY (concept_skill_id) REFERENCES daksh.skills_master(id) ON DELETE CASCADE;


--
-- Name: spaced_repetition_schedules spaced_repetition_schedules_user_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.spaced_repetition_schedules
    ADD CONSTRAINT spaced_repetition_schedules_user_id_fkey FOREIGN KEY (user_id) REFERENCES daksh.users(id) ON DELETE CASCADE;


--
-- Name: target_job_descriptions target_job_descriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.target_job_descriptions
    ADD CONSTRAINT target_job_descriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES daksh.users(id) ON DELETE CASCADE;


--
-- Name: user_course_progress user_course_progress_course_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_course_progress
    ADD CONSTRAINT user_course_progress_course_id_fkey FOREIGN KEY (course_id) REFERENCES daksh.courses(id) ON DELETE CASCADE;


--
-- Name: user_course_progress user_course_progress_roadmap_stage_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_course_progress
    ADD CONSTRAINT user_course_progress_roadmap_stage_id_fkey FOREIGN KEY (roadmap_stage_id) REFERENCES daksh.roadmap_stages(id) ON DELETE SET NULL;


--
-- Name: user_course_progress user_course_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_course_progress
    ADD CONSTRAINT user_course_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES daksh.users(id) ON DELETE CASCADE;


--
-- Name: user_gamification_profile user_gamification_profile_user_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_gamification_profile
    ADD CONSTRAINT user_gamification_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES daksh.users(id) ON DELETE CASCADE;


--
-- Name: user_interview_responses user_interview_responses_question_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_interview_responses
    ADD CONSTRAINT user_interview_responses_question_id_fkey FOREIGN KEY (question_id) REFERENCES daksh.interview_questions(id) ON DELETE CASCADE;


--
-- Name: user_interview_responses user_interview_responses_user_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_interview_responses
    ADD CONSTRAINT user_interview_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES daksh.users(id) ON DELETE CASCADE;


--
-- Name: user_job_matches user_job_matches_job_listing_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_job_matches
    ADD CONSTRAINT user_job_matches_job_listing_id_fkey FOREIGN KEY (job_listing_id) REFERENCES daksh.job_listings(id) ON DELETE CASCADE;


--
-- Name: user_job_matches user_job_matches_user_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_job_matches
    ADD CONSTRAINT user_job_matches_user_id_fkey FOREIGN KEY (user_id) REFERENCES daksh.users(id) ON DELETE CASCADE;


--
-- Name: user_opportunity_bookmarks user_opportunity_bookmarks_event_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_opportunity_bookmarks
    ADD CONSTRAINT user_opportunity_bookmarks_event_id_fkey FOREIGN KEY (event_id) REFERENCES daksh.event_hackathon_listings(id) ON DELETE CASCADE;


--
-- Name: user_opportunity_bookmarks user_opportunity_bookmarks_job_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_opportunity_bookmarks
    ADD CONSTRAINT user_opportunity_bookmarks_job_id_fkey FOREIGN KEY (job_id) REFERENCES daksh.job_listings(id) ON DELETE CASCADE;


--
-- Name: user_opportunity_bookmarks user_opportunity_bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_opportunity_bookmarks
    ADD CONSTRAINT user_opportunity_bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES daksh.users(id) ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES daksh.users(id) ON DELETE CASCADE;


--
-- Name: user_skills user_skills_skill_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_skills
    ADD CONSTRAINT user_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES daksh.skills_master(id) ON DELETE RESTRICT;


--
-- Name: user_skills user_skills_user_id_fkey; Type: FK CONSTRAINT; Schema: daksh; Owner: postgres
--

ALTER TABLE ONLY daksh.user_skills
    ADD CONSTRAINT user_skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES daksh.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict jEX3JDIbFcaZ3MiBiU5OhaUa5MsufHHHxo0P50nMIGaeeJDbsL5w5nDCCDAUa7F

