import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../stores/authStore.js";
import toast from "react-hot-toast";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success("Welcome back");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-full max-w-sm p-7 rounded-2xl border border-gray-200 shadow-sm">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-8">Sign in</h2>

        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
          className={`w-full px-3 py-2.5 mb-4 rounded-xl border bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-1 transition ${
            errors.email ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-gray-400"
          }`}
        />

        {errors.email && <p className="text-xs text-red-500 mb-3">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          className={`w-full px-3 py-2.5 mb-4 rounded-xl border bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-1 transition ${
            errors.password ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-gray-400"
          }`}
        />

        {errors.password && <p className="text-xs text-red-500 mb-4">{errors.password.message}</p>}

        {/* Button */}
        <div className="w-full flex justify-center items-center">
          <button
            type="submit"
            className="w-[40%] py-1 bg-blue-600 text-white rounded-2xl font-medium hover:opacity-90 transition cursor-pointer"
          >
            Login
          </button>
        </div>

        {/* Link */}
        <p className="text-sm text-center mt-6 text-gray-500">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
