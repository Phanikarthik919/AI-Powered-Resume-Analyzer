import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import UserProfile from "./UserProfile";
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  primaryBtn,
} from "../styles/common";

function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>
        <Link to="/" className={`${navBrandClass} flex items-center gap-2 text-lg`}>
          <span className="text-xl">☁️</span> ResumeAI
        </Link>

        <div className={navLinksClass}>
          <Link to="/" className={navLinkClass}>
            Home
          </Link>
          {user && (
            <>
              <Link to="/dashboard" className={navLinkClass}>
                Dashboard
              </Link>
              <Link to="/upload" className={navLinkClass}>
                Upload
              </Link>
              <Link to="/history" className={navLinkClass}>
                History
              </Link>
            </>
          )}

          <div className="h-4 w-px bg-[#e8e8ed] mx-2 hidden sm:block" />

          {user ? (
            <UserProfile />
          ) : (
            <button 
              className={primaryBtn} 
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
