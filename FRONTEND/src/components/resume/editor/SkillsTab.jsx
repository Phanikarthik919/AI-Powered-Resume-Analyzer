import React from 'react';

const SkillsTab = ({ skills, handleSkillChange, removeSkillCategory, setShowSkillModal, labelClass, inputClass }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs text-[#6e6e73]">Manage your skills by category.</p>
        <button onClick={() => setShowSkillModal(true)} className="text-[10px] font-bold text-[#0066cc] uppercase tracking-wider hover:underline">
          + Add Category
        </button>
      </div>
      <div className="space-y-5">
        {Object.keys(skills || {}).map(cat => (
          <div key={cat} className="group p-4 bg-[#f5f5f7] rounded-xl border border-[#e8e8ed] relative">
            <button
              onClick={() => removeSkillCategory(cat)}
              className="absolute top-2 right-2 text-[10px] text-[#ff3b30] opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase"
            >
              Delete
            </button>
            <label className={labelClass}>{cat}</label>
            <input
              className={inputClass}
              value={(skills[cat] || []).join(', ')}
              onChange={(e) => handleSkillChange(cat, e.target.value)}
              placeholder="Skill 1, Skill 2, Skill 3"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsTab;
