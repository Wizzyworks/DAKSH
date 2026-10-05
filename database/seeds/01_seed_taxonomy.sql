-- Seed Taxonomy Data: Skills Master, Job Roles Taxonomy, and Role Skill Requirements
-- Target Schema: daksh

BEGIN;

-- 1. Seed Skills Master
INSERT INTO daksh.skills_master (id, canonical_name, slug, category, description, is_verified)
VALUES 
    ('10000000-0000-0000-0000-000000000001', 'Python', 'python', 'technical', 'High-level programming language widely used in backend development, AI, and data science.', true),
    ('10000000-0000-0000-0000-000000000002', 'PostgreSQL', 'postgresql', 'Advanced open-source relational database management system.', true),
    ('10000000-0000-0000-0000-000000000003', 'React', 'react', 'Popular JavaScript library for building component-based user interfaces.', true),
    ('10000000-0000-0000-0000-000000000004', 'Docker', 'docker', 'Containerization platform for creating, deploying, and running applications.', true),
    ('10000000-0000-0000-0000-000000000005', 'Django', 'django', 'High-level Python web framework that encourages rapid development and clean design.', true),
    ('10000000-0000-0000-0000-000000000006', 'Git', 'git', 'Distributed version control system for tracking changes in source code.', true),
    ('10000000-0000-0000-0000-000000000007', 'REST APIs', 'rest-apis', 'Architectural style for designing networked applications.', true),
    ('10000000-0000-0000-0000-000000000008', 'System Design', 'system-design', 'Designing architecture, components, modules, and interfaces for scalable systems.', true),
    ('10000000-0000-0000-0000-000000000009', 'Data Analysis', 'data-analysis', 'Inspecting, cleansing, transforming, and modeling data to discover useful information.', true),
    ('10000000-0000-0000-0000-000000000010', 'Tailwind CSS', 'tailwind-css', 'Utility-first CSS framework for rapid UI development.', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Job Roles Taxonomy
INSERT INTO daksh.job_roles_taxonomy (id, role_title, role_slug, department_domain, industry, description, seniority_level, is_active)
VALUES 
    ('20000000-0000-0000-0000-000000000001', 'Full Stack Developer', 'full-stack-developer', 'Software Engineering', 'Technology', 'Builds and maintains end-to-end web applications across front-end, back-end, and database layers.', 'Mid-Level', true),
    ('20000000-0000-0000-0000-000000000002', 'Data Analyst', 'data-analyst', 'Data & Analytics', 'Technology', 'Analyzes raw data to uncover insights, build dashboards, and support business decision-making.', 'Junior-Mid', true),
    ('20000000-0000-0000-0000-000000000003', 'Backend Engineer', 'backend-engineer', 'Software Engineering', 'Technology', 'Focuses on server-side web application logic, database integrations, APIs, and microservices.', 'Mid-Senior', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Role Skill Requirements
-- Requirements for "Full Stack Developer" (role_id: 20000000-0000-0000-0000-000000000001)
INSERT INTO daksh.role_skill_requirements (id, role_id, skill_id, importance, benchmark_score_min, weightage)
VALUES 
    ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'mandatory', 75.00, 1.20), -- Python
    ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'mandatory', 70.00, 1.00), -- PostgreSQL
    ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'mandatory', 80.00, 1.20), -- React
    ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'preferred', 60.00, 0.80), -- Docker
    ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 'mandatory', 75.00, 1.10), -- Django
    ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006', 'mandatory', 70.00, 0.90)  -- Git
ON CONFLICT (id) DO NOTHING;

-- Requirements for "Data Analyst" (role_id: 20000000-0000-0000-0000-000000000002)
INSERT INTO daksh.role_skill_requirements (id, role_id, skill_id, importance, benchmark_score_min, weightage)
VALUES 
    ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'mandatory', 70.00, 1.00), -- Python
    ('30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'mandatory', 85.00, 1.30), -- PostgreSQL
    ('30000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000009', 'mandatory', 80.00, 1.20)  -- Data Analysis
ON CONFLICT (id) DO NOTHING;

COMMIT;
