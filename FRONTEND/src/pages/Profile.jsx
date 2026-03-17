import useAuthStore from "../stores/authStore";
import useResumeStore from "../stores/resumeStore";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api/axios";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const { resumes, getResumes } = useResumeStore();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    getResumes(); // fetch resume history
  }, []);

  // 📊 Stats
  const totalResumes = resumes.length;
  const avgScore = resumes.length > 0 ? Math.round(resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0) / resumes.length) : 0;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const onSubmit = async (data) => {
    try {
      await API.post(
        "/user-api/change-password",
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        { withCredentials: true },
      );

      toast.success("Password updated successfully");
      setShowPassword(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* USER INFO */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-700">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#1d1d1f]">{user?.name}</h2>
              <p className="text-sm text-[#6e6e73]">{user?.email}</p>
            </div>
          </div>

          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 cursor-pointer">
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Total Resumes</p>
            <h3 className="text-2xl font-semibold text-[#1d1d1f] mt-1">{totalResumes}</h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Average ATS Score</p>
            <h3 className="text-2xl font-semibold text-[#1d1d1f] mt-1">{avgScore}</h3>
          </div>
        </div>

        {/* CHANGE PASSWORD (COLLAPSIBLE) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Security</h3>

            <button onClick={() => setShowPassword(!showPassword)} className="text-sm text-blue-600 hover:underline">
              {showPassword ? "Close" : "Change Password"}
            </button>
          </div>

          {showPassword && (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
              {/* Current */}
              <input
                type="password"
                placeholder="Current password"
                {...register("currentPassword", { required: "Required" })}
                className={`w-full px-3 py-2.5 mb-3 rounded-xl border bg-gray-50 text-sm ${
                  errors.currentPassword ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.currentPassword && <p className="text-xs text-red-500 mb-3">{errors.currentPassword.message}</p>}

              {/* New */}
              <input
                type="password"
                placeholder="New password"
                {...register("newPassword", { required: "Required" })}
                className={`w-full px-3 py-2.5 mb-3 rounded-xl border bg-gray-50 text-sm ${
                  errors.newPassword ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.newPassword && <p className="text-xs text-red-500 mb-3">{errors.newPassword.message}</p>}

              {/* Confirm */}
              <input
                type="password"
                placeholder="Confirm password"
                {...register("confirmPassword", {
                  required: "Required",
                  validate: (value) => value === watch("newPassword") || "Passwords do not match",
                })}
                className={`w-full px-3 py-2.5 mb-4 rounded-xl border bg-gray-50 text-sm ${
                  errors.confirmPassword ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mb-4">{errors.confirmPassword.message}</p>}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:opacity-90 transition cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
