# AI-Powered Resume Analyzer

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-orange)

A comprehensive, full-stack SaaS application designed to analyze resumes using advanced Artificial Intelligence. This tool provides job seekers with automated parsing, skill matching, keyword optimization suggestions, and comprehensive ATS score generation to help them land their dream jobs.

**[🚀 Live Demo](https://resai-frontend-cyan.vercel.app)** | **[🖥️ Backend API](https://resai-backend-gepb.onrender.com)**

---

## 2. Key Features

- **🧠 AI-based Resume Parsing:** Extracts structured data, contact info, and experience from raw PDF resumes.
- **🎯 Skill Matching & Analysis:** Compares user skills against industry standards or specific job descriptions.
- **📈 Keyword Optimization:** Suggests relevant, missing keywords to improve ATS (Applicant Tracking System) pass rates.
- **📊 Score Generation:** Provides a comprehensive resume score out of 100 with actionable feedback.
- **🔐 Secure User Accounts:** JWT-based authentication for saving and tracking multiple resume versions over time.
- **☁️ Cloud Storage:** Integration with Cloudinary for seamless document management.
- **✨ Professional UI:** Glassmorphism design system, smooth micro-animations, and responsive layout.

---

## 3. Tech Stack

- **Frontend:** React, Vite, Tailwind CSS (via custom utilities), Zustand (State Management), React Router
- **Backend:** Node.js, Express.js, JWT Authentication, Multer (File Uploads)
- **Database:** MongoDB Atlas, Mongoose
- **AI & APIs:** Groq API (Llama3 model), pdf-parse, Cloudinary SDK
- **DevOps/Tools:** Vercel (Frontend Hosting), Render (Backend Hosting), Git

---

## 4. Getting Started (Installation)

Follow these steps to set up the project locally.

### Prerequisites
- **Node.js** v18+
- **npm** or **pnpm**
- **MongoDB** Local instance or Atlas URI
- API Keys for **Groq** and **Cloudinary**

### Clone the Repo
```bash
git clone https://github.com/Phanikarthik919/AI-Powered-Resume-Analyzer.git
cd AI-Powered-Resume-Analyzer
```

### Install Dependencies & Environment Variables

**Backend Setup:**
```bash
cd BACKEND
npm install
```
Create a `.env` file in the `BACKEND` folder:
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

**Frontend Setup:**
```bash
cd ../FRONTEND
npm install
```
Create a `.env` file in the `FRONTEND` folder:
```env
VITE_API_URL=http://localhost:4000
```

### Run Locally
Open two terminal windows:

Terminal 1 (Backend):
```bash
cd BACKEND
npm run dev
```

Terminal 2 (Frontend):
```bash
cd FRONTEND
npm run dev
```

---

## 5. System Architecture

### Project Structure
```text
AI-Powered-Resume-Analyzer/
├── FRONTEND/           # React SPA
│   ├── src/
│   │   ├── components/ # Reusable UI components (Navbar, UserProfile, Footer)
│   │   ├── pages/      # Route pages (Home, Dashboard, Upload)
│   │   ├── services/   # Axios API configurations
│   │   └── store/      # Zustand global state
├── BACKEND/            # Node.js REST API
│   ├── APIs/           # Route controllers (UserAPI, CommonAPI)
│   ├── config/         # Database and Cloudinary config
│   ├── middlewares/    # JWT verification and Multer setup
│   ├── models/         # Mongoose Schemas (User, Resume)
│   └── services/       # AI parsing and PDF extraction logic
└── README.md
```

### Data Flow
1. **Client Request:** The user submits a PDF resume via the React frontend.
2. **File Processing:** The Express backend receives the file, uses `multer` to temporarily store it, and `pdf-parse` to extract the raw text.
3. **Cloud Storage:** The PDF is simultaneously uploaded to Cloudinary for persistent storage.
4. **AI Analysis:** The extracted text is sent to the Groq API (LLM) alongside a prompt to calculate the ATS score and extract missing skills.
5. **Database Persistence:** The Cloudinary URL, structured AI response, and user ID are saved to MongoDB.
6. **Client Response:** The JSON analysis is returned to the frontend and rendered dynamically using Zustand state.

### Database Schema (Simplified)
- **User Collection:** `_id`, `name`, `email`, `password` (hashed).
- **Resume Collection:** `_id`, `userId` (ref: User), `resumeName`, `targetRole`, `atsScore`, `missingSkills`, `fileUrl`, `parsedData`.

---

## 6. API Documentation

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/common-api/login` | Authenticate user and receive HTTP-Only JWT Cookie | No |
| `POST` | `/user-api/register` | Create a new user account | No |
| `POST` | `/user-api/upload-resume`| Uploads PDF, parses text, and returns AI analysis | Yes |
| `GET` | `/user-api/user-resumes` | Fetch all previously analyzed resumes for the user | Yes |
| `GET` | `/user-api/resume/:id` | Fetch specific resume analysis by ID | Yes |
| `POST` | `/user-api/optimize-section`| AI optimization for specific resume sections | Yes |

---

## 7. Deployment Guide

This project is configured for cloud deployment using Vercel (Frontend) and Render (Backend).

### Backend (Render)
- **Hosting Provider:** Render.com (Web Service)
- **Root Directory:** `BACKEND`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Environment Config:** Ensure `NODE_ENV=production` is set to correctly configure cross-site cookies, and `MONGO_URI` is set to an Atlas Cluster.

### Frontend (Vercel)
- **Hosting Provider:** Vercel
- **Root Directory:** `FRONTEND`
- **Build Command:** `npm run build`
- **Environment Config:** Set `VITE_API_URL` to the live Render backend URL.

---

## 8. Contribution & License

**How to Contribute:**
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.


