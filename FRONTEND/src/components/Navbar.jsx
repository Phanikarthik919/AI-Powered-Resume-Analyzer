import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { logoutUser } from "../services/api";
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
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout API failed", err);
    }
    logout();
    navigate("/login");
  };

  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>
        <Link to="/" className={navBrandClass}>
          ☁️ ResumeAI
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
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 group">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <span className="text-xl">👤</span>
                )}
                <span className="text-sm font-medium text-[#1d1d1f] hidden sm:block group-hover:text-[#0066cc] transition-colors">
                  {user.name}
                </span>
              </Link>
              <button
                className={`${primaryBtn} !bg-[#ff3b30] hover:!bg-[#cc2f26]`}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <button className={primaryBtn} onClick={() => navigate("/login")}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
