import { cardClass, headingClass, bodyText, emptyStateClass } from "../styles/common";

function MissingSkills({ skills = [] }) {
  return (
    <div className={cardClass}>
      <h2 className={headingClass}>Missing Skills</h2>
      <p className={`${bodyText} mt-1 mb-5`}>
        Skills found in the job description but missing from your resume.
      </p>

      {skills.length === 0 ? (
        <p className={emptyStateClass}>No missing skills detected 🎉</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#ff3b30]/[0.08] text-[#cc2f26] border border-[#ff3b30]/20"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default MissingSkills;
