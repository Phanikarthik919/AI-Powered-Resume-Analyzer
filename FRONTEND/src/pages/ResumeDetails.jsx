import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useResumeStore from "../stores/resumeStore";

const ResumeDetails = () => {
  const { id } = useParams();
  const { selectedResume, getResumeById, loading } = useResumeStore();

  useEffect(() => {
    if (id) {
      getResumeById(id);
    }
  }, [id, getResumeById]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading resume...</div>;
  }

  if (!selectedResume) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Resume not found</div>;
  }

  const score = selectedResume.atsScore || 0;
  const breakdown = selectedResume.scoreBreakdown || {};

  // --- Circle Logic ---
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  // ✅ correct (colored = score)
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 75) return { text: "text-green-600", stroke: "stroke-green-500" };
    if (score >= 50) return { text: "text-yellow-500", stroke: "stroke-yellow-500" };
    return { text: "text-red-500", stroke: "stroke-red-500" };
  };

  const colors = getScoreColor();

  const maxMap = {
    sectionCompleteness: 15,
    skillMatch: 25,
    experienceDepth: 25,
    projectQuality: 20,
    education: 10,
    deductions: 10,
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h1 className="text-2xl font-semibold text-[#1d1d1f]">{selectedResume.resumeName}</h1>
          <p className="text-sm text-[#6e6e73] mt-1">Target Role: {selectedResume.targetRole}</p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* ATS SCORE */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <h2 className="text-sm text-gray-500 mb-4 font-medium">ATS Score</h2>

            <div className="relative flex items-center justify-center">
              {/* ✅ FIXED SVG */}
              <svg
                width="140"
                height="140"
                style={{
                  transform: "rotate(-90deg) scaleY(-1)", // ✅ CORRECT
                  transformOrigin: "50% 50%",
                }}
              >
                {/* Background */}
                <circle cx="70" cy="70" r={radius} stroke="#e5e7eb" strokeWidth="10" fill="none" />

                {/* Progress */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={`transition-all duration-700 ease-out ${colors.stroke}`}
                />
              </svg>

              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${colors.text}`}>{score}</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold">/100</span>
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-medium text-[#1d1d1f] mb-3">Summary</h2>
            <p className="text-sm text-[#6e6e73] leading-relaxed font-medium">
              "{selectedResume.analysisSummary || "No summary available"}"
            </p>
          </div>
        </div>

        {/* BREAKDOWN */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-medium text-[#1d1d1f] mb-4">Score Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(breakdown).map(([key, value]) => {
              const max = maxMap[key] || 25;
              const percentage = Math.min((value / max) * 100, 100);

              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="capitalize text-[#6e6e73]">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="text-[#1d1d1f] font-medium">
                      {value} / {max}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Suggestions */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <span>💡</span> AI Suggestions
            </h2>
            {selectedResume.aiSuggestions?.length > 0 ? (
              <ul className="space-y-3">
                {selectedResume.aiSuggestions.map((item, i) => (
                  <li key={i} className="text-sm text-[#6e6e73] flex gap-2">
                    <span className="text-blue-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No suggestions available</p>
            )}
          </div>

          {/* Missing Skills */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <span>🎯</span> Missing Skills
            </h2>
            {selectedResume.missingSkills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedResume.missingSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 border border-red-100 rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">All key skills detected!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetails;
