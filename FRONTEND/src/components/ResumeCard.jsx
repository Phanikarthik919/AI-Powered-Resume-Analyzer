import { articleCardClass, articleTitle, articleExcerpt, articleMeta, tagClass, primaryBtn, ghostBtn } from "../styles/common";

function ResumeCard({ title, date, score, status, onView }) {
  return (
    <div className={articleCardClass}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={tagClass}>{status ?? "Analyzed"}</p>
          <h3 className={`${articleTitle} mt-1`}>{title}</h3>
          <p className={articleExcerpt}>ATS Score: {score ?? "N/A"}</p>
          <p className={articleMeta}>{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3">
        <button className={primaryBtn} onClick={onView}>
          View Analysis
        </button>
        <button className={ghostBtn}>Download</button>
      </div>
    </div>
  );
}

export default ResumeCard;
