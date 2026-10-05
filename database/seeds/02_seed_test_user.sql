-- Seed Test User & User Identified Skills
-- Target Schema: daksh

BEGIN;

-- 1. Seed Test User
INSERT INTO daksh.users (id, email, password_hash, role, is_active, is_verified)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'testuser@daksh.dev', 'pbkdf2_sha256$mockhash$testhash', 'candidate', true, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Test User Profile
INSERT INTO daksh.user_profiles (user_id, first_name, last_name, phone_number, college_name, target_role)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Test', 'Candidate', '+919999999999', 'DAKSH Institute', 'Full Stack Developer')
ON CONFLICT (user_id) DO NOTHING;

-- 3. Seed User Identified Skills for Test User
-- User knows Python (score 80), Docker (score 65), Git (score 75), REST APIs (score 85)
-- User lacks React, PostgreSQL, Django (or has lower proficiency)
INSERT INTO daksh.user_skills (id, user_id, skill_id, proficiency, source, verified, score)
VALUES 
    ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'advanced', 'quiz', true, 80.00),     -- Python (Score 80 vs Benchmark 75) -> Matched
    ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'intermediate', 'self', false, 65.00),  -- Docker (Score 65 vs Benchmark 60) -> Matched
    ('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006', 'intermediate', 'cv', true, 75.00),     -- Git (Score 75 vs Benchmark 70) -> Matched
    ('40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 'beginner', 'self', false, 40.00)     -- Django (Score 40 vs Benchmark 75) -> Gap!
ON CONFLICT (id) DO NOTHING;

COMMIT;
