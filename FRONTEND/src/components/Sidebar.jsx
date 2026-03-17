import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-linear-to-b from-blue-700 to-blue-500 text-white flex flex-col">

      <div className="flex items-center gap-2 px-6 py-4 text-xl font-semibold border-b border-blue-400">
        ☁️Resume Analyzer
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">

        <Link to="/" className="block px-4 py-2 rounded bg-blue-600">
          Dashboard
        </Link>

        <Link to="/upload" className="block px-4 py-2 rounded hover:bg-blue-600">
          Upload Resume
        </Link>

        <Link to="/history" className="block px-4 py-2 rounded hover:bg-blue-600">
          Resume History
        </Link>

        <Link to="/profile" className="block px-4 py-2 rounded hover:bg-blue-600">
          Profile
        </Link>

      </nav>

      <div className="px-6 py-4 border-t border-blue-400">
        Logout
      </div>

    </div>
  );
}

export default Sidebar;