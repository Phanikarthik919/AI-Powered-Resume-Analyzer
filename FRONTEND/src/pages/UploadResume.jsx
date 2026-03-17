import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useResumeStore from "../stores/resumeStore";

const UploadResume = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const uploadResume = useResumeStore((state) => state.uploadResume);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("resumeName", data.resumeName);
    formData.append("targetRole", data.targetRole);
    formData.append("resume", data.resume[0]);

    uploadResume(formData, navigate);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-full max-w-sm p-7 rounded-2xl border border-gray-200 shadow-sm">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-8">Upload Resume</h2>

        {/* Resume Name */}
        <input
          type="text"
          placeholder="Resume name"
          {...register("resumeName", {
            required: "Resume name is required",
          })}
          className={`w-full px-3 py-2.5 mb-4 rounded-xl border bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-1 transition ${
            errors.resumeName ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-gray-400"
          }`}
        />
        {errors.resumeName && <p className="text-xs text-red-500 mb-3">{errors.resumeName.message}</p>}

        {/* Target Role */}
        <input
          type="text"
          placeholder="Target role"
          {...register("targetRole", {
            required: "Target role is required",
          })}
          className={`w-full px-3 py-2.5 mb-4 rounded-xl border bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-1 transition ${
            errors.targetRole ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-gray-400"
          }`}
        />
        {errors.targetRole && <p className="text-xs text-red-500 mb-3">{errors.targetRole.message}</p>}

        {/* Job Description */}
        <textarea
          placeholder="Paste job description (optional)"
          {...register("jobDescription")}
          className="w-full px-3 py-2.5 mb-4 rounded-xl border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 transition resize-none h-24"
        />

        {/* File Upload */}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          {...register("resume", {
            required: "Resume file is required",
          })}
          id="fileUpload"
          className="hidden"
        />

        <label
          htmlFor="fileUpload"
          className={`
    w-full flex flex-col items-center justify-center
    px-4 py-6 mb-4 rounded-2xl border-2 border-dashed
    text-center cursor-pointer transition-all duration-200

    ${errors.resume ? "border-red-400 text-red-500 bg-red-50" : "border-[#d2d2d7] bg-[#f5f5f7] text-[#6e6e73] hover:bg-[#ebebf0]"}
  `}
        >
          {/* Icon */}
          <div className="text-2xl mb-2">📄</div>

          {/* Text */}
          <p className="text-sm font-medium text-[#1d1d1f]">Choose your resume file</p>

          <p className="text-xs mt-1">PDF, DOC, DOCX</p>
        </label>

        {errors.resume && <p className="text-xs text-red-500 mb-3">{errors.resume.message}</p>}

        {/* Button */}
        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="w-[40%] py-1.5 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadResume;
