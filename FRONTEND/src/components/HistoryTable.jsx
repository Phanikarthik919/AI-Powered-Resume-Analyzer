import { headingClass, mutedText, emptyStateClass, ghostBtn, primaryBtn } from "../styles/common";

function HistoryTable({ records = [], onView }) {
  return (
    <div>
      <h2 className={`${headingClass} mb-5`}>Resume History</h2>
      {records.length === 0 ? (
        <p className={emptyStateClass}>No resumes analyzed yet.</p>
      ) : (
        <div className="rounded-2xl border border-[#e8e8ed] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f5f5f7] border-b border-[#e8e8ed]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e73] uppercase tracking-wider">
                  Resume
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e73] uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e73] uppercase tracking-wider">
                  ATS Score
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e73] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, i) => (
                <tr
                  key={i}
                  className="border-b border-[#e8e8ed] last:border-none hover:bg-[#f5f5f7] transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-[#1d1d1f]">{rec.name}</td>
                  <td className="px-5 py-3 text-[#6e6e73]">{rec.date}</td>
                  <td className="px-5 py-3">
                    <span className="font-semibold text-[#0066cc]">{rec.score}</span>
                    <span className={mutedText}> / 100</span>
                  </td>
                  <td className="px-5 py-3 flex items-center gap-3">
                    <button className={primaryBtn} onClick={() => onView?.(rec)}>
                      View
                    </button>
                    <button className={ghostBtn}>Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistoryTable;
