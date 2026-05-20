# BACKEND Server & Data Blueprint

**[🖥️ Hosted API Server (Backend)](https://resai-backend-gepb.onrender.com)**

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

The MongoDB database maintains two primary collections, structured and enforced via Mongoose.

### 1. User Schema (`users`)
Responsible for authentication and profile management.
```javascript
{
  _id: ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed via bcrypt
  profilePicture: { type: String, default: "" },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 2. Resume Schema (`resumes`)
Responsible for tracking Cloudinary assets, the user it belongs to, and the Groq AI ATS analysis.
```javascript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: "user", required: true }, // Foreign Key
  resumeName: { type: String, required: true },
  targetRole: { type: String, required: true },
  jobDescription: { type: String, default: "" },

  // Cloudinary Storage
  fileUrl: { type: String, required: true },
  filePublicId: { type: String, required: true },

  // AI Analysis Results
  atsScore: { type: Number, default: 0 },
  scoringBreakdown: { sections, keywords, metrics, projects, education, penalties },
  missingSkills: [{ type: String }],
  aiSuggestions: [{ type: String }],
  analysisSummary: { type: String },
  
  // Raw Data
  resumeText: { type: String, default: "" },
  parsedData: { type: Object, default: {} },
  status: { type: String, enum: ["uploading", "processing", "completed", "failed"] },

  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🔒 Middleware Gatekeepers

- **Authentication Handlers:** `middlewares/verifyToken.js` extracts the HTTP-Only JWT from cookies, verifies it against the secret key, and populates `req.user`.
- **Global Error Interceptor:** Found at the bottom of `server.js`. Catches gracefully unhandled promise rejections, prevents system trace logs from leaking, and formats unified Mongoose duplicate-key (`11000`) and Validation errors.
- **File Upload Validation Rules:** `middlewares/multer.js` automatically creates an ephemeral `uploads/` directory to prevent ENOENT crashes on cloud hosts, and manages temporary local storage before Cloudinary hand-off.

---

## 🔌 API Documentation (Endpoint Registry)

### Auth & Common Resources (`/common-api`)
| Verb | Pathway | Description | Auth Required | Expected Input / Body | Return Output |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/common-api/login` | Authenticate user | No | `{ email, password }` | JWT HttpOnly Cookie, `{ message, user }` |
| `GET` | `/common-api/logout` | Clears auth cookie | Yes | None | `{ message }` |
| `GET` | `/common-api/check-auth`| Refresh/Auth verification | Yes | None | `{ message, payload }` |

### User & Resume Resources (`/user-api`)
| Verb | Pathway | Description | Auth Required | Expected Input / Body | Return Output |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/user-api/register` | Register new account | No | `{ name, email, password }` | `{ message, payload }` |
| `POST` | `/user-api/upload-resume`| Parse, AI Analyze, Save | Yes | `multipart/form-data` (`file`, `targetRole`) | `{ message, payload: ResumeDoc }` |
| `GET` | `/user-api/user-resumes` | Fetch user's analyses | Yes | None | `{ message, payload: [ResumeDocs] }` |
| `GET` | `/user-api/resume/:id` | Fetch specific analysis | Yes | `URL Param: id` | `{ message, payload: ResumeDoc }` |
