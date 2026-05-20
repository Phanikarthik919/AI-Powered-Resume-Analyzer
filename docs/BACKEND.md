# BACKEND Server & Data Blueprint

*Written for the engineers handling data parsing, security rules, and database stability.*

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

## 🧪 API Endpoint Verification Visuals

*(Placeholder: Insert Postman/Insomnia screenshots demonstrating 200 OK responses, 401 Unauthorized fallbacks, and structured JSON returns.)*
