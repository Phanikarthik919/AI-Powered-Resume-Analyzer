import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import toast from "react-hot-toast";
import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  secondaryBtn,
  mutedText,
  linkClass,
  errorClass,
} from "../styles/common";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return setError("Please fill in all fields.");
    setError("");
    setLoading(true);
    try {
      const res = await registerUser({ name, email, password });
      toast.success(res.message || "Registration Successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed");
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)] px-4 py-10">
      <div className={formCard}>
        <h2 className={formTitle}>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className={formGroup}>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className={`${errorClass} mb-4`}>{error}</p>}

          <button type="submit" className={submitBtn} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-1 border-[#e8e8ed]" />
          <span className="px-3 text-[#a1a1a6] text-xs font-medium tracking-wide">OR</span>
          <hr className="flex-1 border-[#e8e8ed]" />
        </div>

        <button className={`${secondaryBtn} w-full flex items-center justify-center gap-2 mb-3 !py-2.5`}>
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="google"
            className="w-4 h-4"
          />
          Sign up with Google
        </button>

        <button className={`${secondaryBtn} w-full flex items-center justify-center gap-2 !py-2.5`}>
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
            alt="linkedin"
            className="w-4 h-4"
          />
          Sign up with LinkedIn
        </button>

        <p className={`${mutedText} text-center mt-6`}>
          Already have an account?{" "}
          <Link to="/login" className={linkClass}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;