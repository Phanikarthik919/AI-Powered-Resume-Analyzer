import React from 'react';

const SummaryTab = ({ summary, handleSummaryChange, handleOptimize, optimizing, labelClass, inputClass }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <label className={labelClass}>Professional Summary</label>
        <button
          onClick={() => handleOptimize('summary', summary)}
          disabled={optimizing}
          className="text-[10px] font-bold text-[#0066cc] bg-[#0066cc]/5 px-3 py-1 rounded-full uppercase tracking-wider hover:bg-[#0066cc]/10 transition-all flex items-center gap-1"
        >
          {optimizing ? "Optimizing..." : "✨ AI Optimize"}
        </button>
      </div>
      <textarea
        className={`${inputClass} h-52 resize-none leading-relaxed p-4 bg-white`}
        value={summary || ""}
        onChange={handleSummaryChange}
        placeholder="Summarize your professional background..."
      />
    </div>
  );
};

export default SummaryTab;
