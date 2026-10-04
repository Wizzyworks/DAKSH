# Team Git & GitHub Daily Workflow Guide
Essential commands, practical explanations, and collaboration standards for Hackathon & Team Projects.

---

## 1. One-Time Local Environment Setup
Run these commands once when first joining the repository or configuring your machine:

| Command | What It Does & Practical Context |
| :--- | :--- |
| `git config --global user.name "Your Name"`<br>`git config --global user.email "you@mail.com"` | Configures your identity across all commits. Use the exact email address linked to your GitHub account so commits link to your profile.[cite: 1] |
| `git clone <repo_url>` | Downloads a complete local copy of the remote repository and sets up tracking for the default `main` branch.[cite: 1] |
| `git remote -v` | Verifies that your local folder is properly linked to the GitHub remote repository (`origin`).[cite: 1] |

---

## 2. Starting a New Task or Daily Working Cycle
Never write code directly on `main`. Follow this exact sequence before starting any feature or bug fix:

| Command | What It Does & Practical Context |
| :--- | :--- |
| `git checkout main` | Switches your local workspace to the main baseline branch.[cite: 1] |
| `git pull origin main` | Downloads and merges the latest code pushed by teammates into your local `main`. Prevents merge conflicts later.[cite: 1] |
| `git checkout -b <branch_name>` | Creates and switches to a dedicated branch. **Convention:** `frontend/issue-2-login`, `backend/issue-1-auth`, `docs/api-specs`.[cite: 1] |
| `git branch` | Lists all local branches. The branch with the asterisk (`*`) is your current active branch.[cite: 1] |

---

## 3. Daily Commits & Synchronization
Commit small, meaningful milestones daily instead of massive single dumps:

| Command | What It Does & Practical Context |
| :--- | :--- |
| `git status` | Shows tracked, untracked, and modified files in your working directory. Run this frequently to avoid committing unintended files.[cite: 1] |
| `git diff` | Inspects exact line-by-line differences before staging changes.[cite: 1] |
| `git add <file_path>` | Stages specific files for the next commit. For multiple files, specify them or use `git add .` (use cautiously with `.gitignore`).[cite: 1] |
| `git commit -m "feat(auth): add login validation"` | Records your staged changes locally with a descriptive message. Format: `type(scope): description` (e.g., `feat`, `fix`, `docs`, `test`).[cite: 1] |
| `git push -u origin <branch_name>` | Pushes your local branch to GitHub for the first time and sets upstream tracking. On subsequent pushes, run `git push`.[cite: 1] |

---

## 4. Pull Requests, Reviews & Local Workspace Reset
How the team collaborates to review code and keep branches clean:

| Command / Action | What It Does & Practical Context |
| :--- | :--- |
| **Create PR on GitHub** | Go to GitHub, click **Compare & pull request**. Reference related issues in the description using `Closes #<issue_number>`.[cite: 1] |
| **Review & Approval** | Assigned teammates open **Files changed**, leave constructive comments, and click **Approve**. Two approvals required before merge.[cite: 2] |
| `git checkout main`<br>`git pull origin main` | After the PR is merged on GitHub, switch back to your local `main` and pull the newly merged changes.[cite: 2] |
| `git branch -d <branch_name>` | Deletes the completed feature branch locally to keep your workspace tidy.[cite: 2] |
| `git fetch --prune` | Cleans up references to remote branches that were already merged and deleted on GitHub.[cite: 2] |

---

## 5. Safety & Troubleshooting Commands (When Stuck)
Common recovery commands when things do not go as planned:

| Command | What It Does & Practical Context |
| :--- | :--- |
| `git restore <file>` | Discards uncommitted changes in a specific working file, reverting it to the last committed version.[cite: 2] |
| `git stash`<br>`git stash pop` | Temporarily shelves uncommitted changes so you can switch branches cleanly. `git stash pop` reapplies them later.[cite: 2] |
| `git log --oneline -n 5` | Displays the last 5 commits in a compact, readable single-line format to verify commit history.[cite: 2] |
| `git checkout <branch>`<br>`git pull origin main` | Syncs the latest updates from `main` into your working branch to resolve conflicts before submitting a PR.[cite: 2] |