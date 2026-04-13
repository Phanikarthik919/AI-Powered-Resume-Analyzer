import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/authStore.js";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useAuthStore();

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          {/* Text */}
          <p className="text-gray-600 text-sm font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
