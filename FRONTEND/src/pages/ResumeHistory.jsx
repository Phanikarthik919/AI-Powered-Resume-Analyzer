import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getResumeHistory } from "../services/api";
import useResumeStore from "../store/resumeStore";
import {
  pageWrapper,
  pageTitleClass,
  cardClass,
  primaryBtn,
  loadingClass,
  errorClass
} from "../styles/common";

function ResumeHistory() {
  const navigate = useNavigate();
  const { resumes, setResumes, loading, setLoading, error, setError } = useResumeStore();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await getResumeHistory();
        setResumes(res.payload || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch resume history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [getResumeHistory, setResumes, setLoading, setError]);

  return (
    <div className={pageWrapper}>
      <h1 className={`${pageTitleClass} mb-8`}>Resume History</h1>

      {loading && <p className={loadingClass}>Loading history...</p>}
      {error && <p className={errorClass}>{error}</p>}

      {!loading && !error && (
        <div className={`${cardClass} !p-0 overflow-hidden`}>
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#e8e8ed] text-[#1d1d1f]">
              <tr>
                <th className="p-4 font-semibold text-sm">Resume Name</th>
                <th className="p-4 font-semibold text-sm">Job Role</th>
                <th className="p-4 font-semibold text-sm">ATS Score</th>
                <th className="p-4 font-semibold text-sm">Date</th>
                <th className="p-4 font-semibold text-sm text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8ed]">
              {resumes.length > 0 ? (
                resumes.map((resume) => (
                  <tr key={resume._id} className="hover:bg-[#ebebf0] transition-colors">
                    <td className="p-4 text-sm font-medium text-[#1d1d1f]">{resume.resumeName}</td>
                    <td className="p-4 text-sm text-[#6e6e73]">{resume.targetRole}</td>
                    <td className="p-4">
                      <span className={`${resume.atsScore >= 80 ? "text-[#34c759]" : resume.atsScore >= 55 ? "text-[#ff9f0a]" : "text-[#ff3b30]"} font-bold`}>
                        {resume.atsScore}%
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[#a1a1a6]">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        className={primaryBtn}
                        onClick={() => navigate(`/analysis/${resume._id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-[#a1a1a6] text-sm">
                    No resumes found. Upload one to start!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ResumeHistory;