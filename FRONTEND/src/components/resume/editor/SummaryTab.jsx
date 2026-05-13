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
      <div className="bg-[#f5f5f7] p-4 rounded-xl border border-[#e8e8ed] mb-6">
        <p className="text-[11px] text-[#6e6e73] leading-relaxed">
          <span className="font-bold text-[#1d1d1f]">💡 Tip:</span> Start with a strong adjective, follow with your current role, and mention your top 2-3 achievements. Keep it under 4 lines for maximum impact.
        </p>
      </div>
      <textarea
        className={`${inputClass} h-64 resize-none leading-relaxed p-5 bg-white shadow-sm focus:shadow-md transition-shadow`}
        value={summary || ""}
        onChange={handleSummaryChange}
        placeholder="Example: Data-driven Software Engineer with 5+ years of experience in building scalable cloud applications. Proven track record of improving system performance by 30%..."
      />
    </div>
  );
};

export default SummaryTab;
