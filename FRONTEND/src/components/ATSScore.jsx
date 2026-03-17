import { cardClass, headingClass, bodyText, tagClass } from "../styles/common";

function ATSScore({ score = 0 }) {
  const clampedScore = Math.min(100, Math.max(0, score));

  const color =
    clampedScore >= 80
      ? "#34c759"
      : clampedScore >= 50
      ? "#ff9f0a"
      : "#ff3b30";

  return (
    <div className={cardClass}>
      <h2 className={headingClass}>ATS Score</h2>
      <p className={`${bodyText} mt-1 mb-6`}>
        How well your resume matches the job description.
      </p>

      {/* Circular progress */}
      <div className="flex flex-col items-center gap-4">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle
            cx="70" cy="70" r="60"
            fill="none" stroke="#e8e8ed" strokeWidth="12"
          />
          <circle
            cx="70" cy="70" r="60"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={`${(clampedScore / 100) * 376} 376`}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
            style={{ transition: "stroke-dasharray 0.8s ease" }}
          />
          <text
            x="70" y="75"
            textAnchor="middle"
            fontSize="28"
            fontWeight="700"
            fill="#1d1d1f"
          >
            {clampedScore}
          </text>
          <text x="70" y="95" textAnchor="middle" fontSize="12" fill="#a1a1a6">
            / 100
          </text>
        </svg>

        <span
          className={tagClass}
          style={{ color }}
        >
          {clampedScore >= 80 ? "Excellent" : clampedScore >= 50 ? "Average" : "Needs Work"}
        </span>
      </div>
    </div>
  );
}

export default ATSScore;
