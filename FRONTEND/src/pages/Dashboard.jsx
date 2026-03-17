import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getResumeHistory } from "../services/api";
import {
  pageWrapper,
  pageTitleClass,
  headingClass,
  subHeadingClass,
  cardClass,
  bodyText,
  mutedText,
  primaryBtn,
  loadingClass,
  errorClass,
} from "../styles/common";

// ── mini sparkline chart ──────────────────────────────────────────────────────
function Sparkline({ scores }) {
  if (!scores || scores.length < 2) return null;
  const W = 260, H = 60, pad = 6;
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min || 1;
  const xs = scores.map((_, i) => pad + (i / (scores.length - 1)) * (W - pad * 2));
  const ys = scores.map((s) => H - pad - ((s - min) / range) * (H - pad * 2));
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  const area = `${path} L ${xs[xs.length - 1]} ${H} L ${xs[0]} ${H} Z`;

  return (
    <svg width={W} height={H} className="overflow-visible">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0066cc" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0066cc" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkGrad)" />
      <path d={path} fill="none" stroke="#0066cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="#0066cc" />
      ))}
    </svg>
  );
}

// ── horizontal bar for score band ────────────────────────────────────────────
function BandBar({ label, count, total, color }) {
  const pct = total ? (count / total) * 100 : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs font-medium text-[#6e6e73] mb-1">
        <span>{label}</span>
        <span>{count} resume{count !== 1 ? "s" : ""}</span>
      </div>
      <div className="w-full h-2.5 bg-[#e8e8ed] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── score badge ───────────────────────────────────────────────────────────────
function ScoreBadge({ score }) {
  const color =
    score >= 75 ? "bg-green-100 text-green-700" :
      score >= 50 ? "bg-yellow-100 text-yellow-700" :
        "bg-red-100 text-red-700";
  return (
    <span className={`${color} font-bold text-sm px-2.5 py-0.5 rounded-full`}>
      {score}%
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getResumeHistory();
        setResumes(res.payload || []);
      } catch (e) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className={pageWrapper}><p className={loadingClass}>Loading dashboard…</p></div>;
  if (error) return <div className={pageWrapper}><p className={errorClass}>{error}</p></div>;

  // ── derive analytics ──────────────────────────────────────────────────────
  const total = resumes.length;
  const scores = resumes.map((r) => r.atsScore);
  const avgScore = total ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0;
  const best = total ? Math.max(...scores) : 0;
  const latest = resumes[0];

  // chronological order for sparkline (oldest → newest)
  const chronoScores = [...resumes].reverse().map((r) => r.atsScore);

  // score band breakdown
  const great = scores.filter((s) => s >= 75).length;
  const good = scores.filter((s) => s >= 50 && s < 75).length;
  const poor = scores.filter((s) => s < 50).length;

  // unique roles
  const roles = [...new Set(resumes.map((r) => r.targetRole))];

  const avgColor =
    avgScore >= 75 ? "#22c55e" : avgScore >= 50 ? "#eab308" : "#ef4444";

  return (
    <div className={pageWrapper}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <h1 className={pageTitleClass}>Dashboard</h1>
        <Link to="/upload" className={primaryBtn}>+ Upload Resume</Link>
      </div>

      {total === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">📄</p>
          <p className={`${headingClass} mb-2`}>No resumes yet</p>
          <p className={`${bodyText} mb-6`}>Upload your first resume to see analytics here.</p>
          <Link to="/upload" className={primaryBtn}>Upload Now</Link>
        </div>
      ) : (
        <>
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Avg score */}
            <div className={`${cardClass} !cursor-default col-span-2 md:col-span-1`}>
              <p className={`${mutedText} mb-1`}>Avg ATS Score</p>
              <p className="text-4xl font-extrabold" style={{ color: avgColor }}>{avgScore}<span className="text-xl font-semibold text-[#a1a1a6]">%</span></p>
            </div>

            {/* Total */}
            <div className={`${cardClass} !cursor-default`}>
              <p className={`${mutedText} mb-1`}>Resumes</p>
              <p className="text-4xl font-extrabold text-[#1d1d1f]">{total}</p>
            </div>

            {/* Best score */}
            <div className={`${cardClass} !cursor-default`}>
              <p className={`${mutedText} mb-1`}>Best Score</p>
              <p className="text-4xl font-extrabold text-[#22c55e]">{best}<span className="text-xl font-semibold text-[#a1a1a6]">%</span></p>
            </div>

            {/* Latest role */}
            <div className={`${cardClass} !cursor-default`}>
              <p className={`${mutedText} mb-1`}>Latest Role</p>
              <p className="text-base font-bold text-[#0066cc] leading-tight mt-1 truncate">{latest?.targetRole || "—"}</p>
            </div>
          </div>

          {/* ── Analytics row ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            {/* ATS Score Trend */}
            <div className={`${cardClass} !cursor-default`}>
              <h2 className={`${subHeadingClass} mb-1`}>ATS Score Trend</h2>
              <p className={`${mutedText} mb-4`}>Scores across all uploads (oldest → newest)</p>
              {chronoScores.length >= 2
                ? <Sparkline scores={chronoScores} />
                : <p className={`${bodyText} text-sm`}>Upload at least 2 resumes to see the trend.</p>
              }
            </div>

            {/* Score Band Breakdown */}
            <div className={`${cardClass} !cursor-default`}>
              <h2 className={`${subHeadingClass} mb-1`}>Score Distribution</h2>
              <p className={`${mutedText} mb-5`}>How your resumes rank across score bands</p>
              <BandBar label="🟢 Great (75–100)" count={great} total={total} color="#22c55e" />
              <BandBar label="🟡 Good (50–74)" count={good} total={total} color="#eab308" />
              <BandBar label="🔴 Poor (0–49)" count={poor} total={total} color="#ef4444" />

              <div className="mt-5 pt-4 border-t border-[#e8e8ed] flex gap-6 text-center">
                <div className="flex-1">
                  <p className="text-xl font-bold text-[#22c55e]">{total ? Math.round((great / total) * 100) : 0}%</p>
                  <p className="text-[11px] text-[#a1a1a6]">Great rates</p>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-[#1d1d1f]">{avgScore}%</p>
                  <p className="text-[11px] text-[#a1a1a6]">Average</p>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-[#0066cc]">{roles.length}</p>
                  <p className="text-[11px] text-[#a1a1a6]">Unique roles</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Target Roles pill list ── */}
          {roles.length > 0 && (
            <div className={`${cardClass} !cursor-default mb-8`}>
              <h2 className={`${subHeadingClass} mb-3`}>Roles Targeted</h2>
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <span key={role} className="px-3 py-1.5 rounded-full bg-white border border-[#d2d2d7] text-sm font-medium text-[#1d1d1f]">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Recent Resumes ── */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className={headingClass}>Recent Uploads</h2>
              <Link to="/history" className="text-sm text-[#0066cc] font-medium hover:underline">View all →</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {resumes.slice(0, 6).map((resume) => (
                <div
                  key={resume._id}
                  className={`${cardClass} flex flex-col gap-3`}
                  onClick={() => navigate(`/analysis/${resume._id}`)}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold text-[#1d1d1f] leading-tight truncate pr-2">{resume.resumeName}</p>
                    <ScoreBadge score={resume.atsScore} />
                  </div>
                  <p className="text-xs text-[#a1a1a6]">🎯 {resume.targetRole}</p>

                  {/* mini score bar */}
                  <div className="w-full h-1.5 bg-[#e8e8ed] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${resume.atsScore}%`,
                        backgroundColor: resume.atsScore >= 75 ? "#22c55e" : resume.atsScore >= 50 ? "#eab308" : "#ef4444",
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-1">
                    <p className="text-[11px] text-[#a1a1a6]">{new Date(resume.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    <button className={primaryBtn}>View →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}