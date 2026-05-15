# AI-Powered Resume Analyzer - Frontend Documentation

![React](https://img.shields.io/badge/React-18.0-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-latest-purple?logo=vite) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-latest-38B2AC?logo=tailwind-css) ![Zustand](https://img.shields.io/badge/State-Zustand-brown)

This directory contains the React-based User Interface for the **AI-Powered Resume Analyzer**. It is engineered for maximum performance using Vite, features a modern glassmorphism design system, and leverages Zustand for lightweight global state management.

**[🚀 Live Production Application](https://resai-frontend-cyan.vercel.app)**

---

## 🏗️ Frontend Architecture

The source code is organized within the `src` directory to ensure a clear separation of concerns, making the codebase highly maintainable and scalable.

```text
FRONTEND/src/
├── components/       # Reusable UI elements
│   ├── BackgroundDecoration.jsx # Ambient animated floating background
│   ├── UserProfile.jsx          # Secure dropdown navigation
│   ├── Footer.jsx               # Global footer
│   └── ...
├── pages/            # Main route views
│   ├── Home.jsx                 # Landing page & features overview
│   ├── Dashboard.jsx            # Protected: User's parsed resume history
│   ├── Upload.jsx               # Protected: PDF submission interface
│   └── Auth/                    # Login & Registration flows
├── services/         # API integration layer
│   └── api.js                   # Axios instance with centralized error interceptors
├── store/            # Global State Management
│   └── authStore.js             # Zustand store for user session data
├── styles/           # Global styles and design tokens
│   ├── index.css                # Tailwind imports & custom animations (glassmorphism)
│   └── common.js                # Shared utility classes
├── App.jsx           # Root component & Route definitions
└── main.jsx          # React DOM mounting
```

---

## 🎨 Design System & Styling

The application relies on **Tailwind CSS** as its primary styling engine, but is heavily augmented with custom utility classes defined in `index.css` to achieve a premium, modern SaaS aesthetic.

- **Glassmorphism:** Widespread use of `backdrop-blur-md` combined with semi-transparent backgrounds to create depth.
- **Animations:** Custom CSS keyframes (`float`, `float-delayed`, `fadeInUp`) are used to create dynamic, living backgrounds and smooth component mounting.
- **Micro-interactions:** Interactive elements utilize `hover-lift` and `hover-glow` classes to improve user engagement and tactile feedback.

---

## 🛣️ Routing Strategy

Routing is handled by `react-router-dom`. The application enforces strict route protection to ensure sensitive data is not leaked.

| Route | Component | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/` | `Home` | Public | Landing page explaining the core value proposition. |
| `/login` | `Login` | Public | User authentication endpoint. |
| `/register`| `Register` | Public | New account creation. |
| `/dashboard`| `Dashboard`| **Protected** | Shows historical ATS scores and parsed resumes. |
| `/upload` | `Upload` | **Protected** | Multipart form to submit PDF resumes to the AI. |

*Protected routes automatically verify the JWT session via the Axios interceptor and redirect unauthorized users to `/login`.*

---

## 📡 State Management & API

### Zustand (State)
Instead of relying on heavy Redux boilerplate, this application uses **Zustand**. 
- `authStore.js` manages the global user session, holding the currently authenticated user's details and a boolean `isAuthenticated` flag. This allows the Navbar and Protected Routes to instantly react to login/logout events.

### Axios (Network)
All network requests to the Express backend are centralized in `src/services/api.js`.
- **Credentials:** Configured with `withCredentials: true` to automatically send and receive HTTP-Only cookies (bypassing localstorage security risks).
- **Interceptors:** Features a global response interceptor that catches backend errors (e.g., `401 Unauthorized`) and formats them cleanly for the UI components to display as toasts/alerts.

---

## 💻 Developer Setup & Scripts

To contribute to or run the frontend locally:

### 1. Environment Configuration
Create a `.env` file in the `FRONTEND` root directory. The only required variable is the backend API URL:
```env
# Local Development
VITE_API_URL=http://localhost:4000

# Production (For reference, configured in Vercel Dashboard)
# VITE_API_URL=https://resai-backend-gepb.onrender.com
```

### 2. Available Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Installs all required React and Vite dependencies. |
| `npm run dev` | Starts the Vite hot-reloading development server on port `5173`. |
| `npm run build` | Compiles the React application into static files inside `/dist` for production. |
| `npm run preview` | Boots up a local web server to test the production build locally. |
| `npm run lint` | Runs ESLint to identify code quality issues. |

---
👉 **Note:** This documentation covers the UI layer. For backend architecture, database schemas, and AI integration details, please refer to the [Root README](../README.md).
