import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import ResumeHistory from "./pages/ResumeHistory";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import Profile from "./pages/Profile";
import ResumeBuilder from "./pages/ResumeBuilder";

// Define the router OUTSIDE the component so it doesn't get recreated on re-renders.
// This is what caused the "giving errors" issue with createBrowserRouter!
const routerObj = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/upload",
        element: <UploadResume />
      },
      {
        path: "/history",
        element: <ResumeHistory />
      },
      {
        path: "/analysis/:id",
        element: <ResumeAnalysis />
      },
      {
        path: "/resume-builder/:id",
        element: <ResumeBuilder />
      },
      {
        path: "/profile",
        element: <Profile />
      }
    ]
  }
]);

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>
  );
}

export default App;