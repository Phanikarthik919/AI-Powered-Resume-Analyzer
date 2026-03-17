import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore.js";

const Navbar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const linkStyle = "text-sm font-medium transition px-3 py-1.5 rounded-lg";

  const activeStyle = "bg-black text-white";
  const inactiveStyle = "text-gray-600 hover:text-black hover:bg-gray-100";

  return (
    <nav className="bg-white border-b border-gray-200 px-10 py-4 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">AI Resume Analyzer</h1>

      <div className="flex gap-15 mr-10">
        {/* Links */}
        <div className="flex items-center gap-3">
          <NavLink to="/" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`}>
            Home
          </NavLink>

          <NavLink to="/dashboard" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`}>
            Dashboard
          </NavLink>

          <NavLink to="/profile" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`}>
            Profile
          </NavLink>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-3 py-1.5  rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
