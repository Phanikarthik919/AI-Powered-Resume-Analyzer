import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
} from "../styles/common";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill in all fields.");
    setError("");
    try {
      const res = await loginUser({ email, password });
      toast.success(res.message || "Login Successful");
      login(res.payload, "true"); // Setting token to "true" string as placeholder since backend uses cookies
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)] px-4">
      <div className={formCard}>
        <h1 className={formTitle}>Welcome back</h1>

        <form onSubmit={handleSubmit}>
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={inputClass}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              className={inputClass}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className={`${errorClass} mb-4`}>{error}</p>}

          <button type="submit" className={submitBtn}>
            Sign In
          </button>
        </form>

        <p className={`${mutedText} text-center mt-5`}>
          Don't have an account?{" "}
          <Link to="/register" className={linkClass}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
