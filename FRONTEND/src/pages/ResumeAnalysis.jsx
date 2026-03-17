import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getResumeAnalysis } from "../services/api";
import {
  pageWrapper,
  pageTitleClass,
  headingClass,
  bodyText,
  section,
  loadingClass,
  errorClass,
  subHeadingClass,
  cardClass,
  primaryBtn,
  mutedText,
} from "../styles/common";
import useResumeStore from "../store/resumeStore";
import ATSScore from "../components/ATSScore";
import Suggestions from "../components/Suggestions";
import MissingSkills from "../components/MissingSkills";
import DownloadResume from "../components/DownloadResume";

/* ── Speedometer / Gauge ATS Score ── */
function ScoreRing({ score }) {
  const val = Math.min(Math.max(score || 0, 0), 100);

  // ── Layout constants ──────────────────────────────────────────
  const cx = 110, cy = 110;  // SVG pivot / needle base
  const Ro = 95;             // outer radius of band
  const Ri = 68;             // inner radius of band  (band thickness = Ro - Ri)
  const needleLen = 82;

  // ── Angle mapping ─────────────────────────────────────────────
  // score 0  → 180° (leftmost,  red)
  // score 100 → 0°  (rightmost, green)
  // Standard math angles: 0°=right, 90°=top, 180°=left
  const scoreToAngleDeg = (s) => 180 - (s / 100) * 180;

  // ── Single helper: angle (deg) → SVG (x, y) ──────────────────
  const pt = (angleDeg, r) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),   // cos(180°)=-1 → left, cos(0°)=+1 → right ✓
      y: cy - r * Math.sin(rad),   // SVG y is flipped, sin(90°)=+1 → up ✓
    };
  };

  // ── Segment arc paths ─────────────────────────────────────────
  // Each segment spans 45° (100/4 * 1.8 = 45°)
  // fromScore < toScore  →  startAngle > endAngle
  // We draw: outer arc from startAngle → endAngle (CCW = sweep 0 in SVG means
  //   going through the top, the short way for arcs < 180°)
  const GAP_DEG = 2.5; // gap between segments
  const arcPath = (fromScore, toScore) => {
    const a1 = scoreToAngleDeg(fromScore) - GAP_DEG / 2;  // nudge inward
    const a2 = scoreToAngleDeg(toScore) + GAP_DEG / 2;  // nudge inward
    const oA = pt(a1, Ro), oB = pt(a2, Ro);
    const iA = pt(a1, Ri), iB = pt(a2, Ri);
    // Going from a1 (larger angle, left) to a2 (smaller angle, right)
    // through the top arc: this is COUNTER-CLOCKWISE in SVG (sweep-flag=0)
    return [
      `M ${oA.x} ${oA.y}`,
      `A ${Ro} ${Ro} 0 0 0 ${oB.x} ${oB.y}`,  // outer CCW
      `L ${iB.x} ${iB.y}`,
      `A ${Ri} ${Ri} 0 0 1 ${iA.x} ${iA.y}`,  // inner CW (back)
      `Z`,
    ].join(' ');
  };

  const segments = [
    { from: 0, to: 25, color: '#ef4444' },   // red
    { from: 25, to: 50, color: '#f97316' },   // orange
    { from: 50, to: 75, color: '#eab308' },   // yellow
    { from: 75, to: 100, color: '#22c55e' },   // green
  ];

  // ── Needle ────────────────────────────────────────────────────
  const needleAngle = scoreToAngleDeg(val);   // e.g. 85 → 27°
  const tip = pt(needleAngle, needleLen);     // same pt() helper → consistent ✓

  // ── Labels ────────────────────────────────────────────────────
  const labelColor = val >= 75 ? '#22c55e' : val >= 50 ? '#eab308' : val >= 25 ? '#f97316' : '#ef4444';
  const labelText = val >= 75 ? 'Great Match!' : val >= 50 ? 'Good' : val >= 25 ? 'Needs Work' : 'Poor';

  return (
    <div className="flex flex-col items-center select-none">
      <svg width="220" height="125" viewBox="0 0 220 125" overflow="visible">
        {/* Coloured band segments */}
        {segments.map((seg) => (
          <path key={seg.from} d={arcPath(seg.from, seg.to)} fill={seg.color} opacity="0.9" />
        ))}

        {/* Score labels at left / right ends */}
        <text x="14" y={cy + 16} fontSize="10" fill="#6b7280" textAnchor="middle">0</text>
        <text x="206" y={cy + 16} fontSize="10" fill="#6b7280" textAnchor="middle">100</text>

        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={tip.x} y2={tip.y}
          stroke="#1d1d1f"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Pivot circles */}
        <circle cx={cx} cy={cy} r="8" fill="#1d1d1f" />
        <circle cx={cx} cy={cy} r="4" fill="white" />
      </svg>

      {/* Score + label */}
      <div className="flex flex-col items-center -mt-2">
        <span className="text-4xl font-extrabold" style={{ color: labelColor }}>{val}</span>
        <span className="text-[10px] text-[#a1a1a6] font-semibold uppercase tracking-widest mt-0.5">ATS Score</span>
        <span className="text-xs font-semibold mt-1" style={{ color: labelColor }}>{labelText}</span>
      </div>
    </div>
  );
}

function ResumeAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentResume: analysis,
    setCurrentResume: setAnalysis,
    loading,
    setLoading,
    error,
    setError,
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState("analysis"); // "analysis" | "text"

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const res = await getResumeAnalysis(id);
        setAnalysis(res.payload);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch analysis");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading)
    return (
      <div className={pageWrapper}>
        <p className={loadingClass}>Loading analysis...</p>
      </div>
    );

  if (error)
    return (
      <div className={pageWrapper}>
        <p className={errorClass}>{error}</p>
        <Link to="/history" className="mt-4 block text-[#0066cc]">
          Back to History
        </Link>
      </div>
    );

  if (!analysis)
    return (
      <div className={pageWrapper}>
        <p className={errorClass}>No analysis found.</p>
      </div>
    );

  if (analysis.status === "failed") {
    return (
      <div className={pageWrapper}>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={pageTitleClass}>{analysis.resumeName}</h1>
            <p className={`${bodyText} mt-1`}>
              Target Role:{" "}
              <span className="font-semibold text-[#1d1d1f]">
                {analysis.targetRole}
              </span>
            </p>
          </div>
          <Link to="/history" className="text-sm font-medium text-[#0066cc] hover:underline mt-2">
            ← History
          </Link>
        </div>

        {/* AI failed banner */}
        <div className={`${errorClass} mb-6 flex items-start gap-3`}>
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-semibold mb-1">AI Analysis Unavailable</p>
            <p className="text-sm opacity-80">
              The AI service was unavailable (quota exceeded or API error).
              Your PDF was uploaded and scanned successfully — you can view the
              extracted text below.
            </p>
          </div>
        </div>

        {/* Show extracted text if available */}
        {analysis.resumeText ? (
          <div className="bg-[#f5f5f7] rounded-2xl p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className={subHeadingClass}>Extracted Resume Text</h3>
              <span className={mutedText}>
                {analysis.resumeText.length.toLocaleString()} characters
              </span>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-[0.8rem] text-[#3a3a3c] leading-relaxed bg-white rounded-xl p-6 border border-[#e8e8ed] overflow-auto max-h-[70vh]">
              {analysis.resumeText}
            </pre>
          </div>
        ) : (
          <p className={bodyText}>
            No text could be extracted from this PDF.{" "}
            <Link to="/upload" className="text-[#0066cc] hover:underline">
              Try uploading again →
            </Link>
          </p>
        )}
      </div>
    );
  }

  if (analysis.status === "processing") {
    return (
      <div className={pageWrapper}>
        <p className={loadingClass}>
          AI Insight is still processing. Please refresh in a moment...
        </p>
        <button
          onClick={() => window.location.reload()}
          className={primaryBtn}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  const tabs = ["analysis", "profile", "text"];

  return (
    <div className={pageWrapper}>
      {/* ── Header ── */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className={pageTitleClass}>{analysis.resumeName}</h1>
          <p className={`${bodyText} mt-1`}>
            Target Role:{" "}
            <span className="font-semibold text-[#1d1d1f]">
              {analysis.targetRole}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 text-right">
          <Link
            to="/history"
            className="text-sm font-medium text-[#0066cc] hover:underline"
          >
            ← History
          </Link>
          <button
            onClick={() => navigate(`/resume-builder/${id}`)}
            className={`${primaryBtn} flex items-center gap-1.5`}
          >
            ✏️ Edit & Download Resume
          </button>
        </div>
      </div>

      {/* ── Tab switcher ── */}
      <div className="flex gap-1 bg-[#f5f5f7] p-1 rounded-xl w-fit mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${activeTab === tab
              ? "bg-white text-[#1d1d1f] shadow-sm"
              : "text-[#6e6e73] hover:text-[#1d1d1f]"
              }`}
          >
            {tab === "text" ? "Extracted Text" : tab === "profile" ? "Resume Profile" : "AI Analysis"}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div className={`${cardClass} !p-10 mb-8 border border-[#0066cc]/10`}>
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#e8e8ed]">
              <h2 className={headingClass}>Structured Resume Data</h2>
              <span className="text-xs font-bold text-[#0066cc] bg-[#0066cc]/5 px-3 py-1 rounded-full uppercase tracking-widest">
                AI Parsed
              </span>
            </div>

            {analysis.parsedData ? (
              <div className="space-y-12">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className={`${subHeadingClass} text-[#0066cc] mb-4`}>Personal Information</h3>
                    <div className="space-y-3">
                      <p className="text-sm"><span className="font-semibold w-24 inline-block">Name:</span> {analysis.parsedData.personalInfo?.name || "—"}</p>
                      <p className="text-sm"><span className="font-semibold w-24 inline-block">Email:</span> {analysis.parsedData.personalInfo?.email || "—"}</p>
                      <p className="text-sm"><span className="font-semibold w-24 inline-block">Phone:</span> {analysis.parsedData.personalInfo?.phone || "—"}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className={`${subHeadingClass} text-[#0066cc] mb-4`}>Links</h3>
                    <div className="space-y-3">
                      <p className="text-sm">
                        <span className="font-semibold w-24 inline-block">LinkedIn:</span>
                        {analysis.parsedData.personalInfo?.linkedin ? <a href={analysis.parsedData.personalInfo.linkedin} target="_blank" className="text-[#0066cc] underline text-xs">Profile</a> : "—"}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold w-24 inline-block">GitHub:</span>
                        {analysis.parsedData.personalInfo?.github ? <a href={analysis.parsedData.personalInfo.github} target="_blank" className="text-[#0066cc] underline text-xs">Profile</a> : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className={`${subHeadingClass} text-[#0066cc] mb-5 pb-2 border-b border-[#e8e8ed]/50`}>Technical Expertise</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(analysis.parsedData.skills || {}).map(([category, items]) => (
                      items && items.length > 0 && (
                        <div key={category} className="bg-white/50 p-4 rounded-xl border border-[#e8e8ed]">
                          <h4 className="text-[10px] font-bold text-[#a1a1a6] uppercase tracking-[0.15em] mb-3">{category}</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {items.map((skill, idx) => (
                              <span key={idx} className="bg-[#f5f5f7] px-2.5 py-1 rounded text-[11px] font-medium text-[#1d1d1f] border border-[#e8e8ed]">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                {/* Work Experience */}
                <div>
                  <h3 className={`${subHeadingClass} text-[#0066cc] mb-6 pb-2 border-b border-[#e8e8ed]/50`}>Professional Experience</h3>
                  <div className="space-y-8 pl-4 border-l-2 border-[#0066cc]/10">
                    {analysis.parsedData.experience?.map((exp, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[25px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#0066cc] shadow-sm"></div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-[#1d1d1f]">{exp.title}</h4>
                          <span className="text-[11px] font-semibold text-[#6e6e73] bg-[#f5f5f7] px-2 py-0.5 rounded">{exp.duration}</span>
                        </div>
                        <p className="text-sm font-semibold text-[#0066cc] mb-3">{exp.company} • {exp.location}</p>
                        <ul className="space-y-1.5">
                          {exp.description?.map((point, pIdx) => (
                            <li key={pIdx} className="text-xs text-[#424245] flex gap-2">
                              <span className="text-[#0066cc] mt-0.5">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-10">
                <p className={mutedText}>Structured data unavailable for this analysis.</p>
              </div>
            )}
          </div>

          <div className="flex justify-center mb-16">
            <button
              onClick={() => navigate(`/resume-builder/${id}`)}
              className={`${primaryBtn} !px-10 !py-4 shadow-xl hover:scale-105 transition-all`}
            >
              ✏️ Launch Resume Builder with this Content
            </button>
          </div>
        </div>
      )}

      {/* ══════════════ ANALYSIS TAB ══════════════ */}
      {activeTab === "analysis" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Analysis Column (Left) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Score + Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* ATS score card */}
              <div className="md:col-span-5 bg-[#f5f5f7] rounded-2xl p-8 flex flex-col items-center justify-center gap-4">
                <ScoreRing score={analysis.atsScore} />
                <p className={`${bodyText} text-center text-sm mt-2`}>
                  {analysis.atsScore >= 65
                    ? "Elite Match! Your resume is highly metrics-driven."
                    : analysis.atsScore >= 45
                      ? "Commendable. But it needs more measurable impact (numbers)."
                      : "Critical Failures Detected. This will likely be rejected."}
                </p>
              </div>

              {/* Summary card */}
              <div className="md:col-span-7 bg-[#f5f5f7] rounded-2xl p-8 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={subHeadingClass}>AI Summary</h3>
                  <span className="text-[10px] font-bold text-[#0066cc] uppercase tracking-widest bg-white px-2 py-0.5 rounded-full border border-[#0066cc]/20">
                    Strict Mode Active
                  </span>
                </div>
                <p className={`${bodyText} mt-1 leading-relaxed italic text-sm`}>
                  &quot;{analysis.analysisSummary || "No summary available."}&quot;
                </p>
                <div className="mt-8">
                  <DownloadResume
                    fileName={analysis.resumeName}
                    fileUrl={`${import.meta.env.VITE_API_URL}${analysis.filePublicId ? `/resumes/${analysis.filePublicId}` : analysis.fileUrl}`}
                  />
                </div>
              </div>
            </div>

            {/* New Math Breakdown Card */}
            <div className="bg-[#1d1d1f] text-white rounded-2xl p-8 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066cc]/10 blur-[100px] animate-pulse"></div>

              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                <div className="p-2 bg-[#0066cc] rounded-lg">📊</div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">ATS Mathematical Breakdown</h3>
                  <p className="text-[10px] text-[#a1a1a6] font-mono">CALCULATION PROTOCOL: [POINTS - PENALTIES] = {analysis.atsScore}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
                {[
                  { label: "Sections", val: analysis.scoringBreakdown?.sections, max: 5, color: "text-[#34c759]" },
                  { label: "Keywords", val: analysis.scoringBreakdown?.keywords, max: 25, color: "text-[#34c759]" },
                  { label: "Metrics", val: analysis.scoringBreakdown?.metrics, max: 40, color: "text-[#34c759]" },
                  { label: "Projects", val: analysis.scoringBreakdown?.projects, max: 20, color: "text-[#34c759]" },
                  { label: "Education", val: analysis.scoringBreakdown?.education, max: 10, color: "text-[#34c759]" },
                  { label: "Penalties", val: analysis.scoringBreakdown?.penalties, max: "∞", color: "text-[#ff3b30]" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-1 p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-semibold text-[#a1a1a6] uppercase tracking-wider">{item.label}</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-bold font-mono ${item.color}`}>
                        {item.label === "Penalties" ? "-" : "+"}{Math.abs(item.val || 0)}
                      </span>
                      <span className="text-[10px] text-[#a1a1a6]">/ {item.max}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[11px] text-[#a1a1a6] leading-relaxed">
                  <span className="text-[#ff3b30] font-bold">WARNING:</span> Our engine uses a 4-pass scoring algorithm. Points are deducted for personal pronouns,
                  fluff, and non-measurable bullets. A score of 60%+ is "Elite" in this strict testing environment.
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Missing Skills & Suggestions */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <MissingSkills skills={analysis.missingSkills || []} />
            <Suggestions suggestions={analysis.aiSuggestions || []} />
          </div>
        </div>
      )}

      {/* ══════════════ EXTRACTED TEXT TAB ══════════════ */}
      {activeTab === "text" && (
        <div className="bg-[#f5f5f7] rounded-2xl p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className={subHeadingClass}>Extracted Resume Text</h3>
            <span className={mutedText}>
              {analysis.resumeText?.length?.toLocaleString() || 0} characters
            </span>
          </div>
          {analysis.resumeText ? (
            <pre
              className="whitespace-pre-wrap font-mono text-[0.8rem] text-[#3a3a3c] leading-relaxed bg-white rounded-xl p-6 border border-[#e8e8ed] overflow-auto max-h-[70vh]"
            >
              {analysis.resumeText}
            </pre>
          ) : (
            <p className={`${bodyText} text-center py-12`}>
              No extracted text available for this resume.{" "}
              <Link to="/upload" className="text-[#0066cc]">
                Upload a new resume
              </Link>{" "}
              to see the extracted content.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeAnalysis;
