import { useState } from "react";
import {
  cardClass,
  headingClass,
  bodyText,
  primaryBtn,
  secondaryBtn,
  labelClass,
  errorClass,
} from "../styles/common";

function UploadForm({ onUpload }) {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      setFile(null);
    } else {
      setError("");
      setFile(selected);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a PDF resume.");
    onUpload?.({ file, jobDesc });
  };

  return (
    <div className={cardClass}>
      <h2 className={headingClass}>Upload Your Resume</h2>
      <p className={`${bodyText} mt-1 mb-6`}>
        Upload a PDF and optionally paste a job description for ATS scoring.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-[#6e6e73] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0066cc] file:text-white hover:file:bg-[#004499] cursor-pointer"
          />
        </div>

        <div>
          <label className={labelClass}>Job Description (optional)</label>
          <textarea
            rows={5}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full bg-white border border-[#d2d2d7] rounded-xl px-4 py-2.5 text-[#1d1d1f] text-sm placeholder:text-[#a1a1a6] focus:outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/10 transition resize-none"
          />
        </div>

        {error && <p className={errorClass}>{error}</p>}

        <div className="flex gap-3">
          <button type="submit" className={primaryBtn}>
            Analyze Resume
          </button>
          <button
            type="button"
            className={secondaryBtn}
            onClick={() => { setFile(null); setJobDesc(""); setError(""); }}
          >
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadForm;
