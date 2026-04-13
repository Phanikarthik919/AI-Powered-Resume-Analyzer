import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useResumeStore from "../stores/resumeStore";

const Dashboard = () => {
  const { resumes, getResumes, loading } = useResumeStore();
  const navigate = useNavigate();

  useEffect(() => {
    getResumes();
  }, []);

  const getScoreStyle = (score) => {
    if (score >= 75) return "bg-green-100 text-green-600";
    if (score >= 50) return "bg-yellow-100 text-yellow-600";
    return "bg-red-100 text-red-600";
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-6 py-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">Your Resumes</h1>

        {resumes.length !== 0 && (
          <button
            onClick={() => navigate("/upload-resume")}
            className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:opacity-90 transition shadow-sm cursor-pointer"
          >
            Upload Resume
          </button>
        )}
      </div>

      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="text-center text-sm text-gray-500">Loading resumes...</div>
        ) : resumes.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-[#6e6e73] mb-4">No resumes uploaded yet</p>

            <button
              onClick={() => navigate("/upload-resume")}
              className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:opacity-90 transition cursor-pointer"
            >
              Upload your first resume
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Header Row */}
            <div className="grid grid-cols-4 px-6 py-4 text-xs text-gray-400 font-medium border-b bg-[#fafafa]">
              <span>Name</span>
              <span>Role</span>
              <span>Score</span>
              <span className="text-right">Action</span>
            </div>

            {/* Rows */}
            {resumes.map((resume) => {
              const score = resume.atsScore;

              return (
                <div key={resume._id} className="grid grid-cols-4 items-center px-6 py-4 text-sm transition hover:bg-[#f9f9fb] group">
                  {/* Name */}
                  <span className="text-[#1d1d1f] font-medium">{resume.resumeName}</span>

                  {/* Role */}
                  <span className="text-[#6e6e73]">{resume.targetRole}</span>

                  {/* Score Badge */}
                  <span>
                    {score ? (
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getScoreStyle(score)}`}>{score}</span>
                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </span>

                  {/* Button */}
                  <div className="text-right">
                    <button
                      onClick={() => navigate(`/resume/${resume._id}`)}
                      className="px-4 py-1.5 text-sm font-medium bg-[#1d1d1f] text-white rounded-lg cursor-pointer hover:opacity-90 transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
