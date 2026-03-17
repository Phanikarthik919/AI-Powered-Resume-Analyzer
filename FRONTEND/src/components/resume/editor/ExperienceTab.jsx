import React from 'react';

const ExperienceTab = ({ experience, updateExperience, removeExperience, addExperience, handleOptimize, optimizing, labelClass, inputClass, secondaryBtn }) => {
  return (
    <div className="space-y-8">
      {experience?.map((exp, i) => (
        <div key={i} className="p-6 bg-[#f5f5f7] rounded-2xl relative border border-[#e8e8ed] group">
          <button
            onClick={() => removeExperience(i)}
            className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-[#e8e8ed] text-[#ff3b30] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
          >
            ×
          </button>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Job Title</label>
              <input className={inputClass} value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Company</label>
              <input className={inputClass} value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Timeline</label>
              <input className={inputClass} value={exp.duration} onChange={(e) => updateExperience(i, 'duration', e.target.value)} />
            </div>
            <div className="col-span-2">
              <div className="flex justify-between items-end mb-1">
                <label className={labelClass}>Achievements (one bullet per line)</label>
                <button
                  onClick={() => handleOptimize('experience', exp.description?.join('\n'), i)}
                  disabled={optimizing}
                  className="text-[10px] font-bold text-[#0066cc] bg-[#0066cc]/5 px-3 py-1 rounded-full uppercase tracking-wider hover:bg-[#0066cc]/10 transition-all flex items-center gap-1"
                >
                  {optimizing ? "Optimizing..." : "✨ AI Optimize"}
                </button>
              </div>
              <textarea
                className={`${inputClass} h-40 resize-none leading-relaxed p-4 bg-white`}
                value={exp.description?.join('\n')}
                onChange={(e) => updateExperience(i, 'description', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      <button onClick={addExperience} className={`${secondaryBtn} w-full py-4 border-dashed bg-[#f5f5f7] text-[#6e6e73]`}>
        + Add Experience entry
      </button>
    </div>
  );
};

export default ExperienceTab;
