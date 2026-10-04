from django.core.management.base import BaseCommand
from django.utils.text import slugify
from ...models import SkillMaster, SkillCategoryEnum
from ....jobs.models import JobRoleTaxonomy


class Command(BaseCommand):
    help = 'Seed initial skills master and job roles taxonomy for DAKSH platform'

    def handle(self, *args, **options):
        self.stdout.write("Seeding Skills Master...")
        skills_data = [
            # Technical Skills - Languages & Frameworks
            ("Python", SkillCategoryEnum.TECHNICAL, "High-level programming language widely used in AI, web development, and automation."),
            ("JavaScript", SkillCategoryEnum.TECHNICAL, "Core programming language of the web."),
            ("TypeScript", SkillCategoryEnum.TECHNICAL, "Typed superset of JavaScript."),
            ("React.js", SkillCategoryEnum.TECHNICAL, "Front-end JavaScript library for building user interfaces."),
            ("Next.js", SkillCategoryEnum.TECHNICAL, "React framework for production with SSR and static site generation."),
            ("Django", SkillCategoryEnum.TECHNICAL, "High-level Python web framework encouraging rapid development."),
            ("Django REST Framework", SkillCategoryEnum.TECHNICAL, "Powerful and flexible toolkit for building Web APIs in Django."),
            ("Node.js", SkillCategoryEnum.TECHNICAL, "JavaScript runtime environment built on Chrome's V8 engine."),
            ("FastAPI", SkillCategoryEnum.TECHNICAL, "Modern, fast web framework for building APIs with Python 3.8+."),
            ("SQL", SkillCategoryEnum.TECHNICAL, "Standard language for storing, manipulating and retrieving data in relational databases."),
            ("PostgreSQL", SkillCategoryEnum.TECHNICAL, "Advanced, enterprise-class open source relational database."),
            ("MongoDB", SkillCategoryEnum.TECHNICAL, "Popular document-based NoSQL database."),
            ("Redis", SkillCategoryEnum.TECHNICAL, "In-memory data structure store used as database, cache, and message broker."),
            ("C++", SkillCategoryEnum.TECHNICAL, "General-purpose programming language with low-level memory manipulation."),
            ("Java", SkillCategoryEnum.TECHNICAL, "Object-oriented, class-based programming language."),

            # CS Fundamentals & Problem Solving
            ("Data Structures & Algorithms", SkillCategoryEnum.TECHNICAL, "Fundamental concepts for organizing data and solving computational problems efficiently."),
            ("Object-Oriented Design (LLD)", SkillCategoryEnum.TECHNICAL, "Low-level system and class architecture design patterns."),
            ("System Design (HLD)", SkillCategoryEnum.TECHNICAL, "High-level scalable distributed system architecture design."),
            ("REST APIs", SkillCategoryEnum.TECHNICAL, "Architectural style for designing networked applications."),

            # AI / ML / Data
            ("Machine Learning", SkillCategoryEnum.TECHNICAL, "Algorithms and models that learn patterns from data."),
            ("Deep Learning & PyTorch", SkillCategoryEnum.TECHNICAL, "Neural network modeling and deep learning using PyTorch."),
            ("Large Language Models (LLMs)", SkillCategoryEnum.TECHNICAL, "Generative AI, prompt engineering, and LLM orchestration."),
            ("Pandas & NumPy", SkillCategoryEnum.TECHNICAL, "Python libraries for data manipulation and numerical computation."),

            # DevOps & Tools
            ("Git & GitHub", SkillCategoryEnum.TOOL, "Distributed version control system and collaboration platform."),
            ("Docker", SkillCategoryEnum.TOOL, "Containerization platform to package applications with dependencies."),
            ("Kubernetes", SkillCategoryEnum.TOOL, "Container orchestration system for automating application deployment."),
            ("AWS", SkillCategoryEnum.TOOL, "Amazon Web Services cloud platform."),
            ("Linux / Bash", SkillCategoryEnum.TOOL, "Unix command-line interface and shell scripting."),

            # Soft Skills
            ("Problem Solving", SkillCategoryEnum.SOFT, "Analytical approach to dissecting complex technical problems."),
            ("Technical Communication", SkillCategoryEnum.SOFT, "Ability to clearly articulate architectural and code decisions."),
            ("Agile & Scrum", SkillCategoryEnum.DOMAIN, "Collaborative iterative project delivery methodology."),
        ]

        created_skills_count = 0
        for name, category, desc in skills_data:
            _, created = SkillMaster.objects.get_or_create(
                canonical_name=name,
                defaults={
                    'slug': slugify(name),
                    'category': category,
                    'description': desc,
                    'is_verified': True
                }
            )
            if created:
                created_skills_count += 1

        self.stdout.write(f"Created {created_skills_count} skills (Total: {SkillMaster.objects.count()}).")

        self.stdout.write("Seeding Job Roles Taxonomy...")
        roles_data = [
            (
                "Full Stack Developer",
                "Engineering",
                "Technology",
                "Entry / Mid Level",
                "Designs and builds complete web applications across frontend and backend tiers.",
                ["React.js", "Python", "Django", "JavaScript", "PostgreSQL", "Git & GitHub"]
            ),
            (
                "Backend Engineer",
                "Engineering",
                "Technology",
                "Entry / Mid Level",
                "Specializes in server-side logic, API design, database architecture, and performance scalability.",
                ["Python", "Django REST Framework", "PostgreSQL", "Data Structures & Algorithms", "System Design (HLD)"]
            ),
            (
                "Frontend Engineer",
                "Engineering",
                "Technology",
                "Entry / Mid Level",
                "Specializes in responsive UI development, state management, and modern client-side performance.",
                ["React.js", "TypeScript", "Next.js", "JavaScript", "CSS"]
            ),
            (
                "AI / Machine Learning Engineer",
                "AI & Data",
                "Technology",
                "Entry / Mid Level",
                "Builds predictive models, LLM workflows, and data pipelines.",
                ["Python", "Machine Learning", "Large Language Models (LLMs)", "Pandas & NumPy", "PyTorch"]
            ),
            (
                "DevOps / Cloud Engineer",
                "Infrastructure",
                "Technology",
                "Entry / Mid Level",
                "Automates CI/CD pipelines, container orchestration, and cloud infrastructure.",
                ["Docker", "Kubernetes", "AWS", "Linux / Bash", "Git & GitHub"]
            ),
            (
                "Data Analyst",
                "Data",
                "Technology",
                "Entry Level",
                "Analyzes structured and unstructured data to produce actionable business insights.",
                ["SQL", "Python", "Pandas & NumPy"]
            ),
        ]

        created_roles_count = 0
        for title, dept, ind, seniority, desc, req_skills in roles_data:
            _, created = JobRoleTaxonomy.objects.get_or_create(
                role_title=title,
                defaults={
                    'role_slug': slugify(title),
                    'department_domain': dept,
                    'industry': ind,
                    'seniority_level': seniority,
                    'description': desc,
                    'standard_required_skills': req_skills,
                    'is_active': True
                }
            )
            if created:
                created_roles_count += 1

        self.stdout.write(f"Created {created_roles_count} job roles (Total: {JobRoleTaxonomy.objects.count()}).")
        self.stdout.write(self.style.SUCCESS("DAKSH seed data successfully loaded!"))
