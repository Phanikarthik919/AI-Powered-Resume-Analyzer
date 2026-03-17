import React from 'react';

const SkillModal = ({
  showSkillModal,
  setShowSkillModal,
  newCatName,
  setNewCatName,
  handleAddSkillCategory,
  inputClass,
  primaryBtn,
  secondaryBtn
}) => {
  if (!showSkillModal) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 px-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-[#e8e8ed] transform animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <h3 className="text-xl font-semibold mb-1 text-[#1d1d1f]">New Skill Category</h3>
        <p className="text-[#6e6e73] text-[13px] mb-6">Create a section like "Testing", "Soft Skills", or "Cloud".</p>

        <input
          autoFocus
          className={`${inputClass} mb-8 py-4 px-5 text-base border-2 focus:border-[#0066cc] bg-[#f5f5f7] rounded-2xl transition-all`}
          placeholder="e.g. Cloud Infrastructure"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddSkillCategory()}
        />

        <div className="flex gap-3">
          <button
            onClick={() => { setShowSkillModal(false); setNewCatName(""); }}
            className={`${secondaryBtn} flex-1 py-4 font-semibold text-[#1d1d1f] border-[#d2d2d7] hover:bg-[#f5f5f7] transition-all`}
          >
            Cancel
          </button>
          <button
            onClick={handleAddSkillCategory}
            className={`${primaryBtn} flex-1 py-4 font-semibold shadow-lg shadow-[#0066cc]/20 hover:shadow-[#0066cc]/40 transition-all`}
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillModal;
