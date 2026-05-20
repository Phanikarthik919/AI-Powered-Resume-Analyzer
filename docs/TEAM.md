# TEAM Collaboration Workflow

*The governance engine of the team. It maintains order across your development pipeline.*

## 👥 Division of Responsibilities

- **Frontend Engineers:** Own the `FRONTEND/` directory. Responsible for React components, state management (Zustand), UI design, and Axios integration.
- **Backend Engineers:** Own the `BACKEND/` directory. Responsible for API definitions, MongoDB schemas, AI integration, and Cloudinary uploads.
- **DevOps Lead:** Owns the Vercel/Render deployments, environment variable synchronization, and CORS configurations.

## 🌿 Git Branching Strategy

To maintain repository hygiene, all new work must follow this branch naming convention:
- **Features:** `feature/<kebab-case-description>` (e.g., `feature/ai-scoring-logic`)
- **Bug Fixes:** `bugfix/<kebab-case-description>` (e.g., `bugfix/cors-cookie-block`)
- **Hotfixes:** `hotfix/<kebab-case-description>` (For urgent production patches)

## 🛠️ Pull Request & Merge Policies

- **Peer Review:** All PRs targeting the `main` branch require at least 1 approval from a peer developer.
- **Code Linting:** ESLint must pass locally before a PR is opened.
- **No Force Pushing:** `git push --force` is strictly prohibited on the `main` branch.

## 📞 Team Communication Matrix

- **Sprint Planning:** Conducted bi-weekly via Zoom.
- **Task Tracking:** Managed on GitHub Projects / Jira.
- **Real-Time Collaboration:** Slack / Discord channels for immediate blockers.
