import { cardClass, headingClass, bodyText, emptyStateClass } from "../styles/common";

function Suggestions({ suggestions = [] }) {
  return (
    <div className={cardClass}>
      <h2 className={headingClass}>Improvement Suggestions</h2>
      <p className={`${bodyText} mt-1 mb-5`}>
        Apply these tips to boost your resume's effectiveness.
      </p>

      {suggestions.length === 0 ? (
        <p className={emptyStateClass}>No suggestions available yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {suggestions.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 text-[#0066cc] font-bold text-sm shrink-0">
                {i + 1}.
              </span>
              <p className={bodyText}>{item}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Suggestions;
