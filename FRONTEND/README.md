# FRONTEND UI Blueprint

*Written specifically for the developers building and maintaining the user interface.*

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in this directory and add the backend URL:
   ```env
   VITE_API_URL=http://localhost:4000
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🎨 Architecture & Styling Principles

- **Framework Specifications:** Built on React 18, utilizing Vite for lightning-fast compilation, hot-module replacement (HMR), and optimized production bundling.
- **Global Layout Theme Rules:** 
  - **Styling Engine:** Tailwind CSS is used universally.
  - **Aesthetic:** A "glassmorphism" design system is implemented via `backdrop-blur` utilities and semi-transparent backgrounds.
  - **Animations:** Custom keyframes (`float`, `fadeInUp`, `hover-lift`) defined in `src/index.css` provide micro-interactions.

## 📂 Client Directory Map

```text
src/
├── components/       # Reusable user components (Navbar, Footer, BackgroundDecoration)
├── pages/            # Core structural layouts (Home, Dashboard, Upload, Auth)
├── services/         # Axios network logic (api.js)
├── store/            # Zustand global state managers (authStore.js)
├── styles/           # Global utility sheets (index.css, common.js)
└── App.jsx           # Application entry point and router wrapper
```

## 🧩 User Interface Component Breakdowns

- **Global Common Elements:** 
  - `Navbar.jsx`: Features the `UserProfile.jsx` dropdown for authenticated states.
  - `Footer.jsx`: Global status footer.
  - `BackgroundDecoration.jsx`: Animated floating documents.
- **Page View Collections:**
  - `Home.jsx`: Landing page overview.
  - `Upload.jsx`: Core application workspace for PDF submission.
  - `Dashboard.jsx`: Data table/feed displaying historical resume scores.

## 🗂️ Client-Side State Management

- **Global Stores Definition:** 
  We utilize **Zustand** instead of Redux for lightweight state management.
  - `authStore.js`: Tracks `isAuthenticated` and `user` data. This synchronized state allows the Navbar, Router, and forms to instantly react to session changes without props-drilling.

## 🛣️ Application Routing Map

- **Public Routing Paths:** `/` (Home), `/login` (Login), `/register` (Signup).
- **Protected Security Routing Paths:** `/upload`, `/dashboard`. Unauthorized traffic to these routes is intercepted and redirected back to `/login`.

## 🌐 API Network Integration

- **Network Request Patterns:** 
  All API communication occurs via the centralized `services/api.js` Axios instance. 
  - **Credentials:** `withCredentials: true` is strictly enforced to automatically append secure HTTP-Only JWT tokens to every request.
- **UI Screen States Visuals:** *(Placeholder: Insert screenshots of validation warnings, loading spinners, etc.)*
