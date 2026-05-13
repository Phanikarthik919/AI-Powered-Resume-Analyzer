import React, { useState } from 'react';

const EducationTab = ({ education, updateEducation, removeEducation, addEducation, labelClass, inputClass, secondaryBtn }) => {
  const [expandedIndex, setExpandedIndex] = useState(education?.length > 0 ? 0 : null);

  const handleAdd = () => {
    addEducation();
    setExpandedIndex(education?.length || 0);
  };

  if (!education || education.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#f5f5f7] rounded-2xl border border-dashed border-[#d2d2d7]">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <span className="text-2xl">🎓</span>
        </div>
        <h3 className="text-sm font-bold text-[#1d1d1f] mb-2">No Education Added</h3>
        <p className="text-[11px] text-[#6e6e73] text-center max-w-xs mb-6">
          Add your academic background. Degrees, bootcamps, and relevant certifications all count.
        </p>
        <button onClick={handleAdd} className={`${secondaryBtn} bg-white shadow-sm px-6 py-2`}>
          + Add Education
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {education.map((edu, i) => {
        const isExpanded = expandedIndex === i;
        return (
          <div key={i} className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-[#0066cc] shadow-[0_4px_20px_rgba(0,102,204,0.1)]' : 'border-[#e8e8ed] hover:border-[#d2d2d7]'}`}>
            
            {/* Header (Always visible) */}
            <div 
              className={`p-4 flex items-center justify-between cursor-pointer ${isExpanded ? 'bg-[#fbfbfd] border-b border-[#e8e8ed]' : ''}`}
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
            >
              <div className="flex flex-col">
                <h4 className={`text-[13px] font-bold ${edu.degree ? 'text-[#1d1d1f]' : 'text-[#a1a1a6] italic'}`}>
                  {edu.degree || '(No Degree/Certificate)'}
                </h4>
                <p className="text-[11px] text-[#6e6e73] mt-0.5 truncate max-w-xs">
                  {edu.institution ? edu.institution : '(No Institution)'} {edu.year && ` • ${edu.year}`}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); removeEducation(i); }}
                  className="w-7 h-7 text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-full flex items-center justify-center transition-colors"
                  title="Remove"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                <div className={`text-[#a1a1a6] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="p-5 grid grid-cols-2 gap-5 bg-white">
                <div>
                  <label className={labelClass}>Degree / Certificate</label>
                  <input className={inputClass} value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} placeholder="e.g. B.Tech in Computer Science" />
                </div>
                <div>
                  <label className={labelClass}>Institution</label>
                  <input className={inputClass} value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} placeholder="e.g. Stanford University" />
                </div>
                <div>
                  <label className={labelClass}>Graduation Year</label>
                  <input className={inputClass} value={edu.year} onChange={(e) => updateEducation(i, 'year', e.target.value)} placeholder="e.g. 2024" />
                </div>
                <div>
                  <label className={labelClass}>GPA / Score</label>
                  <input className={inputClass} value={edu.score} onChange={(e) => updateEducation(i, 'score', e.target.value)} placeholder="e.g. 3.8/4.0 or 85%" />
                </div>
              </div>
            </div>
            
          </div>
        );
      })}
      
      <button onClick={handleAdd} className={`${secondaryBtn} w-full py-4 border-dashed bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#6e6e73] transition-colors`}>
        + Add Another Education
      </button>
    </div>
  );
};

export default EducationTab;
