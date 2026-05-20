# API Endpoint Registry

*A clean reference manual for both frontend and backend engineers to see how data maps across the network.*

## 🔌 Endpoint Directory Tables

### Auth & User (`/common-api`)

| Verb | URI Pathway | Description | Security | Parameters | Payload |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/common-api/login` | Authenticate user | Public | Body: `{ email, password }` | `{ message, payload: user }` |
| `GET` | `/common-api/logout` | Clear HTTP-only token | Public | None | `{ message }` |
| `PUT` | `/common-api/change-password` | Update password | Token Required | Body: `{ currentPassword, newPassword }` | `{ message }` |

### Resume Operations (`/user-api`)

| Verb | URI Pathway | Description | Security | Parameters | Payload |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/user-api/register` | Create a new user account | Public | Body: `{ name, email, password }` | `{ message }` |
| `POST` | `/user-api/upload-resume` | Uploads PDF, parses text, requests AI ATS analysis, uploads to Cloudinary | Token Required | FormData: `resume` (File), `resumeName`, `targetRole`, `jobDescription` | `{ message, resume: Document }` |
| `GET` | `/user-api/user-resumes` | Fetch all historical resumes | Token Required | None | `{ message, payload: [Resumes] }` |
| `GET` | `/user-api/resume/:id` | Fetch specific resume details | Token Required | URL: `id` | `{ message, payload: Resume }` |
| `PUT` | `/user-api/update-resume/:id` | Update parsed resume fields | Token Required | URL: `id`, Body: `{ parsedData }` | `{ message, payload: Resume }` |
| `POST` | `/user-api/optimize-section`| AI optimization for specific sections | Token Required | Body: `{ sectionType, content, targetRole }` | `{ message, payload: AI_Response }` |
| `GET` | `/user-api/resume/:id/download` | Redirect to Cloudinary URL | Token Required | URL: `id` | Redirect (302) |
