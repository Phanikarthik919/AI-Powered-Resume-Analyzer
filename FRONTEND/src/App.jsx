import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./stores/authStore.js";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ResumeDetails from "./pages/ResumeDetails";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import RootLayout from "./components/RootLayout";
import { Toaster } from "react-hot-toast";
import UploadResume from "./pages/UploadResume.jsx";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "upload-resume", element: <UploadResume /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "resume/:id", element: <ResumeDetails /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);

function App() {
  const getProfile = useAuthStore((state) => state.getProfile);

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <RouterProvider router={router} />

      {/* Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
