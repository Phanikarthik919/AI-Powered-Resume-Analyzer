import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../services/api";
import useResumeStore from "../store/resumeStore";
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
  mutedText,
  primaryBtn,
  errorClass,
  successClass,
  loadingClass
} from "../styles/common";

function UploadResume() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const [dragging, setDragging] = useState(false);
  const { loading, setLoading, addResume } = useResumeStore();
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileRef = useRef(null);

  const selectedResume = watch("resume");
  const fileName = selectedResume && selectedResume.length > 0 ? selectedResume[0].name : null;

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (files[0].type !== "application/pdf") {
        setMessage({ type: "error", text: "Only PDF files are accepted." });
        return;
      }
      setValue("resume", files, { shouldValidate: true });
      setMessage({ type: "", text: "" });
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!data.resume || data.resume.length === 0) {
        setMessage({ type: "error", text: "Please upload a resume." });
        toast.error("Please upload a resume.");
        return;
      }

      setLoading(true);
      setMessage({ type: "", text: "" });

      const res = await uploadResume(data.resume[0], data.resumeName, data.targetRole, data.jobDescription || "");

      console.log(res);
      
      if (res.resume) {
        addResume(res.resume);
      }

      setMessage({ type: "success", text: "Resume uploaded successfully!" });
      toast.success("Resume uploaded and analyzed!");
      reset();

      // Navigate to the analysis results page
      if (res.resume && res.resume._id) {
        navigate(`/analysis/${res.resume._id}`);
      }

    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Upload failed. Please try again." });
      toast.error(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={pageWrapper}>
      <h1 className={`${headingClass} mb-8`}>
        Upload Resume
      </h1>

      <div className="bg-[#f5f5f7] rounded-2xl p-10 max-w-2xl mx-auto">
        <h2 className={formTitle}>
          Begin Analysis
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className={formGroup}>
            <label className={labelClass}>Resume Name</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. My Frontend Resume 2024"
              {...register("resumeName", { required: "Resume Name is required" })}
            />
            {errors.resumeName && <p className="text-[#cc2f26] text-xs mt-1">{errors.resumeName.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Target Job Role</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Frontend Developer"
              {...register("targetRole", { required: "Target Role is required" })}
            />
            {errors.targetRole && <p className="text-[#cc2f26] text-xs mt-1">{errors.targetRole.message}</p>}
          </div>

          {/* Job Description — optional */}
          <div className={formGroup}>
            <label className={labelClass}>
              Job Description
              <span className="ml-1.5 text-[#a1a1a6] font-normal normal-case">(optional — paste for a more accurate ATS score)</span>
            </label>
            <textarea
              className={`${inputClass} resize-none leading-relaxed`}
              rows={5}
              placeholder={`Paste the job description here…\n\nExample:\n• 3+ years of React experience\n• Proficiency in Node.js and REST APIs\n• Experience with AWS or cloud services`}
              {...register("jobDescription")}
            />
            <p className="text-[10px] text-[#a1a1a6] mt-1">
              💡 When provided, the AI compares your resume directly against the JD keywords — just like Jobscan.
            </p>
          </div>

          <label className={labelClass}>Resume File (PDF)</label>

          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`
              border-2 border-dashed rounded-2xl p-10 text-center mb-2 transition-colors duration-200 cursor-pointer
              ${dragging ? "border-[#0066cc] bg-[#0066cc]/5" : "border-[#d2d2d7] bg-[#f5f5f7] hover:bg-[#ebebf0]"}
            `}
          >
            <div className="text-4xl mb-3">📄</div>

            {fileName ? (
              <>
                <p className="font-semibold text-[#1d1d1f] text-sm">{fileName}</p>
                <p className={`${mutedText} mt-1 mb-4`}>Click to replace</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-[#1d1d1f] text-sm">
                  Drag & drop your resume here
                </p>
                <p className={`${mutedText} mt-1 mb-4`}>or click to browse — PDF only</p>
              </>
            )}

            <button type="button" className={primaryBtn} onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
              Browse Files
            </button>
          </div>

          {/* Hidden File Input registered with react-hook-form */}
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            {...register("resume", { required: "Resume file is required" })}
            ref={(e) => {
              register("resume").ref(e);
              fileRef.current = e;
            }}
          />
          {errors.resume && <p className="text-[#cc2f26] text-xs mt-1">{errors.resume.message}</p>}

          <div className="mb-6 mt-4">
            {message.text && (
              <div className={message.type === "error" ? errorClass : successClass}>
                {message.text}
              </div>
            )}
          </div>

          {loading && <p className={`${loadingClass} mb-4`}>Uploading & Analyzing...</p>}

          <button type="submit" className={submitBtn} disabled={loading}>
            {loading ? "Uploading..." : "Upload Resume"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default UploadResume;