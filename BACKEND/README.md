# BACKEND Server & Data Blueprint

*Written for the engineers handling data parsing, security rules, and database stability.*

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in this directory and add the required variables:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/resume-analyzer
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET_KEY=your_secret_key
   GROQ_API_KEY=your_groq_api_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## ⚙️ Server Architecture Overview

- **Framework Setup:** Node.js runtime powered by the Express.js framework.
- **Database Modeler:** Mongoose ODM for MongoDB Atlas.
- **Security Wrappers:** Custom JWT middleware for route protection, bcryptjs for password hashing, and dynamic CORS configuration supporting both local environments and Vercel domains.

## 📂 Server Directory Map

```text
BACKEND/
├── APIs/             # Business logic controllers and route paths (UserAPI, CommonAPI)
├── config/           # Database connection logic and Cloudinary SDK configurations
├── middlewares/      # Structural middleware (verifyToken, multer)
├── models/           # Entity data models (UserSchema, ResumeSchema)
├── services/         # Utility helpers (analyzeResume.js, extractPdfText.js)
└── server.js         # Entry point, global error interceptor, CORS rules
```

## 🗄️ Database Schemas & Entities

- **User Credential Tracking:** Tracks `name`, `email`, and securely hashed `password`. Passwords are NEVER returned in API payloads.
- **Application Data Models:** 
  - `ResumeSchema`: Tracks file attachment URLs (`fileUrl`, `filePublicId`), relationship references to the User (`userId`), ATS metrics (`atsScore`, `missingSkills`), and creation timestamps.
- **Visual Data Map:** *(Placeholder: Insert ERD Image Here)*

## 🔒 Middleware Gatekeepers

- **Authentication Handlers:** `middlewares/verifyToken.js` extracts the HTTP-Only JWT from cookies, verifies it against the secret key, and populates `req.user`.
- **Global Error Interceptor:** Found at the bottom of `server.js`. Catches gracefully unhandled promise rejections, prevents system trace logs from leaking, and formats unified Mongoose duplicate-key (`11000`) and Validation errors.
- **File Upload Validation Rules:** `middlewares/multer.js` automatically creates an ephemeral `uploads/` directory to prevent ENOENT crashes on cloud hosts, and manages temporary local storage before Cloudinary hand-off.

---

## 🔌 API Endpoint Registry

*A clean reference manual for both frontend and backend engineers to see how data maps across the network.*

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
