# AI RESUME ANALYZER - COMPREHENSIVE TECHNICAL ANALYSIS
## Senior Full-Stack Developer & Technical Interviewer Documentation

---

## TABLE OF CONTENTS
1. [Architecture Overview](#1-architecture-overview)
2. [File-by-File Breakdown](#2-file-by-file-breakdown)
3. [Feature Logic & Request Flow](#3-feature-logic--request-flow)
4. [Tech Stack Justification](#4-tech-stack-justification)
5. [Tough Interview Questions](#5-tough-interview-questions)

---

## 1. ARCHITECTURE OVERVIEW

### 1.1 High-Level Architecture Pattern
**Architecture Type:** **Client-Server Separation (Traditional MERN Architecture)**

This is NOT a monorepo. The project uses a **decoupled architecture** with:
- **FRONTEND** (React + Vite) - Separate deployment
- **BACKEND** (Express.js + Node.js) - Separate deployment
- **Database** (MongoDB Atlas) - Cloud-hosted

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React 19 + Vite + Tailwind CSS 4                     │  │
│  │  ├── Zustand (State Management)                       │  │
│  │  ├── React Router v7 (Routing)                        │  │
│  │  ├── Axios (HTTP Client)                              │  │
│  │  └── React Hook Form (Form Handling)                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↓↑                               │
│                     HTTP/HTTPS (REST API)                   │
│                     withCredentials: true                   │
│                     (httpOnly cookies for JWT)              │
└─────────────────────────────────────────────────────────────┘
                               ↓↑
┌─────────────────────────────────────────────────────────────┐
│                       SERVER LAYER                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Express.js 5.2.1 + Node.js                           │  │
│  │  ├── JWT Authentication (httpOnly cookies)            │  │
│  │  ├── Multer (File Upload Middleware)                  │  │
│  │  ├── Bcrypt.js (Password Hashing)                     │  │
│  │  ├── Cookie-Parser (Session Management)               │  │
│  │  └── CORS (Cross-Origin Resource Sharing)             │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↓↑                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              BUSINESS LOGIC LAYER                     │  │
│  │  ├── PDF Text Extraction (pdf-parse)                  │  │
│  │  ├── AI Resume Analysis (Groq API - Llama 3.3 70B)    │  │
│  │  ├── ATS Scoring Algorithm                            │  │
│  │  └── Structured Resume Parsing                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↓↑                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            FILE STORAGE LAYER                         │  │
│  │  Cloudinary (PDF Storage & CDN)                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                               ↓↑
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  MongoDB Atlas                                         │  │
│  │  ├── Users Collection                                  │  │
│  │  └── Resumes Collection (with userId reference)       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Communication Flow

**Frontend ↔ Backend Communication:**

1. **Protocol:** REST API over HTTPS
2. **Data Format:** JSON (except file uploads which use multipart/form-data)
3. **Authentication:** JWT stored in httpOnly cookies
4. **CORS Configuration:** 
   - Credentials allowed: `credentials: true`
   - Dynamic origin validation (supports localhost ports 5173-5178)
   - Frontend URL from environment variables

**Key Communication Patterns:**

```javascript
// FRONTEND (api.js)
const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,  // ← Sends cookies with every request
  headers: { 'Accept': 'application/json' }
});

// BACKEND (server.js)
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];
    if (allowedOrigins.includes(origin)) callback(null, true);
  },
  credentials: true  // ← Allows cookies in cross-origin requests
}));
```

### 1.3 Deployment Architecture

```
Production Setup:
┌──────────────────┐
│  Vercel/Netlify  │  ← React App (Static)
└──────────────────┘
        ↓↑
┌──────────────────┐
│   Render/Railway │  ← Express API
└──────────────────┘
        ↓↑
┌──────────────────┐
│  MongoDB Atlas   │  ← Database
└──────────────────┘
        ↓↑
┌──────────────────┐
│   Cloudinary     │  ← File Storage
└──────────────────┘
```

---

## 2. FILE-BY-FILE BREAKDOWN

### 2.1 BACKEND Structure

```
BACKEND/
├── server.js                    # Entry point, middleware setup, error handling
├── package.json                 # Dependencies and scripts
│
├── config/
│   ├── db.js                    # MongoDB connection logic
│   ├── cloudinary.js            # Cloudinary SDK configuration
│   ├── gemini.js                # Google Gemini AI config (unused in current code)
│   └── openai.js                # OpenAI config (unused in current code)
│
├── models/
│   ├── UserSchema.js            # User collection schema (MongoDB)
│   └── ResumeSchema.js          # Resume collection schema (MongoDB)
│
├── middlewares/
│   ├── verifyToken.js           # JWT authentication middleware
│   └── multer.js                # File upload configuration (local disk)
│
├── services/
│   ├── authService.js           # JWT generation & password verification
│   ├── extractPdfText.js        # PDF → Text extraction (pdf-parse)
│   └── analyzeResume.js         # Groq AI analysis (ATS scoring + parsing)
│
├── APIs/
│   ├── UserAPI.js               # Protected routes (resume CRUD, profile)
│   └── CommonAPI.js             # Public routes (login, logout, change password)
│
└── uploads/                     # Temporary file storage (deleted after upload)
```

#### 2.1.1 **server.js** - Application Bootstrap
**Responsibility:** Express app initialization, middleware registration, route mounting, global error handling

**Key Sections:**
```javascript
// 1. Environment setup
config();  // Load .env variables

// 2. Middleware stack (order matters!)
app.use((req, res, next) => { console.log(`${req.method} ${req.url}`); next(); });  // Request logging
app.use(cors({ /* ... */ }));    // CORS with credentials
app.use(exp.json());              // Parse JSON bodies
app.use(cookieParser());          // Parse cookies for JWT

// 3. Route mounting
app.use("/user-api", userApp);    // Protected user routes
app.use("/common-api", commonRoute);  // Public auth routes

// 4. Database connection
connectDB();  // Connects to MongoDB Atlas

// 5. Error handling middleware (MUST be last)
app.use((err, req, res, next) => { /* Centralized error handling */ });
```

**Critical Details:**
- **Port Binding:** `process.env.PORT` (default: 4000)
- **CORS Origin Validation:** Dynamic check for localhost ports + production URL
- **Error Categories Handled:**
  - `ValidationError` → 400 (Mongoose schema validation)
  - `CastError` → 400 (Invalid ObjectId format)
  - `errCode 11000` → 409 (Duplicate key - unique constraint)
  - Default → 500 (Server error)

---

#### 2.1.2 **config/db.js** - Database Connection
**Responsibility:** Establish MongoDB connection with error handling

```javascript
export const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);  // Mongoose connection
    console.log("Database connection successful");
  } catch (err) {
    console.error(err.message);
    process.exit(1);  // ← Terminates server if DB fails (prevents undefined behavior)
  }
};
```

**Why `process.exit(1)`?**
- If MongoDB is unreachable, all routes would fail with 500 errors
- Better to fail-fast and let the process manager (PM2/systemd) restart the server

---

#### 2.1.3 **models/UserSchema.js** - User Data Model
**Responsibility:** Define the structure of user documents in MongoDB

```javascript
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },  // ← Unique index for fast lookups
    password: { type: String, required: true },             // Bcrypt hashed
    profilePicture: { type: String, default: "" },
  },
  { timestamps: true }  // Auto-creates `createdAt` and `updatedAt`
);

export const User = mongoose.model("user", userSchema);  // Collection name: "users"
```

**Index Strategy:**
- `email` has a **unique compound index** automatically
- Fast O(log n) lookups for login queries

---

#### 2.1.4 **models/ResumeSchema.js** - Resume Data Model
**Responsibility:** Define resume document structure with analysis results

```javascript
const resumeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user",         // Foreign key relationship
    required: true,
    index: true          // ← Index for fast user-specific queries
  },
  
  // File metadata
  resumeName: { type: String, required: true },
  targetRole: { type: String, required: true },
  jobDescription: { type: String, default: "" },
  fileUrl: { type: String, required: true },        // Cloudinary CDN URL
  filePublicId: { type: String, required: true },   // Cloudinary asset ID
  
  // Analysis results (from Groq AI)
  atsScore: { type: Number, default: 0 },
  scoringBreakdown: {
    sections: Number,
    keywords: Number,
    metrics: Number,
    projects: Number,
    education: Number,
    penalties: Number
  },
  missingSkills: [{ type: String }],
  aiSuggestions: [{ type: String }],
  analysisSummary: { type: String },
  resumeText: { type: String, default: "" },        // Extracted PDF text
  parsedData: { type: Object, default: {} },        // Structured JSON resume
  
  status: {
    type: String,
    enum: ["uploading", "processing", "completed", "failed"],
    default: "uploading"
  }
}, { timestamps: true });
```

**Design Decisions:**
- **Why `parsedData` as Object?** Flexible schema for future AI model improvements
- **Why store `resumeText`?** For re-analysis without re-parsing PDF
- **Why `status` enum?** Enables real-time progress tracking in UI

---

#### 2.1.5 **middlewares/verifyToken.js** - Authentication Guard
**Responsibility:** Validate JWT tokens and attach user context to requests

**Execution Flow:**
```javascript
export const verifyToken = async (req, res, next) => {
  // 1. Extract token from httpOnly cookie
  let token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  
  // 2. Verify token signature and expiration
  let decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
  // 3. Check if user still exists (not deleted)
  const user = await User.findById(decodedToken.userId);
  if (!user) return res.status(403).json({ message: "User blocked or not found" });
  
  // 4. Attach decoded payload to request
  req.user = decodedToken;  // { userId, email }
  next();
};
```

**Security Features:**
- **Token Expiry Handling:** Catches `TokenExpiredError` → 401
- **Invalid Token Detection:** Catches `JsonWebTokenError` → 401
- **User Existence Check:** Prevents access if account deleted

---

#### 2.1.6 **services/authService.js** - Authentication Logic
**Responsibility:** User credential verification + JWT generation

```javascript
export const authenticate = async ({ email, password }) => {
  // 1. Find user by email
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email");
  
  // 2. Compare plaintext password with bcrypt hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password");
  
  // 3. Generate JWT (expires in 1 hour)
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );
  
  // 4. Return user object (without password)
  const userObj = user.toObject();
  delete userObj.password;
  return { token, user: userObj };
};
```

**Why 1-hour expiration?**
- Balance between security (short session) and UX (not too frequent re-logins)
- Production apps often use refresh tokens for longer sessions

---

#### 2.1.7 **services/extractPdfText.js** - PDF Parsing
**Responsibility:** Extract raw text from uploaded PDF files

**Why Two Text Outputs?**
```javascript
// structuredText: Preserves formatting for display in UI
const structuredText = rawText
  .replace(/\r\n/g, "\n")          // Normalize line endings
  .replace(/\n{3,}/g, "\n\n")      // Max 2 consecutive newlines
  .replace(/[ \t]{2,}/g, " ")      // Collapse multiple spaces
  .trim();

// aiText: Compact format for AI prompt (max 12,000 chars)
const aiText = structuredText
  .replace(/\n+/g, " ")             // Remove all newlines
  .replace(/\s{2,}/g, " ")          // Single spaces only
  .slice(0, 12000);                 // Prevent token limit issues

return { structuredText, aiText };
```

**Design Rationale:**
- **12,000 char limit:** Llama 3.3 70B has ~8K token context (1 token ≈ 4 chars)
- **Why preserve structure?** User wants to see original formatting in UI
- **Why compress for AI?** Tokens cost money; whitespace is wasted

---

#### 2.1.8 **services/analyzeResume.js** - AI Analysis Engine

**Three Core Functions:**

##### A. `analyzeResume()` - ATS Scoring
```javascript
export const analyzeResume = async (resumeText, targetRole, jobDescription) => {
  const prompt = `
  SCORING ALGORITHM (START AT 0):
  1. SECTION INTEGRITY (Max 5): +1.25 per section
  2. HARD SKILL MATCH (Max 25): Based on JD keywords
  3. QUANTIFIABLE DATA (Max 40): Count metrics (%, $, numbers)
  4. PROJECT VALIDATION (Max 20): Tech stack + links + impact
  5. EDUCATIONAL ALIGNMENT (Max 10): Degree relevance
  
  PENALTIES:
  - Personal pronouns (I/me/my): -20
  - Vague bullets ("Assisted", "Worked on"): -15
  - Missing GitHub/LinkedIn: -10
  - Fluff keywords ("passionate", "motivated"): -5 each
  `;
  
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "Cold ATS scoring engine" },
      { role: "user", content: prompt }
    ],
    temperature: 0.1  // Low temp = consistent scoring
  });
  
  return JSON.parse(cleanResponse(response));
};
```

**Why this prompt design?**
- **Mathematical rubric:** AI follows objective rules (not subjective opinions)
- **Harsh penalties:** Reflects real ATS behavior (most fail)
- **Temperature 0.1:** Minimizes randomness in scores

##### B. `parseResumeToStructured()` - JSON Extraction
Converts freeform resume text into structured JSON:
```json
{
  "personalInfo": { "name": "", "email": "", "phone": "", "linkedin": "", "github": "" },
  "skills": { "languages": [], "frontend": [], "backend": [] },
  "experience": [ { "title": "", "company": "", "duration": "", "description": [] } ],
  "projects": [ { "name": "", "techStack": [], "gitRepo": "", "projectLink": "" } ],
  "education": [ { "degree": "", "institution": "", "year": "" } ]
}
```

##### C. `optimizeResumeSection()` - AI Rewriting
Takes a resume section + JD → Returns optimized version with justification

---

#### 2.1.9 **APIs/UserAPI.js** - Protected Routes

**Route Inventory:**

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/optimize-section` | AI section optimization | ✅ |
| POST | `/register` | Create new user | ❌ |
| GET | `/user` | Test auth endpoint | ✅ |
| POST | `/upload-resume` | Upload + analyze PDF | ✅ |
| GET | `/user-resumes` | Fetch user's resume list | ✅ |
| GET | `/profile` | Get user profile | ✅ |
| GET | `/resume/:id` | Get specific resume analysis | ✅ |
| PATCH | `/update-profile` | Update user info | ✅ |
| PUT | `/update-resume/:id` | Update parsed resume data | ✅ |
| GET | `/resume/:id/download` | Download original PDF | ✅ |

**Critical Route: `/upload-resume`**
```javascript
userApp.post("/upload-resume", verifyToken, upload.single("resume"), async (req, res) => {
  // 1. Validate file upload
  if (!req.file) return res.status(400).json({ message: "No file" });
  
  // 2. Extract PDF text (two formats)
  const { structuredText, aiText } = await extractPdfText(req.file.path);
  
  // 3. Parallel AI processing (cuts time in half)
  const [groqResponse, parsedData] = await Promise.all([
    analyzeResume(aiText, targetRole, jobDescription),
    parseResumeToStructured(aiText).catch(() => ({}))  // Non-fatal failure
  ]);
  
  // 4. Upload to Cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "raw",
    folder: "resumes"
  });
  
  // 5. Delete local file
  fs.unlink(req.file.path, (err) => { if (err) console.log(err); });
  
  // 6. Save to MongoDB
  const newResume = await Resume.create({
    userId, resumeName, targetRole, jobDescription,
    fileUrl: result.secure_url,
    filePublicId: result.public_id,
    atsScore: groqResponse.atsScore,
    scoringBreakdown: groqResponse.breakdown,
    missingSkills: groqResponse.missingSkills,
    aiSuggestions: groqResponse.aiSuggestions,
    analysisSummary: groqResponse.analysisSummary,
    resumeText: structuredText,
    parsedData,
    status: "completed"
  });
  
  res.status(201).json({ message: "Success", resume: newResume });
});
```

**Performance Optimization:**
```javascript
// BAD: Sequential (2× slower)
const groqResponse = await analyzeResume(aiText);
const parsedData = await parseResumeToStructured(aiText);

// GOOD: Parallel (cuts time in half)
const [groqResponse, parsedData] = await Promise.all([
  analyzeResume(aiText),
  parseResumeToStructured(aiText)
]);
```

---

#### 2.1.10 **APIs/CommonAPI.js** - Public Routes

**Why separate from UserAPI?**
- Authentication endpoints should be public (no `verifyToken` middleware)
- Clearer separation of concerns (auth vs. business logic)

**Route Inventory:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/login` | Authenticate user → Set httpOnly cookie |
| GET | `/logout` | Clear authentication cookie |
| PUT | `/change-password` | Update password (requires current password) |

**Login Flow:**
```javascript
commonRoute.post("/login", async (req, res) => {
  let { token, user } = await authenticate(req.body);  // Verify credentials
  
  // Set httpOnly cookie (NOT accessible via JavaScript)
  res.cookie("token", token, {
    httpOnly: true,   // Prevents XSS attacks
    sameSite: "lax",  // CSRF protection
    secure: false     // HTTPS only in production
  });
  
  return res.status(200).json({ message: "Login Successful", payload: user });
});
```

**Security Note:** `httpOnly: true` means JavaScript cannot access the cookie:
```javascript
// This returns undefined:
document.cookie  // Cannot steal JWT via XSS
```

---

### 2.2 FRONTEND Structure

```
FRONTEND/
├── public/
│   ├── favicon.svg
│   └── icons.svg                # SVG sprite for icons
│
├── src/
│   ├── main.jsx                 # React root renderer
│   ├── App.jsx                  # Router configuration
│   ├── index.css                # Global Tailwind imports
│   │
│   ├── store/
│   │   ├── authStore.js         # Zustand auth state (persisted)
│   │   └── resumeStore.js       # Zustand resume state
│   │
│   ├── services/
│   │   └── api.js               # Axios instance + API functions
│   │
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── Login.jsx            # Login form
│   │   ├── Register.jsx         # Registration form
│   │   ├── Dashboard.jsx        # User dashboard (stats + recent resumes)
│   │   ├── UploadResume.jsx     # Resume upload form
│   │   ├── ResumeHistory.jsx    # List of all user resumes
│   │   ├── ResumeAnalysis.jsx   # Detailed analysis view
│   │   ├── ResumeBuilder.jsx    # Edit resume + generate PDF
│   │   └── Profile.jsx          # User profile settings
│   │
│   ├── components/
│   │   ├── RootLayout.jsx       # Layout wrapper with Navbar
│   │   ├── Navbar.jsx           # Navigation bar
│   │   ├── Footer.jsx           # Footer component
│   │   ├── ATSScore.jsx         # Circular score display
│   │   ├── MissingSkills.jsx    # Skills list component
│   │   ├── Suggestions.jsx      # AI suggestions display
│   │   ├── HistoryTable.jsx     # Resume history table
│   │   ├── StatsCard.jsx        # Dashboard stat card
│   │   ├── FilePreview.jsx      # PDF preview component
│   │   ├── ResumePDFTemplate.jsx # @react-pdf/renderer template
│   │   │
│   │   └── resume/
│   │       ├── ResumeStyles.js  # Shared PDF styles
│   │       │
│   │       ├── editor/          # Resume editing forms
│   │       │   ├── PersonalTab.jsx
│   │       │   ├── SummaryTab.jsx
│   │       │   ├── SkillsTab.jsx
│   │       │   ├── ExperienceTab.jsx
│   │       │   ├── ProjectsTab.jsx
│   │       │   ├── EducationTab.jsx
│   │       │   ├── AchievementsTab.jsx
│   │       │   ├── SkillModal.jsx
│   │       │   └── OptimizationModal.jsx
│   │       │
│   │       └── pdf/             # PDF section components
│   │           ├── PDFHeader.jsx
│   │           ├── PDFSummary.jsx
│   │           ├── PDFSkills.jsx
│   │           ├── PDFExperience.jsx
│   │           ├── PDFProjects.jsx
│   │           ├── PDFEducation.jsx
│   │           └── PDFAchievements.jsx
│   │
│   └── styles/
│       └── common.js            # Shared Tailwind utility classes
│
├── vite.config.js               # Vite configuration
└── package.json                 # Dependencies
```

#### 2.2.1 **App.jsx** - Router Configuration
**Responsibility:** Define all application routes

```javascript
const routerObj = createBrowserRouter([
  {
    path: "/",
    element: ,  // Wrapper with Navbar + Outlet
    children: [
      { path: "", element:  },
      { path: "/register", element:  },
      { path: "/login", element:  },
      { path: "/dashboard", element:  },
      { path: "/upload", element:  },
      { path: "/history", element:  },
      { path: "/analysis/:id", element:  },
      { path: "/resume-builder/:id", element:  },
      { path: "/profile", element:  }
    ]
  }
]);

function App() {
  return (
    <>
        {/* react-hot-toast */}
      
    </>
  );
}
```

**Why `createBrowserRouter` outside component?**
```javascript
// ❌ BAD: Creates new router on every re-render
function App() {
  const router = createBrowserRouter([...]);  // Memory leak!
  return ;
}

// ✅ GOOD: Router created once
const router = createBrowserRouter([...]);
function App() {
  return ;
}
```

---

#### 2.2.2 **store/authStore.js** - Authentication State
**Responsibility:** Global auth state with persistence

```javascript
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,         // { _id, name, email }
      token: null,        // Not actually used (JWT in httpOnly cookie)
      
      login: (user, token) => set({ user, token }),
      updateUser: (user) => set({ user: { ...get().user, ...user } }),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => Boolean(get().token)
    }),
    { name: 'auth-storage' }  // localStorage key
  )
);
```

**Why Zustand?**
- Lightweight (1KB vs. Redux's 10KB+)
- No boilerplate (no actions, reducers, providers)
- Built-in persistence middleware

**Security Note:** The `token` field is redundant since JWT is in httpOnly cookie. This is just for `isAuthenticated()` check.

---

#### 2.2.3 **store/resumeStore.js** - Resume State
**Responsibility:** Manage resume list + current resume

```javascript
export const useResumeStore = create((set) => ({
  resumes: [],          // List of all user resumes
  currentResume: null,  // Currently viewing/editing resume
  loading: false,
  error: null,
  
  setResumes: (resumes) => set({ resumes }),
  addResume: (resume) => set((state) => ({
    resumes: [resume, ...state.resumes],
    currentResume: resume
  })),
  setCurrentResume: (resume) => set({ currentResume: resume }),
  clearCurrent: () => set({ currentResume: null })
}));
```

---

#### 2.2.4 **services/api.js** - HTTP Client

**Key Features:**
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // e.g., http://localhost:4000
  withCredentials: true,   // ← Send cookies with every request
  headers: { 'Accept': 'application/json' }
});

// Global error handler
api.interceptors.response.use(
  (response) => response.data,  // Auto-unwrap { message, payload }
  (error) => {
    const message = error.response?.data?.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);
```

**Why `withCredentials: true`?**
- Without this, the browser won't send the JWT cookie
- CORS must also allow credentials on backend

**API Function Examples:**
```javascript
export const loginUser = ({ email, password }) =>
  api.post('/common-api/login', { email, password });

export const uploadResume = (file, resumeName, targetRole, jobDescription) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('resumeName', resumeName);
  formData.append('targetRole', targetRole);
  formData.append('jobDescription', jobDescription);
  
  return api.post('/user-api/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
```

---

## 3. FEATURE LOGIC & REQUEST FLOW

### 3.1 User Registration Flow

```
┌──────────────────┐
│  User fills form │
│  (Register.jsx)  │
└────────┬─────────┘
         │ React Hook Form validation
         ↓
┌──────────────────┐
│  POST /register  │
│  { name, email,  │
│    password }    │
└────────┬─────────┘
         │
         ↓
┌────────────────────────────────────────┐
│  BACKEND: UserAPI.js                   │
│  1. Check if email exists              │
│     → User.findOne({ email })          │
│  2. Hash password (bcrypt, salt=10)    │
│  3. Create user document               │
│  4. Save to MongoDB                    │
└────────┬───────────────────────────────┘
         │
         ↓
┌──────────────────┐
│  Response:       │
│  { message:      │
│    "User         │
│    registered" } │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Frontend:       │
│  1. Show success │
│     toast        │
│  2. Navigate to  │
│     /login       │
└──────────────────┘
```

**Code Walkthrough:**

```javascript
// FRONTEND: Register.jsx
const handleSubmit = async (data) => {
  try {
    await registerUser(data);  // API call
    toast.success("Registration successful!");
    navigate("/login");
  } catch (err) {
    toast.error(err.message);
  }
};

// BACKEND: UserAPI.js
userApp.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  
  // Check duplicate
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Save user
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();
  
  res.status(201).json({ message: "User registered successfully" });
});
```

---

### 3.2 Login Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│  USER                                                        │
│  1. Enters email + password                                 │
│  2. Clicks "Login"                                          │
└────────┬────────────────────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND: Login.jsx                                         │
│  1. Validate form (React Hook Form)                         │
│  2. Call loginUser({ email, password })                     │
└────────┬────────────────────────────────────────────────────┘
         │
         ↓ HTTP POST /common-api/login
┌─────────────────────────────────────────────────────────────┐
│  BACKEND: CommonAPI.js → authenticate()                     │
│  1. Find user by email                                      │
│     const user = await User.findOne({ email });             │
│  2. Compare passwords                                       │
│     const isMatch = await bcrypt.compare(password,          │
│                       user.password);                       │
│  3. Generate JWT                                            │
│     const token = jwt.sign({ userId, email },              │
│                   JWT_SECRET, { expiresIn: "1h" });        │
│  4. Set httpOnly cookie                                     │
│     res.cookie("token", token, { httpOnly: true });        │
│  5. Return user object (no password)                        │
└────────┬────────────────────────────────────────────────────┘
         │
         ↓ Response: { message, payload: user }
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND: Login.jsx                                         │
│  1. Store user in Zustand                                   │
│     useAuthStore.login(user, token);                        │
│  2. Navigate to /dashboard                                  │
│  3. Show success toast                                      │
└─────────────────────────────────────────────────────────────┘
```

**Key Security Mechanisms:**

1. **Password Never Sent Back:**
```javascript
const userObj = user.toObject();
delete userObj.password;  // Remove before sending to client
return { token, user: userObj };
```

2. **HttpOnly Cookie (XSS Protection):**
```javascript
res.cookie("token", token, {
  httpOnly: true,   // JavaScript can't access it
  sameSite: "lax",  // CSRF protection
  secure: false     // true in production (HTTPS)
});
```

3. **JWT Payload:**
```javascript
{
  userId: "507f1f77bcf86cd799439011",
  email: "user@example.com",
  iat: 1609459200,  // Issued at (Unix timestamp)
  exp: 1609462800   // Expires at (1 hour later)
}
```

---

### 3.3 Resume Upload & Analysis Flow (Most Complex)

This is the **core feature** of the application.

```
┌──────────────────────────────────────────────────────────────┐
│  STEP 1: USER INTERACTION                                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  User fills form:                                      │  │
│  │  - Resume file (.pdf)                                  │  │
│  │  - Resume name (string)                                │  │
│  │  - Target role (string)                                │  │
│  │  - Job description (optional)                          │  │
│  └────────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────────────────────┐
│  STEP 2: FRONTEND PROCESSING                                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  UploadResume.jsx                                      │  │
│  │  1. Create FormData object                             │  │
│  │  2. Append file + metadata                             │  │
│  │  3. Call uploadResume(formData)                        │  │
│  │  4. Show loading spinner                               │  │
│  └────────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ↓ HTTP POST /user-api/upload-resume
         │ Content-Type: multipart/form-data
         │ Cookie: token=<JWT>
         │
┌──────────────────────────────────────────────────────────────┐
│  STEP 3: SERVER RECEIVES REQUEST                             │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Middleware Stack (order matters!):                    │  │
│  │  1. verifyToken → Decode JWT → req.user = { userId }  │  │
│  │  2. multer.single("resume") → Save file to disk       │  │
│  │     Path: /uploads/1234567890-resume.pdf              │  │
│  └────────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────────────────────┐
│  STEP 4: PDF TEXT EXTRACTION                                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  extractPdfText(req.file.path)                         │  │
│  │  1. Read PDF binary with fs.promises.readFile()        │  │
│  │  2. Parse with pdf-parse library                       │  │
│  │  3. Normalize whitespace                               │  │
│  │  4. Return TWO versions:                               │  │
│  │     - structuredText: For display (preserves \n\n)     │  │
│  │     - aiText: Compact for AI (max 12K chars)          │  │
│  └────────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────────────────────┐
│  STEP 5: PARALLEL AI PROCESSING (Performance Optimization)   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Promise.all([                                         │  │
│  │    analyzeResume(aiText, targetRole, jobDescription),  │  │
│  │    parseResumeToStructured(aiText)                     │  │
│  │  ])                                                    │  │
│  │                                                        │  │
│  │  ┌────────────────────┐  ┌───────────────────────┐    │  │
│  │  │  analyzeResume()   │  │  parseResumeToStruct  │    │  │
│  │  │  ───────────────   │  │  ────────────────────  │    │  │
│  │  │  1. Send to Groq   │  │  1. Send to Groq      │    │  │
│  │  │     API (Llama     │  │     API (Llama 3.3)   │    │  │
│  │  │     3.3 70B)       │  │  2. Extract JSON      │    │  │
│  │  │  2. ATS scoring    │  │     structure:        │    │  │
│  │  │     algorithm      │  │     - Personal info   │    │  │
│  │  │  3. Missing skills │  │     - Skills          │    │  │
│  │  │  4. AI suggestions │  │     - Experience      │    │  │
│  │  │  5. Score          │  │     - Projects        │    │  │
│  │  │     breakdown      │  │     - Education       │    │  │
│  │  └────────────────────┘  └───────────────────────┘    │  │
│  │         ↓                          ↓                    │  │
│  │    {atsScore: 67,          {personalInfo: {},          │  │
│  │     breakdown: {},          skills: [],                │  │
│  │     missingSkills: [],      experience: [],            │  │
│  │     aiSuggestions: [],      projects: [],              │  │
│  │     analysisSummary}        education: []}             │  │
│  └────────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────────────────────┐
│  STEP 6: FILE UPLOAD TO CLOUDINARY                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  cloudinary.uploader.upload(req.file.path, {           │  │
│  │    resource_type: "raw",                               │  │
│  │    folder: "resumes"                                   │  │
│  │  })                                                    │  │
│  │                                                        │  │
│  │  Returns:                                              │  │
│  │  {                                                     │  │
│  │    secure_url: "https://res.cloudinary.com/...pdf",   │  │
│  │    public_id: "resumes/abc123"                        │  │
│  │  }                                                     │  │
│  └────────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────────────────────┐
│  STEP 7: CLEANUP LOCAL FILE                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  fs.unlink(req.file.path, (err) => {                   │  │
│  │    if (err) console.log(err);                          │  │
│  │  });                                                   │  │
│  │  // Delete /uploads/1234567890-resume.pdf             │  │
│  └────────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────────────────────┐
│  STEP 8: SAVE TO MONGODB                                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Resume.create({                                       │  │
│  │    userId,                                             │  │
│  │    resumeName,                                         │  │
│  │    targetRole,                                         │  │
│  │    jobDescription,                                     │  │
│  │    fileUrl: result.secure_url,      // Cloudinary     │  │
│  │    filePublicId: result.public_id,  // Cloudinary ID  │  │
│  │    atsScore: groqResponse.atsScore,                   │  │
│  │    scoringBreakdown: groqResponse.breakdown,          │  │
│  │    missingSkills: groqResponse.missingSkills,         │  │
│  │    aiSuggestions: groqResponse.aiSuggestions,         │  │
│  │    analysisSummary: groqResponse.analysisSummary,     │  │
│  │    resumeText: structuredText,                        │  │
│  │    parsedData: parsedData,                            │  │
│  │    status: "completed"                                │  │
│  │  })                                                    │  │
│  └────────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────────────────────┐
│  STEP 9: SEND RESPONSE TO FRONTEND                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  res.status(201).json({                                │  │
│  │    message: "Resume uploaded successfully",            │  │
│  │    resume: newResume  // Full document                 │  │
│  │  })                                                    │  │
│  └────────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────────────────────┐
│  STEP 10: FRONTEND UPDATES UI                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  UploadResume.jsx                                      │  │
│  │  1. Add resume to Zustand store                        │  │
│  │     useResumeStore.addResume(resume)                   │  │
│  │  2. Show success toast                                 │  │
│  │  3. Navigate to /analysis/{resumeId}                   │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Performance Breakdown:**

| Operation | Time (approx) |
|-----------|---------------|
| PDF text extraction | 200-500ms |
| Groq AI analysis (sequential) | 4-6s |
| Groq AI parsing (sequential) | 3-5s |
| **Total (sequential)** | **7-11s** |
| **Parallel AI calls** | **4-6s** |
| **Time saved** | **3-5s (45% faster)** |
| Cloudinary upload | 1-2s |
| MongoDB save | 50-100ms |

---

### 3.4 Protected Route Access Flow

```
┌──────────────────────────────────────────────────────────────┐
│  USER                                                        │
│  Clicks "View History" (protected route)                    │
└────────┬─────────────────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────────────────────┐
│  FRONTEND: ResumeHistory.jsx                                 │
│  useEffect(() => {                                           │
│    fetchResumeHistory();  // API call on mount               │
│  }, []);                                                     │
└────────┬─────────────────────────────────────────────────────┘
         │
         ↓ GET /user-api/user-resumes
         │ Cookie: token=<JWT>
         │
┌──────────────────────────────────────────────────────────────┐
│  BACKEND: Middleware Chain                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  1. verifyToken middleware executes                    │  │
│  │     a. Extract token from cookies                      │  │
│  │     b. jwt.verify(token, JWT_SECRET)                   │  │
│  │     c. Check if user exists in DB                      │  │
│  │     d. Attach req.user = { userId, email }             │  │
│  │     e. Call next()                                     │  │
│  └────────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ↓ (if token valid)
┌──────────────────────────────────────────────────────────────┐
│  BACKEND: Route Handler                                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  userApp.get("/user-resumes", verifyToken, async...   │  │
│  │    const userId = req.user.userId;  // From JWT        │  │
│  │    const resumes = await Resume.find({ userId })       │  │
│  │      .select("resumeName targetRole atsScore")         │  │
│  │      .sort({ createdAt: -1 });                         │  │
│  │    res.json({ message: "Success", payload: resumes }); │  │
│  └────────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ↓ Response: { message, payload: [...] }
┌──────────────────────────────────────────────────────────────┐
│  FRONTEND: ResumeHistory.jsx                                 │
│  1. Store resumes in Zustand                                 │
│  2. Render table                                             │
└──────────────────────────────────────────────────────────────┘

ERROR PATHS:
├─ No token → 401 "Unauthorized. Please Login"
├─ Expired token → 401 "Session expired. Please login"
├─ Invalid signature → 401 "Invalid token. Please login"
└─ User deleted → 403 "User account blocked or not found"
```

**Security Note:** The `userId` in the JWT is the single source of truth. The frontend cannot forge this value because:
1. JWT signature verification would fail
2. User cannot modify httpOnly cookies via JavaScript

---

## 4. TECH STACK JUSTIFICATION

### 4.1 Why Zustand Over Redux?

| Feature | Redux | Zustand | Winner |
|---------|-------|---------|--------|
| Bundle size | 11KB (gzipped) | 1KB (gzipped) | ✅ Zustand |
| Boilerplate | High (actions, reducers, types) | Minimal | ✅ Zustand |
| Learning curve | Steep | Flat | ✅ Zustand |
| DevTools | Excellent | Good | Redux |
| Middleware | Rich ecosystem | Built-in persist | Tie |
| Performance | Excellent | Excellent | Tie |

**Why Zustand was chosen:**
```javascript
// REDUX: 50+ lines for simple state
// 1. Define action types
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

// 2. Define actions
const login = (user) => ({ type: LOGIN, payload: user });

// 3. Define reducer
const authReducer = (state = {}, action) => {
  switch (action.type) {
    case LOGIN: return { ...state, user: action.payload };
    case LOGOUT: return { ...state, user: null };
    default: return state;
  }
};

// 4. Create store
const store = createStore(authReducer);

// 5. Wrap app in provider


// ────────────────────────────────────────────────

// ZUSTAND: 10 lines for same state
export const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null })
}));

// Usage (no provider needed)
const { user, login } = useAuthStore();
```

**When to use Redux instead:**
- Large team (100+ developers) with strict conventions
- Complex state machines with heavy middleware (sagas, thunks)
- Need for advanced time-travel debugging

---

### 4.2 Why JWT Over Sessions?

| Aspect | Session-Based | JWT | Chosen |
|--------|---------------|-----|--------|
| Stateful/Stateless | Stateful (server stores) | Stateless | ✅ JWT |
| Scalability | Requires sticky sessions or Redis | Infinitely scalable | ✅ JWT |
| Database hits | Every request (session lookup) | Zero (self-contained) | ✅ JWT |
| Revocation | Easy (delete session) | Hard (requires blacklist) | Session |
| Mobile apps | Complex (CSRF tokens) | Simple (just send token) | ✅ JWT |

**Why JWT was chosen:**
```javascript
// SESSION-BASED FLOW:
// 1. User logs in
// 2. Server stores session in Redis/MongoDB
// 3. Server sends session ID cookie
// 4. Every request:
//    a. Server reads session ID from cookie
//    b. Server queries database for session data ← BOTTLENECK
//    c. Server processes request

// JWT FLOW:
// 1. User logs in
// 2. Server generates JWT (no storage needed)
// 3. Server sends JWT in httpOnly cookie
// 4. Every request:
//    a. Server decodes JWT (cryptographic verification only)
//    b. Server processes request (no DB lookup)
```

**Performance Difference:**
```
Session-based: 500 req/s (limited by Redis/DB)
JWT-based: 5000 req/s (CPU-bound, no I/O)
```

**Trade-off Accepted:**
- **Cannot instantly revoke tokens** (they're valid until expiry)
- **Solution:** 1-hour expiry + refresh token pattern (not implemented yet)

---

### 4.3 Why Mongoose Over Native MongoDB Driver?

| Feature | Native Driver | Mongoose | Chosen |
|---------|---------------|----------|--------|
| Schema enforcement | None | Yes | ✅ Mongoose |
| Validation | Manual | Built-in | ✅ Mongoose |
| Relationships | Manual | Virtual populate | ✅ Mongoose |
| Middleware (hooks) | None | Yes | ✅ Mongoose |
| Type safety | Weak | Strong | ✅ Mongoose |
| Performance | Fastest | Slight overhead | Native |

**Why Mongoose was chosen:**

```javascript
// NATIVE DRIVER: Manual validation nightmare
const user = {
  name: req.body.name,
  email: req.body.email,
  password: req.body.password
};

// Manual checks (easy to forget)
if (!user.name || user.name.length < 2) {
  return res.status(400).json({ error: "Invalid name" });
}
if (!/^\S+@\S+\.\S+$/.test(user.email)) {
  return res.status(400).json({ error: "Invalid email" });
}
// ... 20 more lines of validation

await db.collection("users").insertOne(user);

// ────────────────────────────────────────────────

// MONGOOSE: Automatic validation
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: { type: String, required: true, minlength: 8 }
});

// Single line (throws ValidationError if invalid)
await User.create(req.body);
```

**Performance Trade-off:**
- Mongoose adds ~5-10ms per query (schema validation overhead)
- **Acceptable** because we prioritize code safety over microseconds

---

### 4.4 Why React Hook Form Over Formik?

| Feature | Formik | React Hook Form | Chosen |
|---------|--------|-----------------|--------|
| Re-renders | High (controlled inputs) | Minimal (uncontrolled) | ✅ RHF |
| Bundle size | 15KB | 9KB | ✅ RHF |
| Performance | Good | Excellent | ✅ RHF |
| Validation | Yup integration | Built-in + Yup | ✅ RHF |
| Learning curve | Moderate | Low | ✅ RHF |

**Performance Demonstration:**

```javascript
// FORMIK: Re-renders on EVERY keystroke

  {({ values, handleChange }) => (
    <input 
      value={values.email}      // ← Controlled input
      onChange={handleChange}   // ← Triggers re-render
    />
  )}

// Typing "test@example.com" = 17 re-renders

// ────────────────────────────────────────────────

// REACT HOOK FORM: Zero re-renders until submit
const { register, handleSubmit } = useForm();

  // ← Uncontrolled input
// Typing "test@example.com" = 0 re-renders (form doesn't re-render)
```

**Why this matters:**
- Large forms (10+ fields) with Formik = sluggish typing
- Large forms with RHF = instant feedback

---

### 4.5 Why Groq API Over OpenAI?

| Feature | OpenAI GPT-4 | Groq (Llama 3.3 70B) | Chosen |
|---------|--------------|----------------------|--------|
| Latency | 2-5s | 0.5-2s | ✅ Groq |
| Cost per 1M tokens | $30 | $0.70 | ✅ Groq |
| Accuracy | Excellent | Very Good | OpenAI |
| Rate limits | 3,500 RPM | 30,000 RPM | ✅ Groq |

**Why Groq was chosen:**

```javascript
// Cost comparison (1,000 resume analyses):
// Resume = 3,000 tokens average

// OpenAI GPT-4 Turbo:
// 1,000 resumes × 3,000 tokens = 3M tokens
// Cost: 3M tokens × ($10/$1M) = $30

// Groq (Llama 3.3 70B):
// 1,000 resumes × 3,000 tokens = 3M tokens
// Cost: 3M tokens × ($0.70/$1M) = $2.10

// Savings: $27.90 per 1,000 resumes (93% cheaper)
```

**Trade-off Accepted:**
- Slightly lower accuracy (Llama 3.3 70B is still GPT-3.5 level)
- **Worth it** for a student project with budget constraints

---

### 4.6 Why Vite Over Create React App?

| Feature | CRA | Vite | Chosen |
|---------|-----|------|--------|
| Dev server startup | 10-30s | 0.5-2s | ✅ Vite |
| Hot reload speed | 1-3s | 100-300ms | ✅ Vite |
| Build time | 2-5 min | 30-60s | ✅ Vite |
| Bundle size | Large | Optimized | ✅ Vite |
| Maintenance | Deprecated | Active | ✅ Vite |

**Why Vite was chosen:**

```
Developer Experience:
┌─────────────────────────────┐
│  CRA:                       │
│  npm start → ☕☕☕ (30s)    │
│  Change file → ⏳ (3s)     │
│  npm run build → ⏳⏳⏳ (3m) │
└─────────────────────────────┘

┌─────────────────────────────┐
│  Vite:                      │
│  npm run dev → ⚡ (1s)      │
│  Change file → ⚡ (0.2s)    │
│  npm run build → ⚡ (45s)   │
└─────────────────────────────┘
```

**How Vite achieves this:**
- **ESM-based dev server** (no bundling during development)
- **esbuild** (Go-based, 10-100× faster than Webpack)
- **On-demand compilation** (only compile files you're viewing)

---

## 5. TOUGH INTERVIEW QUESTIONS

### 5.1 Performance Questions

#### Q1: How would you scale this backend to handle 10,000 concurrent users?

**Current Bottlenecks:**
1. **Synchronous Groq API calls** (4-6s per request)
2. **Single-threaded Node.js** (CPU-bound operations)
3. **MongoDB query performance** (no indexing strategy)

**Solution Architecture:**

```
┌──────────────────────────────────────────────────────────┐
│  FRONTEND (10,000 users)                                 │
└────────┬─────────────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────────────────┐
│  LOAD BALANCER (Nginx / AWS ALB)                         │
│  ├─ Round-robin distribution                             │
│  ├─ Health checks                                        │
│  └─ SSL termination                                      │
└────────┬─────────────────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────────────────────────┐
│  API GATEWAY LAYER (Rate Limiting)                          │
│  ├─ 10 requests/min per user                                │
│  ├─ 1,000 concurrent uploads across all users               │
│  └─ Redis-backed rate limiter                               │
└─────────┬───────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────────┐
│  EXPRESS API CLUSTER (5-10 instances)                       │
│  Each instance:                                             │
│  ├─ Handle file upload                                      │
│  ├─ Extract PDF text                                        │
│  ├─ Push to message queue                                   │
│  └─ Return "processing" status immediately                  │
└─────────┬───────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────────┐
│  MESSAGE QUEUE (RabbitMQ / AWS SQS)                         │
│  {                                                          │
│    jobId: "abc123",                                         │
│    userId: "507f...",                                       │
│    pdfText: "...",                                          │
│    targetRole: "Software Engineer"                          │
│  }                                                          │
└─────────┬───────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────────┐
│  WORKER POOL (20-50 workers)                                │
│  Each worker:                                               │
│  1. Fetch job from queue                                    │
│  2. Call Groq API                                           │
│  3. Update MongoDB (status: "completed")                    │
│  4. Send WebSocket notification to user                     │
└─────────┬───────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────────┐
│  MONGODB REPLICA SET (1 Primary + 2 Secondary)              │
│  ├─ Read from secondaries (history queries)                 │
│  ├─ Write to primary (new resumes)                          │
│  └─ Automatic failover                                      │
└─────────────────────────────────────────────────────────────┘
```

**Key Optimizations:**

1. **Async Processing:**
```javascript
// BEFORE (blocks for 6s):
app.post("/upload", async (req, res) => {
  const analysis = await analyzeResume(text);  // 6s
  res.json(analysis);
});

// AFTER (returns in 200ms):
app.post("/upload", async (req, res) => {
  const jobId = await queue.add({ text, userId });
  res.json({ jobId, status: "processing" });  // Immediate response
});

// Worker handles AI call asynchronously
worker.process(async (job) => {
  const analysis = await analyzeResume(job.data.text);
  await Resume.update({ _id: jobId }, { analysis });
  io.to(userId).emit("analysis-complete", analysis);  // WebSocket
});
```

2. **Database Indexing:**
```javascript
// BEFORE (full collection scan):
Resume.find({ userId: "..." });  // O(n) - scans all documents

// AFTER (index lookup):
resumeSchema.index({ userId: 1, createdAt: -1 });  // Compound index
Resume.find({ userId: "..." }).sort({ createdAt: -1 });  // O(log n)
```

3. **Caching Layer:**
```javascript
// Redis cache for repeated analyses
const cachedScore = await redis.get(`ats:${pdfHash}`);
if (cachedScore) return JSON.parse(cachedScore);

const score = await analyzeResume(text);
await redis.setex(`ats:${pdfHash}`, 3600, JSON.stringify(score));
```

**Expected Performance:**
- **Before:** 10 concurrent users max (blocking AI calls)
- **After:** 10,000 concurrent users (async queue + horizontal scaling)

---

#### Q2: Your `/upload-resume` endpoint takes 8 seconds. How do you optimize it?

**Current Bottlenecks:**

```javascript
// 1. PDF extraction: 500ms
const { structuredText, aiText } = await extractPdfText(req.file.path);

// 2. AI analysis (sequential): 4-6s
const groqResponse = await analyzeResume(aiText);
const parsedData = await parseResumeToStructured(aiText);

// 3. Cloudinary upload: 1-2s
const result = await cloudinary.uploader.upload(req.file.path);

// 4. MongoDB save: 100ms
await Resume.create({ ... });

// TOTAL: ~8 seconds
```

**Optimization Strategy:**

```javascript
// SOLUTION 1: Parallelize independent operations
const [groqResponse, parsedData, cloudinaryResult] = await Promise.all([
  analyzeResume(aiText),              // 4s
  parseResumeToStructured(aiText),    // 4s (runs in parallel)
  cloudinary.uploader.upload(req.file.path)  // 2s (runs in parallel)
]);
// NEW TOTAL: ~4s (50% faster)

// SOLUTION 2: Stream PDF to Cloudinary (skip disk write)
import { Readable } from 'stream';
const uploadStream = cloudinary.uploader.upload_stream({ folder: "resumes" });
Readable.from(req.file.buffer).pipe(uploadStream);
// Saves 200ms (no disk I/O)

// SOLUTION 3: Async job queue (return immediately)
app.post("/upload", async (req, res) => {
  const resumeId = new ObjectId();
  
  // Save with status "processing"
  await Resume.create({
    _id: resumeId,
    userId,
    status: "processing",
    fileUrl: cloudinaryResult.secure_url
  });
  
  // Push to queue (non-blocking)
  await queue.add({ resumeId, aiText, targetRole });
  
  // Return immediately
  res.json({ resumeId, status: "processing" });
});

// Worker handles AI analysis
worker.process(async (job) => {
  const { resumeId, aiText, targetRole } = job.data;
  
  const [groqResponse, parsedData] = await Promise.all([
    analyzeResume(aiText, targetRole),
    parseResumeToStructured(aiText)
  ]);
  
  await Resume.update({ _id: resumeId }, {
    atsScore: groqResponse.atsScore,
    parsedData,
    status: "completed"
  });
});
```

**Performance Gains:**
- **Current:** 8s (blocks user)
- **Parallel:** 4s (50% faster)
- **Async Queue:** 200ms (96% faster perceived latency)

---

#### Q3: How would you optimize React re-renders in the `ResumeBuilder` component?

**Problem:** Large form with 50+ inputs causes sluggish typing.

**Diagnosis:**
```javascript
// CURRENT: Entire form re-renders on every field change
const [formData, setFormData] = useState({ /* 50 fields */ });

<input 
  value={formData.firstName} 
  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
/>
// ↑ Spreads entire object → triggers re-render of all 50 inputs
```

**Solution 1: React Hook Form (Uncontrolled Inputs)**
```javascript
const { register, handleSubmit } = useForm({
  defaultValues: initialData
});

// No state, no re-renders


// ... 48 more fields

// Only re-renders on submit
const onSubmit = (data) => {
  console.log(data);  // All 50 fields in one object
};
```

**Solution 2: React.memo + useCallback (If using controlled inputs)**
```javascript
// Memoize child components
const TextInput = React.memo(({ value, onChange, name }) => (
  
));

// Parent component
const ResumeBuilder = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // Memoize callbacks
  const handleFirstNameChange = useCallback((e) => {
    setFirstName(e.target.value);
  }, []);
  
  return (
    <>
      
      
    </>
  );
};
// Only the changed input re-renders
```

**Solution 3: Zustand for Form State**
```javascript
// Split form into multiple stores
const usePersonalInfoStore = create((set) => ({
  firstName: "",
  setFirstName: (val) => set({ firstName: val })
}));

const useSkillsStore = create((set) => ({
  skills: [],
  addSkill: (skill) => set((state) => ({ skills: [...state.skills, skill] }))
}));

// Components only subscribe to what they need
const FirstNameInput = () => {
  const { firstName, setFirstName } = usePersonalInfoStore();
  return <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />;
};
// ↑ Only this component re-renders when firstName changes
```

**Performance Metrics:**

| Approach | Re-renders (typing "John") | Time to Interactive |
|----------|----------------------------|---------------------|
| Current (single state) | 200 (4 chars × 50 inputs) | Sluggish |
| React Hook Form | 0 | Instant |
| React.memo | 4 (only changed input) | Smooth |
| Zustand (split stores) | 4 (only changed input) | Smooth |

---

### 5.2 Security Questions

#### Q4: How are you protecting API routes from unauthorized access?

**Multi-Layer Security:**

**Layer 1: JWT Authentication**
```javascript
// verifyToken middleware
export const verifyToken = async (req, res, next) => {
  // 1. Extract token from httpOnly cookie (XSS protection)
  let token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  
  // 2. Verify signature (prevents tampering)
  let decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
  // 3. Check user still exists (handles deleted accounts)
  const user = await User.findById(decodedToken.userId);
  if (!user) return res.status(403).json({ message: "User blocked" });
  
  // 4. Attach user context
  req.user = decodedToken;
  next();
};
```

**Layer 2: Resource Authorization**
```javascript
// Prevent users from accessing other users' resumes
userApp.get("/resume/:id", verifyToken, async (req, res) => {
  const resume = await Resume.findOne({ 
    _id: req.params.id, 
    userId: req.user.userId  // ← Ensures ownership
  });
  
  if (!resume) {
    return res.status(404).json({ message: "Resume not found" });
  }
  
  res.json(resume);
});
```

**Layer 3: CORS Policy**
```javascript
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,  // Production domain
      "http://localhost:5173"     // Development
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true  // Allow cookies
}));
```

**Layer 4: Rate Limiting (Not implemented, should be added)**
```javascript
import rateLimit from "express-rate-limit";

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // Max 5 uploads per window
  message: "Too many uploads, please try again later"
});

app.post("/upload-resume", uploadLimiter, verifyToken, ...);
```

**Layer 5: Input Validation (Missing, should be added)**
```javascript
import { body, validationResult } from "express-validator";

app.post("/register", [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }).matches(/[A-Z]/).matches(/[0-9]/),
  body("name").trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ...
});
```

---

#### Q5: Your JWT tokens are stored in httpOnly cookies. What happens if a user's token gets stolen?

**Attack Scenario:**
```
1. Attacker steals JWT cookie via:
   - Network sniffing (if HTTPS not used)
   - MITM attack on public WiFi
   - Physical access to victim's browser
   
2. Attacker sends requests with stolen cookie:
   GET /user-api/user-resumes
   Cookie: token=<stolen_jwt>
   
3. Backend accepts it (JWT is valid)
```

**Current Vulnerability:**
- **No token revocation mechanism**
- Token remains valid until expiry (1 hour)

**Mitigation Strategies:**

**Solution 1: Short-Lived Tokens + Refresh Tokens**
```javascript
// Login returns TWO tokens
const accessToken = jwt.sign({ userId }, SECRET, { expiresIn: "15m" });
const refreshToken = jwt.sign({ userId }, SECRET, { expiresIn: "7d" });

// Store refresh token in DB
await RefreshToken.create({ userId, token: refreshToken });

// Client uses accessToken for requests (expires in 15 min)
// When accessToken expires, client hits /refresh endpoint
app.post("/refresh", async (req, res) => {
  const { refreshToken } = req.cookies;
  
  // Verify refresh token exists in DB
  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!storedToken) return res.status(401).json({ message: "Invalid" });
  
  // Issue new accessToken
  const newAccessToken = jwt.sign({ userId: storedToken.userId }, SECRET, { expiresIn: "15m" });
  res.json({ accessToken: newAccessToken });
});

// If token stolen, attacker only has 15 minutes of access
```

**Solution 2: IP Address Validation**
```javascript
// Store IP in JWT
const token = jwt.sign({ userId, ip: req.ip }, SECRET);

// Verify IP on every request
export const verifyToken = async (req, res, next) => {
  const decoded = jwt.verify(token, SECRET);
  
  if (decoded.ip !== req.ip) {
    // Token used from different IP = suspicious
    return res.status(403).json({ message: "Token IP mismatch" });
  }
  
  next();
};
```

**Solution 3: Token Blacklist (Redis)**
```javascript
// User clicks "Logout from all devices"
app.post("/revoke-all-tokens", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  
  // Add user to blacklist with TTL = longest token expiry
  await redis.setex(`blacklist:${userId}`, 3600, "true");
  
  res.json({ message: "All tokens revoked" });
});

// Check blacklist on every request
export const verifyToken = async (req, res, next) => {
  const decoded = jwt.verify(token, SECRET);
  
  const isBlacklisted = await redis.get(`blacklist:${decoded.userId}`);
  if (isBlacklisted) {
    return res.status(401).json({ message: "Token revoked" });
  }
  
  next();
};
```

**Best Practice:**
Implement **Solution 1 (Refresh Tokens)** because:
- Short access token window (15 min)
- Can revoke refresh tokens in DB
- Industry standard (used by Google, Facebook, etc.)

---

#### Q6: How would you prevent XSS and SQL injection in this app?

**XSS (Cross-Site Scripting) Protection:**

**Current Defenses:**
```javascript
// 1. httpOnly cookies (JWT not accessible via JavaScript)
res.cookie("token", token, { httpOnly: true });

// 2. React auto-escapes JSX
{user.name}  // If user.name = "alert('XSS')"
// Renders as: <script>alert('XSS')</script>

// 3. Content-Type headers prevent script execution
res.json({ data: user.name });  // Browser won't execute as script
```

**Additional Protection Needed:**
```javascript
import helmet from "helmet";

app.use(helmet());  // Sets secure HTTP headers:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: DENY (prevents clickjacking)
// - Content-Security-Policy: default-src 'self'

// Sanitize user input before saving to DB
import DOMPurify from 'isomorphic-dompurify';

app.post("/update-profile", async (req, res) => {
  const sanitizedName = DOMPurify.sanitize(req.body.name);
  await User.update({ name: sanitizedName });
});
```

**SQL Injection Protection:**

**MongoDB is immune to traditional SQL injection**, but NoSQL injection exists:

```javascript
// VULNERABLE (NoSQL injection):
app.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password  // ← Attacker can send: { $ne: null }
  });
});

// Attack payload:
// { "email": "admin@example.com", "password": { "$ne": null } }
// Bypasses password check (password != null is always true)

// ────────────────────────────────────────────────

// PROTECTED (input validation):
import { body, validationResult } from "express-validator";

app.post("/login", [
  body("email").isEmail(),
  body("password").isString()  // Rejects objects
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors });
  
  // Safe: both are strings
  const user = await User.findOne({
    email: req.body.email,
    password: bcrypt.hash(req.body.password)
  });
});
```

---

### 5.3 Edge Cases

#### Q7: What happens if MongoDB goes down while a user is uploading a resume?

**Current Behavior:**
```javascript
app.post("/upload-resume", async (req, res) => {
  // 1. File upload succeeds → saved to /uploads/
  // 2. PDF extraction succeeds
  // 3. AI analysis succeeds (Groq API)
  // 4. Cloudinary upload succeeds
  // 5. MongoDB save fails ← DATABASE DOWN
  
  await Resume.create({ ... });  // Throws MongoError
  
  // ERROR: File uploaded to Cloudinary but not tracked in DB
  // RESULT: Orphaned file (wasted storage)
});
```

**Failure Scenarios:**

| Step | Success | Failure Impact |
|------|---------|----------------|
| 1. File upload | ✅ | No cleanup needed |
| 2. PDF extraction | ✅ | Local file exists |
| 3. AI analysis | ✅ | Groq API charged |
| 4. Cloudinary upload | ✅ | File on CDN |
| 5. MongoDB save | ❌ | **Orphaned data** |

**Improved Solution: Transaction Pattern**

```javascript
app.post("/upload-resume", async (req, res) => {
  let cloudinaryResult = null;
  
  try {
    // 1. Extract PDF text
    const { aiText } = await extractPdfText(req.file.path);
    
    // 2. AI analysis
    const [groqResponse, parsedData] = await Promise.all([
      analyzeResume(aiText),
      parseResumeToStructured(aiText)
    ]);
    
    // 3. Upload to Cloudinary
    cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
    
    // 4. Save to MongoDB (critical step)
    const resume = await Resume.create({
      userId,
      fileUrl: cloudinaryResult.secure_url,
      filePublicId: cloudinaryResult.public_id,
      ...groqResponse,
      parsedData
    });
    
    // 5. Cleanup local file
    fs.unlinkSync(req.file.path);
    
    res.json({ message: "Success", resume });
    
  } catch (error) {
    // ROLLBACK: Delete Cloudinary file if DB save failed
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }
    
    // Cleanup local file
    if (req.file?.path) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: "Upload failed", 
      error: error.message 
    });
  }
});
```

**Better Solution: Circuit Breaker + Retry Logic**

```javascript
import CircuitBreaker from 'opossum';

const saveToMongo = async (data) => {
  return await Resume.create(data);
};

// Circuit breaker: Stop trying after 3 failures
const protectedSave = new CircuitBreaker(saveToMongo, {
  timeout: 5000,      // 5s timeout
  errorThresholdPercentage: 50,  // Open circuit at 50% failure rate
  resetTimeout: 30000  // Retry after 30s
});

protectedSave.on('open', () => {
  console.error("MongoDB circuit breaker opened - DB is down");
  // Send alert to monitoring system
});

app.post("/upload-resume", async (req, res) => {
  try {
    // ... file upload, AI analysis ...
    
    const resume = await protectedSave.fire(resumeData);
    res.json({ resume });
    
  } catch (error) {
    if (error.message.includes("ETIMEDOUT")) {
      return res.status(503).json({ 
        message: "Database temporarily unavailable. Please try again." 
      });
    }
    
    res.status(500).json({ message: "Upload failed" });
  }
});
```

---

#### Q8: How do you handle AI API failures gracefully?

**Current Behavior:**
```javascript
export const analyzeResume = async (resumeText) => {
  try {
    const response = await groq.chat.completions.create({ ... });
    return JSON.parse(response.choices[0].message.content);
    
  } catch (error) {
    console.log("Groq error:", error.message);
    
    // FALLBACK: Basic scoring
    const wordCount = resumeText.split(" ").length;
    const basicScore = Math.min(55, Math.max(10, Math.floor(wordCount / 12)));
    
    return {
      atsScore: basicScore,
      missingSkills: [],
      aiSuggestions: [
        "AI analysis was temporarily unavailable.",
        "Add quantified achievements.",
        "Ensure all standard sections are labeled."
      ],
      analysisSummary: "AI scoring unavailable. Re-upload for detailed analysis."
    };
  }
};
```

**Problem:** User gets degraded experience without knowing AI failed.

**Improved Solution: Transparent Error Handling**

```javascript
export const analyzeResume = async (resumeText, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await groq.chat.completions.create({ ... });
      return { 
        success: true, 
        data: JSON.parse(response.choices[0].message.content) 
      };
      
    } catch (error) {
      // Log to monitoring service
      logger.error("Groq API failure", { 
        attempt: i + 1, 
        error: error.message 
      });
      
      // Retry with exponential backoff
      if (i < retries - 1) {
        await sleep(Math.pow(2, i) * 1000);  // 1s, 2s, 4s
        continue;
      }
      
      // Final fallback after 3 retries
      return {
        success: false,
        error: "AI_SERVICE_UNAVAILABLE",
        data: {
          atsScore: estimateScore(resumeText),
          missingSkills: [],
          aiSuggestions: [],
          analysisSummary: "AI analysis failed after 3 attempts"
        }
      };
    }
  }
};

// Frontend handles degraded state
const handleUpload = async () => {
  const result = await uploadResume(file);
  
  if (!result.aiAnalysisSuccess) {
    toast.warning(
      "Resume uploaded but AI analysis failed. You can re-analyze later.",
      { duration: 5000 }
    );
  } else {
    toast.success("Resume analyzed successfully!");
  }
};
```

**Alternative: Queue-Based Retry**

```javascript
app.post("/upload-resume", async (req, res) => {
  // Save with status "pending_analysis"
  const resume = await Resume.create({
    userId,
    fileUrl,
    status: "pending_analysis"
  });
  
  // Add to queue (will retry automatically)
  await analysisQueue.add(
    { resumeId: resume._id, text: aiText },
    { 
      attempts: 5,           // Retry 5 times
      backoff: {
        type: 'exponential',
        delay: 2000          // 2s, 4s, 8s, 16s, 32s
      }
    }
  );
  
  res.json({ 
    resumeId: resume._id, 
    status: "processing" 
  });
});

// Worker processes job
analysisQueue.process(async (job) => {
  const { resumeId, text } = job.data;
  
  try {
    const analysis = await analyzeResume(text);
    
    await Resume.update({ _id: resumeId }, {
      ...analysis,
      status: "completed"
    });
    
  } catch (error) {
    // Mark as failed after all retries
    await Resume.update({ _id: resumeId }, {
      status: "failed",
      errorMessage: "AI analysis failed after 5 attempts"
    });
    
    throw error;  // Let Bull retry
  }
});
```

---

#### Q9: What if two users upload resumes with identical content?

**Current Behavior:**
```javascript
app.post("/upload-resume", async (req, res) => {
  // Each upload creates:
  // 1. New Cloudinary file (costs storage)
  // 2. New MongoDB document
  // 3. New AI analysis (costs money)
  
  const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
  const groqResponse = await analyzeResume(aiText);
  
  await Resume.create({
    userId,
    fileUrl: cloudinaryResult.secure_url,
    atsScore: groqResponse.atsScore
  });
});
```

**Problem:** Duplicate AI analysis costs money.

**Solution: Content-Based Deduplication**

```javascript
import crypto from 'crypto';

app.post("/upload-resume", async (req, res) => {
  // 1. Extract text
  const { aiText } = await extractPdfText(req.file.path);
  
  // 2. Generate hash
  const contentHash = crypto
    .createHash('sha256')
    .update(aiText)
    .digest('hex');
  
  // 3. Check for existing analysis
  const existingAnalysis = await ResumeCache.findOne({ contentHash });
  
  let groqResponse;
  if (existingAnalysis) {
    console.log("Cache hit - reusing existing analysis");
    groqResponse = existingAnalysis.analysis;
  } else {
    console.log("Cache miss - running new analysis");
    groqResponse = await analyzeResume(aiText);
    
    // Cache for 30 days
    await ResumeCache.create({
      contentHash,
      analysis: groqResponse,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
  }
  
  // 4. Upload file (still unique per user)
  const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
  
  // 5. Save resume
  await Resume.create({
    userId,
    fileUrl: cloudinaryResult.secure_url,
    contentHash,  // Track which cache entry this used
    ...groqResponse
  });
});
```

**Cost Savings:**
```
Without deduplication:
1,000 users × 1 resume each = 1,000 AI calls
Cost: 1,000 × $0.001 = $1.00

With deduplication (assuming 10% duplicates):
900 unique resumes + 100 cache hits = 900 AI calls
Cost: 900 × $0.001 = $0.90
Savings: $0.10 (10%)

For 100,000 users with 20% duplicates:
Savings: $2,000 (20% of $10,000)
```

---

### 5.4 Optimization Questions

#### Q10: How would you reduce the bundle size of the frontend?

**Current Bundle Analysis:**

```bash
npm run build

# Output:
dist/assets/index-abc123.js   245 KB  # Main bundle
dist/assets/vendor-xyz789.js  850 KB  # Dependencies
TOTAL: 1.09 MB
```

**Problem:** Large bundle = slow initial load (3-5s on 3G).

**Optimization Strategy:**

**1. Code Splitting (Lazy Loading)**
```javascript
// BEFORE: All components bundled together
import Dashboard from './pages/Dashboard';
import ResumeAnalysis from './pages/ResumeAnalysis';
import ResumeBuilder from './pages/ResumeBuilder';

const routerObj = createBrowserRouter([
  { path: "/dashboard", element:  },
  { path: "/analysis/:id", element:  },
  { path: "/resume-builder/:id", element:  }
]);

// Bundle size: 1.09 MB (all pages loaded upfront)

// ────────────────────────────────────────────────

// AFTER: Lazy load pages
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ResumeAnalysis = lazy(() => import('./pages/ResumeAnalysis'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));

const routerObj = createBrowserRouter([
  { 
    path: "/dashboard", 
    element: }> 
  },
  { 
    path: "/analysis/:id", 
    element: }> 
  },
  { 
    path: "/resume-builder/:id", 
    element: }> 
  }
]);

// Initial bundle: 350 KB (only Home + Login)
// Dashboard loads on-demand: +200 KB
// ResumeAnalysis loads on-demand: +300 KB
```

**2. Tree Shaking (Remove Unused Code)**
```javascript
// BEFORE: Import entire library
import _ from 'lodash';  // 70 KB
const uniqueArray = _.uniq([1, 2, 2, 3]);

// AFTER: Import only what you need
import uniq from 'lodash/uniq';  // 2 KB
const uniqueArray = uniq([1, 2, 2, 3]);

// Savings: 68 KB
```

**3. Replace Heavy Dependencies**
```javascript
// BEFORE: Moment.js (232 KB)
import moment from 'moment';
const date = moment().format('YYYY-MM-DD');

// AFTER: date-fns (13 KB with tree-shaking)
import { format } from 'date-fns';
const date = format(new Date(), 'yyyy-MM-dd');

// Savings: 219 KB

// ────────────────────────────────────────────────

// BEFORE: Axios (15 KB)
import axios from 'axios';
const data = await axios.get('/api/users').then(res => res.data);

// AFTER: Native fetch (0 KB)
const response = await fetch('/api/users');
const data = await response.json();

// Savings: 15 KB
```

**4. Dynamic Imports for Large Features**
```javascript
// BEFORE: PDF generation always loaded
import { PDFDownloadLink } from '@react-pdf/renderer';

function ResumeAnalysis() {
  return (
    <>
      
      }>Download
    </>
  );
}

// AFTER: Load PDF library only when user clicks "Download"
function ResumeAnalysis() {
  const [showPDF, setShowPDF] = useState(false);
  
  const handleDownload = async () => {
    setShowPDF(true);
    const PDFModule = await import('@react-pdf/renderer');
    // ... generate PDF
  };
  
  return (
    <>
      
      Download
    </>
  );
}

// Savings: 120 KB (only loaded when needed)
```

**5. Enable Gzip/Brotli Compression**
```javascript
// Vite automatically enables Brotli in production
// vite.config.js
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.logs
        drop_debugger: true
      }
    }
  }
};

// Before compression: 1.09 MB
// After Brotli: 320 KB (70% reduction)
```

**Final Bundle Size:**

| Optimization | Size Reduction |
|-------------|----------------|
| Code Splitting | -400 KB |
| Tree Shaking (lodash) | -68 KB |
| date-fns instead of moment | -219 KB |
| Remove axios (use fetch) | -15 KB |
| Dynamic PDF import | -120 KB |
| **Subtotal** | **-822 KB** |
| Brotli compression (70%) | **-246 KB** |
| **FINAL BUNDLE** | **~250 KB** |

**Load Time Improvement:**
- Before: 5.2s (3G) / 1.8s (4G)
- After: 1.1s (3G) / 0.4s (4G)

---

#### Q11: How would you implement caching for frequently accessed resumes?

**Current Problem:**
```javascript
// Every request hits MongoDB
app.get("/resume/:id", verifyToken, async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id });  // DB query every time
  res.json(resume);
});

// 100 users viewing same resume = 100 DB queries
```

**Solution 1: In-Memory Cache (Redis)**

```javascript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

app.get("/resume/:id", verifyToken, async (req, res) => {
  const cacheKey = `resume:${req.params.id}`;
  
  // 1. Try cache first
  const cachedResume = await redis.get(cacheKey);
  if (cachedResume) {
    console.log("Cache hit");
    return res.json(JSON.parse(cachedResume));
  }
  
  // 2. Cache miss - query DB
  console.log("Cache miss");
  const resume = await Resume.findOne({ _id: req.params.id });
  
  if (!resume) {
    return res.status(404).json({ message: "Not found" });
  }
  
  // 3. Store in cache (TTL = 1 hour)
  await redis.setex(cacheKey, 3600, JSON.stringify(resume));
  
  res.json(resume);
});

// Now: 100 users = 1 DB query + 99 cache hits
```

**Solution 2: HTTP Cache Headers (Browser Caching)**

```javascript
app.get("/resume/:id", verifyToken, async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id });
  
  // Tell browser to cache for 5 minutes
  res.set('Cache-Control', 'private, max-age=300');  // 300s = 5 min
  res.json(resume);
});

// First request: Server → Browser (network)
// Next 5 minutes: Browser cache (0ms latency)
```

**Solution 3: Service Worker (Offline Support)**

```javascript
// service-worker.js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/resume/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log("Serving from cache");
          return cachedResponse;
        }
        
        // Fetch from network and cache
        return fetch(event.request).then((response) => {
          return caches.open('resumes-v1').then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});

// User can view previously loaded resumes offline
```

**Cache Invalidation Strategy:**

```javascript
// Invalidate cache when resume is updated
app.put("/update-resume/:id", verifyToken, async (req, res) => {
  await Resume.updateOne({ _id: req.params.id }, req.body);
  
  // Delete cache
  await redis.del(`resume:${req.params.id}`);
  
  res.json({ message: "Updated" });
});

// Alternative: Update cache instead of deleting
app.put("/update-resume/:id", verifyToken, async (req, res) => {
  const updatedResume = await Resume.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );
  
  // Update cache with new version
  await redis.setex(
    `resume:${req.params.id}`, 
    3600, 
    JSON.stringify(updatedResume)
  );
  
  res.json({ message: "Updated", resume: updatedResume });
});
```

**Performance Metrics:**

| Scenario | Without Cache | With Redis | With Browser Cache |
|----------|---------------|------------|-------------------|
| First load | 150ms | 150ms | 150ms |
| Repeat load (same user) | 150ms | 5ms | 0ms (instant) |
| 1,000 users viewing same resume | 150s total | 155ms total | 150ms + 0ms × 999 |

---

#### Q12: Your MongoDB query for fetching user resumes is slow. How do you optimize it?

**Current Slow Query:**
```javascript
// Query without index
const resumes = await Resume.find({ userId: "507f1f77bcf86cd799439011" })
  .sort({ createdAt: -1 });

// MongoDB has to:
// 1. Scan ENTIRE collection (100,000 documents)
// 2. Filter by userId (O(n) linear scan)
// 3. Sort results in memory
// Time: 2-5 seconds
```

**Solution 1: Compound Index**

```javascript
// Add compound index
resumeSchema.index({ userId: 1, createdAt: -1 });

// MongoDB now:
// 1. Uses index to find userId (O(log n) binary search)
// 2. Results already sorted by createdAt (no in-memory sort)
// Time: 10-50ms

// Query plan before:
COLLSCAN { userId: "..." }  // Full collection scan
  ├─ examined: 100,000 documents
  ├─ returned: 50 documents
  └─ time: 3,200ms

// Query plan after:
IXSCAN { userId: 1, createdAt: -1 }  // Index scan
  ├─ examined: 50 documents
  ├─ returned: 50 documents
  └─ time: 12ms
```

**Solution 2: Projection (Fetch Only Needed Fields)**

```javascript
// BEFORE: Fetch entire document
const resumes = await Resume.find({ userId })
  .sort({ createdAt: -1 });

// Returns:
{
  _id, userId, resumeName, targetRole, jobDescription,
  fileUrl, filePublicId, atsScore, scoringBreakdown,
  missingSkills, aiSuggestions, analysisSummary,
  resumeText (5,000 chars), parsedData (10,000 chars),
  status, createdAt, updatedAt
}
// Total: ~20 KB per resume × 50 = 1 MB

// ────────────────────────────────────────────────

// AFTER: Fetch only display fields
const resumes = await Resume.find({ userId })
  .select('resumeName targetRole atsScore createdAt')  // ← Only 4 fields
  .sort({ createdAt: -1 });

// Returns:
{ _id, resumeName, targetRole, atsScore, createdAt }
// Total: 200 bytes per resume × 50 = 10 KB

// Bandwidth saved: 990 KB (99% reduction)
```

**Solution 3: Pagination (Limit Results)**

```javascript
// BEFORE: Fetch all user resumes
const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
// If user has 500 resumes = 10 MB response

// AFTER: Paginate results
const page = parseInt(req.query.page) || 1;
const limit = 20;
const skip = (page - 1) * limit;

const resumes = await Resume.find({ userId })
  .select('resumeName targetRole atsScore createdAt')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip);

const total = await Resume.countDocuments({ userId });

res.json({
  resumes,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  }
});

// Page 1: 20 resumes (400 KB)
// Page 2: 20 resumes (400 KB)
// etc.
```

**Solution 4: Aggregation Pipeline (Advanced Filtering)**

```javascript
// BEFORE: Fetch all, filter in JavaScript
const allResumes = await Resume.find({ userId });
const highScoreResumes = allResumes.filter(r => r.atsScore >= 70);

// AFTER: Filter in database
const highScoreResumes = await Resume.find({
  userId,
  atsScore: { $gte: 70 }
}).select('resumeName atsScore');

// Even better: Aggregation pipeline
const stats = await Resume.aggregate([
  { $match: { userId: mongoose.Types.ObjectId(userId) } },
  { $group: {
      _id: null,
      totalResumes: { $sum: 1 },
      avgScore: { $avg: '$atsScore' },
      maxScore: { $max: '$atsScore' },
      recentResumes: { 
        $push: { 
          name: '$resumeName', 
          score: '$atsScore' 
        } 
      }
    }
  },
  { $project: {
      totalResumes: 1,
      avgScore: { $round: ['$avgScore', 2] },
      maxScore: 1,
      recentResumes: { $slice: ['$recentResumes', 5] }
    }
  }
]);
```

**Performance Comparison:**

| Query | Documents Examined | Time | Bandwidth |
|-------|-------------------|------|-----------|
| No index, full doc | 100,000 | 3.2s | 1 MB |
| Indexed, full doc | 50 | 800ms | 1 MB |
| Indexed, projection | 50 | 50ms | 10 KB |
| Indexed, projection, paginated | 20 | 12ms | 4 KB |

---

#### Q13: How would you implement real-time updates for resume analysis status?

**Current Problem:**
```javascript
// User uploads resume
POST /upload-resume → Returns { resumeId, status: "processing" }

// User must poll to check status
setInterval(async () => {
  const resume = await fetch(`/resume/${resumeId}`);
  if (resume.status === "completed") {
    // Show results
  }
}, 2000);  // Poll every 2 seconds
```

**Problem with Polling:**
- Wastes bandwidth (99% of requests return "processing")
- High latency (2s delay before user sees completion)
- Unnecessary server load

**Solution 1: WebSockets (Socket.io)**

```javascript
// BACKEND: server.js
import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true }
});

// Authenticate socket connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error("Authentication failed"));
  }
});

// User joins their personal room
io.on('connection', (socket) => {
  socket.join(`user:${socket.userId}`);
  console.log(`User ${socket.userId} connected`);
});

// Worker sends updates
analysisQueue.process(async (job) => {
  const { resumeId, userId } = job.data;
  
  // Send progress updates
  io.to(`user:${userId}`).emit('analysis-progress', {
    resumeId,
    step: 'Extracting text',
    progress: 25
  });
  
  const { aiText } = await extractPdfText(filePath);
  
  io.to(`user:${userId}`).emit('analysis-progress', {
    resumeId,
    step: 'Running AI analysis',
    progress: 50
  });
  
  const analysis = await analyzeResume(aiText);
  
  io.to(`user:${userId}`).emit('analysis-progress', {
    resumeId,
    step: 'Saving results',
    progress: 90
  });
  
  await Resume.update({ _id: resumeId }, { ...analysis, status: "completed" });
  
  // Send completion event
  io.to(`user:${userId}`).emit('analysis-complete', {
    resumeId,
    analysis
  });
});

// ────────────────────────────────────────────────

// FRONTEND: UploadResume.jsx
import { io } from 'socket.io-client';

const UploadResume = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  
  useEffect(() => {
    const socket = io(API_URL, {
      auth: { token: useAuthStore.getState().token }
    });
    
    // Listen for progress updates
    socket.on('analysis-progress', (data) => {
      setProgress(data.progress);
      setCurrentStep(data.step);
    });
    
    // Listen for completion
    socket.on('analysis-complete', (data) => {
      toast.success("Analysis complete!");
      navigate(`/analysis/${data.resumeId}`);
    });
    
    return () => socket.disconnect();
  }, []);
  
  return (
    
      
      {currentStep}
    
  );
};
```

**Solution 2: Server-Sent Events (Simpler Alternative)**

```javascript
// BACKEND
app.get('/resume/:id/status', verifyToken, async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const { id } = req.params;
  
  // Send updates every 500ms
  const interval = setInterval(async () => {
    const resume = await Resume.findById(id);
    
    res.write(`data: ${JSON.stringify({
      status: resume.status,
      progress: resume.progress
    })}\n\n`);
    
    if (resume.status === "completed") {
      clearInterval(interval);
      res.end();
    }
  }, 500);
  
  req.on('close', () => clearInterval(interval));
});

// FRONTEND
useEffect(() => {
  const eventSource = new EventSource(`${API_URL}/resume/${resumeId}/status`);
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setStatus(data.status);
    
    if (data.status === "completed") {
      eventSource.close();
      navigate(`/analysis/${resumeId}`);
    }
  };
  
  return () => eventSource.close();
}, [resumeId]);
```

**Comparison:**

| Feature | Polling | WebSockets | SSE |
|---------|---------|------------|-----|
| Latency | 2s | Real-time | Real-time |
| Bandwidth | High | Low | Low |
| Complexity | Simple | Medium | Simple |
| Browser support | All | All modern | All modern |
| Bi-directional | No | Yes | No (server→client only) |

**Recommendation:** **WebSockets (Socket.io)** for full-featured real-time updates.

---

#### Q14: How would you optimize the ATS scoring algorithm to run faster?

**Current Implementation:**
```javascript
export const analyzeResume = async (resumeText, targetRole, jobDescription) => {
  const prompt = `[4,000 character prompt with scoring rubric]`;
  
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",  // 70 billion parameters
    messages: [
      { role: "system", content: "Cold ATS engine" },
      { role: "user", content: prompt }
    ],
    temperature: 0.1
  });
  
  return JSON.parse(response.choices[0].message.content);
};

// Average time: 4-6 seconds
```

**Optimization 1: Switch to Smaller Model for Quick Scores**

```javascript
// Fast scoring (Llama 3 8B): 1-2s
export const quickScore = async (resumeText) => {
  const response = await groq.chat.completions.create({
    model: "llama-3-8b-instant",  // 8B params (10× smaller)
    messages: [
      { role: "system", content: "Fast ATS scorer" },
      { role: "user", content: `Score this resume (0-100): ${resumeText}` }
    ],
    temperature: 0.1,
    max_tokens: 50  // Only need a number
  });
  
  const score = parseInt(response.choices[0].message.content.match(/\d+/)[0]);
  return score;
};

// Detailed analysis (Llama 3.3 70B): 4-6s
export const detailedAnalysis = async (resumeText) => {
  // Original implementation
};

// Two-tier system
app.post("/upload-resume", async (req, res) => {
  const { aiText } = await extractPdfText(req.file.path);
  
  // 1. Quick score (instant feedback)
  const quickScoreResult = await quickScore(aiText);
  
  const resume = await Resume.create({
    userId,
    atsScore: quickScoreResult,
    status: "quick_scored"
  });
  
  res.json({ resumeId: resume._id, quickScore: quickScoreResult });
  
  // 2. Detailed analysis (background job)
  await analysisQueue.add({ resumeId: resume._id, aiText });
});
```

**Optimization 2: Client-Side Pre-Scoring (Instant Feedback)**

```javascript
// Frontend calculates basic score while uploading
const calculateBasicScore = (text) => {
  let score = 0;
  
  // Section check (+5 points each)
  const sections = ['Experience', 'Skills', 'Projects', 'Education'];
  sections.forEach(section => {
    if (text.toLowerCase().includes(section.toLowerCase())) score += 5;
  });
  
  // Metrics check (+1 point per metric, max 20)
  const metrics = text.match(/\d+(\.\d+)?%|\$\d+|[0-9]+ (years?|months?)/gi) || [];
  score += Math.min(metrics.length, 20);
  
  // Email check (+5)
  if (text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)) score += 5;
  
  // GitHub/LinkedIn check (+5 each)
  if (text.includes('github.com')) score += 5;
  if (text.includes('linkedin.com')) score += 5;
  
  // Penalty for pronouns (-5)
  const pronouns = text.match(/\b(I|me|my|our)\b/gi) || [];
  if (pronouns.length > 3) score -= 5;
  
  return Math.max(0, Math.min(100, score));
};

// Usage in UploadResume.jsx
const handleUpload = async (file) => {
  const text = await extractClientSideText(file);  // pdf.js in browser
  const estimatedScore = calculateBasicScore(text);
  
  setEstimatedScore(estimatedScore);  // Show immediately
  
  const result = await uploadResume(file);  // Sends to server
  setActualScore(result.atsScore);  // Update when server responds
};
```

**Optimization 3: Batch Processing for Multiple Uploads**

```javascript
// Process multiple resumes in parallel
export const batchAnalyze = async (resumeTexts) => {
  const batchPrompt = resumeTexts.map((text, idx) => 
    `RESUME ${idx + 1}:\n${text}\n---`
  ).join('\n');
  
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "Score multiple resumes" },
      { role: "user", content: `Analyze these resumes and return JSON array:\n${batchPrompt}` }
    ]
  });
  
  return JSON.parse(response.choices[0].message.content);
};

// 10 resumes: 1 API call instead of 10
// Time: 8s instead of 40s (5× faster)
// Cost: $0.008 instead of $0.08 (90% cheaper)
```

**Performance Comparison:**

| Method | Latency | Accuracy | Cost (1K resumes) |
|--------|---------|----------|-------------------|
| Current (70B) | 4-6s | 95% | $7 |
| Quick (8B) | 1-2s | 85% | $1 |
| Client-side | Instant | 60% | $0 |
| Batch (70B) | 8s / 10 resumes | 95% | $0.70 |

---

#### Q15: Your frontend makes 5 API calls on the Dashboard page. How do you reduce this?

**Current Problem:**
```javascript
// Dashboard.jsx loads 5 endpoints sequentially
useEffect(() => {
  const loadDashboard = async () => {
    const user = await getProfile();              // 150ms
    const resumes = await getResumeHistory();     // 200ms
    const stats = await getStats();               // 180ms
    const recentUploads = await getRecent();      // 150ms
    const notifications = await getNotifications(); // 120ms
    
    // Total: 800ms (sequential)
  };
  
  loadDashboard();
}, []);
```

**Solution 1: GraphQL (Single Request)**

```javascript
// BACKEND: GraphQL schema
const typeDefs = `
  type Query {
    dashboard: Dashboard
  }
  
  type Dashboard {
    user: User
    resumes: [Resume]
    stats: Stats
    recentUploads: [Resume]
    notifications: [Notification]
  }
`;

const resolvers = {
  Query: {
    dashboard: async (_, __, { userId }) => {
      // Parallel queries
      const [user, resumes, stats, recent, notifications] = await Promise.all([
        User.findById(userId),
        Resume.find({ userId }).limit(10),
        Resume.aggregate([{ $match: { userId } }, { $group: {...} }]),
        Resume.find({ userId }).sort({ createdAt: -1 }).limit(5),
        Notification.find({ userId, read: false })
      ]);
      
      return { user, resumes, stats, recent, notifications };
    }
  }
};

// FRONTEND: Single query
const DASHBOARD_QUERY = gql`
  query Dashboard {
    dashboard {
      user { name email }
      resumes { id resumeName atsScore }
      stats { totalResumes avgScore maxScore }
      recentUploads { id resumeName createdAt }
      notifications { id message createdAt }
    }
  }
`;

const { data, loading } = useQuery(DASHBOARD_QUERY);
// Time: 250ms (parallel) instead of 800ms (sequential)
```

**Solution 2: Aggregated REST Endpoint**

```javascript
// BACKEND: Create composite endpoint
app.get("/dashboard", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  
  // Run queries in parallel
  const [user, resumes, stats, recent, notifications] = await Promise.all([
    User.findById(userId).select('name email profilePicture'),
    Resume.find({ userId }).select('resumeName targetRole atsScore createdAt').limit(10),
    Resume.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $group: {
          _id: null,
          totalResumes: { $sum: 1 },
          avgScore: { $avg: '$atsScore' },
          maxScore: { $max: '$atsScore' }
        }
      }
    ]),
    Resume.find({ userId }).sort({ createdAt: -1 }).limit(5),
    Notification.find({ userId, read: false }).limit(10)
  ]);
  
  res.json({
    user,
    resumes,
    stats: stats[0] || { totalResumes: 0, avgScore: 0, maxScore: 0 },
    recent,
    notifications
  });
});

// FRONTEND: Single request
useEffect(() => {
  const loadDashboard = async () => {
    const data = await fetch('/dashboard');
    setDashboardData(data);
  };
  
  loadDashboard();