import React from 'react';

const EducationTab = ({ education, updateEducation, removeEducation, addEducation, labelClass, inputClass, secondaryBtn }) => {
  return (
    <div className="space-y-8">
      {education?.map((edu, i) => (
        <div key={i} className="p-6 bg-[#f5f5f7] rounded-2xl relative border border-[#e8e8ed] group">
          <button onClick={() => removeEducation(i)} className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-[#e8e8ed] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[#ff3b30]">×</button>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Degree / Certificate</label>
              <input className={inputClass} value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Institution</label>
              <input className={inputClass} value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Year</label>
              <input className={inputClass} value={edu.year} onChange={(e) => updateEducation(i, 'year', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Score / Grade</label>
              <input className={inputClass} value={edu.score} onChange={(e) => updateEducation(i, 'score', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <button onClick={addEducation} className={`${secondaryBtn} w-full py-4 border-dashed bg-[#f5f5f7] text-[#6e6e73]`}>
        + Add Education entry
      </button>
    </div>
  );
};

export default EducationTab;
