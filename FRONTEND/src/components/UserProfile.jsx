import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { logoutUser } from "../services/api";
import { glassPanel, mutedText, linkClass } from "../styles/common";

function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout API failed", err);
    }
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 rounded-full hover:bg-[#f5f5f7] transition-all duration-300 group"
      >
        <div className="w-8 h-8 rounded-full bg-[#0066cc]/10 flex items-center justify-center border border-[#0066cc]/20 overflow-hidden group-hover:border-[#0066cc]/40 transition-all">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-[#0066cc] uppercase">
              {user.name.charAt(0)}
            </span>
          )}
        </div>
        <span className="text-sm font-medium text-[#1d1d1f] hidden lg:block group-hover:text-[#0066cc] transition-colors">
          {user.name}
        </span>
        <svg
          className={`w-4 h-4 text-[#a1a1a6] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`${glassPanel} absolute right-0 mt-2 w-56 rounded-2xl p-2 py-3 overflow-hidden animate-in fade-in zoom-in duration-200 z-50`}>
          <div className="px-4 py-2 mb-2 border-b border-[#e8e8ed]">
            <p className="text-xs font-bold text-[#1d1d1f] truncate">{user.name}</p>
            <p className={`${mutedText} text-[10px] truncate`}>{user.email}</p>
          </div>

          <div className="flex flex-col gap-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[#6e6e73] hover:bg-[#0066cc]/5 hover:text-[#0066cc] rounded-xl transition-all"
            >
              <span className="text-lg">👤</span> Profile Settings
            </Link>
            <Link
              to="/history"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[#6e6e73] hover:bg-[#0066cc]/5 hover:text-[#0066cc] rounded-xl transition-all"
            >
              <span className="text-lg">📜</span> Resume History
            </Link>
          </div>

          <div className="mt-2 pt-2 border-t border-[#e8e8ed]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#ff3b30] hover:bg-[#ff3b30]/5 rounded-xl transition-all font-medium"
            >
              <span className="text-lg">📤</span> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
