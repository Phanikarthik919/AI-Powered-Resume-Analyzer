import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getProfile, updateProfile, changePassword } from "../services/api";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import {
  pageWrapper,
  headingClass,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  successClass,
  loadingClass,
  divider,
  subHeadingClass,
  bodyText
} from "../styles/common";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const updateUser = useAuthStore((state) => state.updateUser);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors }
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors }
  } = useForm();

  const newPassword = watch("newPassword");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      setProfile(res.payload);
      resetProfile({
        name: res.payload.name,
        email: res.payload.email
      });
    } catch (err) {
      toast.error(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const onUpdateProfile = async (data) => {
    try {
      setUpdatingProfile(true);
      const res = await updateProfile(data);
      setProfile(res.payload);
      updateUser(res.payload);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const onChangePassword = async (data) => {
    try {
      setChangingPassword(true);
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });
      toast.success("Password changed successfully");
      resetPassword();
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className={pageWrapper}>
        <p className={loadingClass}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={pageWrapper}>
      <h1 className={`${headingClass} mb-8`}>User Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Info Section */}
        <div className={formCard}>
          <h2 className={formTitle}>Edit Profile</h2>
          <form onSubmit={handleSubmitProfile(onUpdateProfile)}>
            <div className={formGroup}>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Your Name"
                {...registerProfile("name", { required: "Name is required" })}
              />
              {profileErrors.name && (
                <p className="text-[#cc2f26] text-xs mt-1">{profileErrors.name.message}</p>
              )}
            </div>

            <div className={formGroup}>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                className={inputClass}
                placeholder="your.email@example.com"
                {...registerProfile("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {profileErrors.email && (
                <p className="text-[#cc2f26] text-xs mt-1">{profileErrors.email.message}</p>
              )}
            </div>

            <button type="submit" className={submitBtn} disabled={updatingProfile}>
              {updatingProfile ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* Change Password Section */}
        <div className={formCard}>
          <h2 className={formTitle}>Change Password</h2>
          <form onSubmit={handleSubmitPassword(onChangePassword)}>
            <div className={formGroup}>
              <label className={labelClass}>Old Password</label>
              <input
                type="password"
                className={inputClass}
                placeholder="••••••••"
                {...registerPassword("oldPassword", { required: "Old password is required" })}
              />
              {passwordErrors.oldPassword && (
                <p className="text-[#cc2f26] text-xs mt-1">{passwordErrors.oldPassword.message}</p>
              )}
            </div>

            <div className={formGroup}>
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                className={inputClass}
                placeholder="••••••••"
                {...registerPassword("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
                })}
              />
              {passwordErrors.newPassword && (
                <p className="text-[#cc2f26] text-xs mt-1">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            <div className={formGroup}>
              <label className={labelClass}>Confirm New Password</label>
              <input
                type="password"
                className={inputClass}
                placeholder="••••••••"
                {...registerPassword("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === newPassword || "Passwords do not match"
                })}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-[#cc2f26] text-xs mt-1">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>

            <button type="submit" className={submitBtn} disabled={changingPassword}>
              {changingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>

      <div className={divider}></div>

      <div className="bg-[#f5f5f7] rounded-2xl p-8">
        <h3 className={subHeadingClass}>Account Information</h3>
        <p className={`${bodyText} mt-2`}>
          Member since: {new Date(profile.createdAt || Date.now()).toLocaleDateString()}
        </p>
        <p className={`${bodyText} mt-1`}>
          User ID: {profile._id}
        </p>
      </div>
    </div>
  );
}

export default Profile;
