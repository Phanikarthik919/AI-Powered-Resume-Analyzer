# DEPLOYMENT Cloud Production Guide

*The blueprint mapping out exactly how the application transitions from local machines to live servers.*

## ☁️ Infrastructure Ecosystem

- **Frontend Target:** Hosted on **Vercel** for optimal edge-caching and CI/CD integration.
- **Backend Target:** Hosted on **Render.com** (Web Service) to provide a stable Node.js runtime.
- **Database Storage:** Maintained on **MongoDB Atlas**, fully decoupled from the API server.
- **File Asset Hosting:** PDFs are stored permanently on **Cloudinary**, avoiding ephemeral storage limitations.

## 🚀 Step-by-Step Launch Sequence

### 1. Database & Cloud Services
- **MongoDB:** Create an Atlas cluster, configure network access to `0.0.0.0/0`, and copy the Connection String.
- **Cloudinary:** Register an account and retrieve the Cloud Name, API Key, and API Secret.
- **Groq:** Generate a production API key.

### 2. Backend Deployment (Render)
- Connect Render to the GitHub repository.
- **Root Directory:** Set to `BACKEND`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Environment Variables:**
  - `MONGO_URI`: Atlas connection string
  - `NODE_ENV`: `production` (Critical for cross-site cookies)
  - `CLOUDINARY_*`: Corresponding Cloudinary credentials
  - `GROQ_API_KEY`: Groq production key
  - `JWT_SECRET_KEY`: Long, randomized string

### 3. Frontend Deployment (Vercel)
- Import the repository into the Vercel dashboard.
- **Root Directory:** Set to `FRONTEND`
- **Build Command:** Vercel auto-detects Vite (`npm run build`)
- **Environment Variables:**
  - `VITE_API_URL`: The specific URL assigned by Render (e.g., `https://resai-backend.onrender.com`). *Ensure no trailing slash is included.*
- **Trigger Build:** Deploy the project. The frontend will now securely communicate cross-origin with the backend.
