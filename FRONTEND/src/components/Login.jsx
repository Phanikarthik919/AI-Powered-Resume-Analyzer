import { Link } from "react-router-dom";
function Login() {
  return (
    <div className="flex justify-center items-center h-full">

      <div className="bg-white p-8 rounded shadow-md w-105">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-blue-600 text-3xl mb-2">👤</div>
          <h2 className="text-2xl font-semibold text-blue-700">
            ResumeAI
          </h2>
        </div>

        {/* Email */}
        <label className="text-sm text-gray-600">Email</label>
        <input
          type="email"
          placeholder="Enter email"
          className="w-full border rounded px-3 py-2 mt-1 mb-4 bg-gray-100"
        />

        {/* Password */}
        <label className="text-sm text-gray-600">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          className="w-full border rounded px-3 py-2 mt-1 mb-4 bg-gray-100"
        />

        {/* Login button */}
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4">
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center mb-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Login */}
        <button className="w-full flex items-center justify-center gap-2 border py-2 rounded mb-3 hover:bg-gray-50">
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* LinkedIn Login */}
        <button className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-50">
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
            alt="linkedin"
            className="w-5 h-5"
          />
          Continue with LinkedIn
        </button>

        {/* Register
        <p className="text-center text-sm text-blue-600 mt-5">
          Don't have an account? Register here
        </p> */}
        <p className="text-center text-sm text-blue-600 mt-5">
  Don't have an account? 
  <Link to="/register" className="font-semibold ml-1">
    Register here
  </Link>
</p>

      </div>

    </div>
  )
}

export default Login