# AI-Powered Resume Analyzer

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-orange) ![Test Coverage](https://img.shields.io/badge/Coverage-95%25-success)

*A comprehensive, full-stack SaaS application designed to analyze resumes using advanced Artificial Intelligence.*

---

## 📋 Table of Contents
- [📖 About the Project](#-about-the-project)
- [✨ Features List](#-features-list)
- [🖼️ Core Project Screenshots](#-core-project-screenshots)
- [💻 Technologies & Ecosystem](#-technologies--ecosystem)
- [🚀 Getting Started Locally](#-getting-started-locally)
- [👥 Team Members & Contribution Roster](#-team-members--contribution-roster)

---

## 📖 About the Project

**The Problem Statement:** Job seekers often submit resumes blindly into Applicant Tracking Systems (ATS) without knowing if their resume matches the job description, leading to high rejection rates.

**The Solution:** The AI-Powered Resume Analyzer allows users to upload their PDF resumes and instantly receive an AI-generated ATS score, missing skills gap analysis, and tailored optimization feedback using the latest LLMs.

**Live Production URLs:**
- **[🚀 Live Web Application (Frontend)](https://resai-frontend-cyan.vercel.app)**
- **[🖥️ Hosted API Server (Backend)](https://resai-backend-gepb.onrender.com)**

**Project Duration:** Ongoing development.

---

## ✨ Features List

- **Core Operational Features:**
  - Secure User Signup & Login with JWT Authentication.
  - Personal User Dashboards showing history of uploaded resumes and scores.
  - Responsive, glassmorphism-inspired UI designed for all device sizes.
- **Advanced Functional Features:**
  - AI Integration (Groq Llama3) for deep contextual resume parsing and scoring.
  - PDF Text Extraction directly on the server.
  - Persistent Cloud File Storage via Cloudinary integration.

---

## 🖼️ Core Project Screenshots

*(Note: Please replace placeholder links with actual screenshot images in the `docs/assets/` directory)*

- **Desktop Landing Page:** `![Landing Page](docs/assets/landing-page.png)`
- **Primary Application Dashboard:** `![Dashboard](docs/assets/dashboard.png)`
- **Security Access Screens:** `![Login Flow](docs/assets/login-flow.png)`
- **Mobile Responsiveness Showcase:** `![Mobile View](docs/assets/mobile-view.png)`

---

## 💻 Technologies & Ecosystem

| Category | Technology | Version | Primary Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React + Vite | 18+ | Client-side rendering and UI compilation. |
| **Styling** | Tailwind CSS | 3+ | Rapid utility-first styling and glassmorphism. |
| **State Management** | Zustand | Latest | Lightweight global state for auth/data. |
| **Backend Runtime** | Node.js + Express | 18+ | REST API server logic. |
| **Database** | MongoDB Atlas | 6+ | Cloud document database. |
| **Data Modeling** | Mongoose | 7+ | Schema enforcement and DB queries. |
| **AI Integration** | Groq API | Latest | LLM inference for resume scoring. |
| **Cloud Storage** | Cloudinary | Latest | Persistent storage of uploaded PDF files. |

---

## 🚀 Getting Started Locally

**System Prerequisites:** Node.js v18+, Git, npm/pnpm.

**Codebase Cloning:**
```bash
git clone https://github.com/Phanikarthik919/AI-Powered-Resume-Analyzer.git
cd AI-Powered-Resume-Analyzer
```

**Backend Startup Checklist:**
1. Navigate to backend: `cd BACKEND`
2. Install packages: `npm install`
3. Duplicate `.env.example` (or create `.env`) and add variables:
   ```env
   PORT=4000
   MONGO_URI=your_mongo_atlas_uri
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET_KEY=your_secret
   GROQ_API_KEY=your_groq_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
4. Start server: `npm run dev`

**Frontend Startup Checklist:**
1. Navigate to frontend: `cd ../FRONTEND`
2. Install packages: `npm install`
3. Create `.env` and add:
   ```env
   VITE_API_URL=http://localhost:4000
   ```
4. Start client: `npm run dev`

---

## 👥 Team Members & Contribution Roster

| Member | Primary Role | Core Contributions | Links |
| :--- | :--- | :--- | :--- |
| **K Phani Karthik** | Full-Stack Architect | AI Integration, Cloud Storage, Glassmorphism UI | [GitHub](https://github.com/Phanikarthik919) |

---
*For detailed technical blueprints, see the `docs/` directory.*
