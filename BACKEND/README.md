# AI-Powered Resume Analyzer - Backend

This directory contains the Node.js + Express backend for the AI-Powered Resume Analyzer application. It handles secure file uploads, PDF text extraction, database connections, and communication with AI Large Language Models (Groq/Google GenAI).

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

## 🛠️ Tech Stack
- **Node.js** & **Express**
- **MongoDB** & **Mongoose**
- **JSON Web Tokens (JWT)** for Authentication
- **Multer** for multipart/form-data (File Uploads)
- **pdf-parse** for text extraction
- **Cloudinary SDK** for cloud PDF storage
- **Groq SDK** for AI prompt engineering

---
👉 **Note:** For full architectural details, API documentation, and deployment guides, please refer to the [Root README](../README.md).
