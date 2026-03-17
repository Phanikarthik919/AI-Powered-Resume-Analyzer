import React from 'react';

const AchievementsTab = ({ achievements, handleAchievementsChange, labelClass, inputClass }) => {
  return (
    <div className="space-y-4">
      <label className={labelClass}>Achievements & Accomplishments (one per line)</label>
      <textarea
        className={`${inputClass} h-64 resize-none leading-relaxed p-4 bg-white`}
        value={achievements?.join('\n') || ""}
        onChange={(e) => handleAchievementsChange(e.target.value)}
        placeholder="• Won hackathon among 500 participants...
• Awarded Employee of the Month twice...
• Published research paper on AI in IEEE journal..."
      />
    </div>
  );
};

export default AchievementsTab;
