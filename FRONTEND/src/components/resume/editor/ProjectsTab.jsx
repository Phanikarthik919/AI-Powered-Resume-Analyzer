import React, { useState } from 'react';

const ProjectsTab = ({ projects, updateProject, removeProject, addProject, handleOptimize, optimizing, labelClass, inputClass, secondaryBtn }) => {
  const [expandedIndex, setExpandedIndex] = useState(projects?.length > 0 ? 0 : null);

  const handleAdd = () => {
    addProject();
    setExpandedIndex(projects?.length || 0);
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#f5f5f7] rounded-2xl border border-dashed border-[#d2d2d7]">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <span className="text-2xl">🚀</span>
        </div>
        <h3 className="text-sm font-bold text-[#1d1d1f] mb-2">No Projects Added</h3>
        <p className="text-[11px] text-[#6e6e73] text-center max-w-xs mb-6">
          Showcase your best side projects or major academic assignments to demonstrate your practical skills.
        </p>
        <button onClick={handleAdd} className={`${secondaryBtn} bg-white shadow-sm px-6 py-2`}>
          + Add Project
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((proj, i) => {
        const isExpanded = expandedIndex === i;
        return (
          <div key={i} className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-[#0066cc] shadow-[0_4px_20px_rgba(0,102,204,0.1)]' : 'border-[#e8e8ed] hover:border-[#d2d2d7]'}`}>
            
            {/* Header (Always visible) */}
            <div 
              className={`p-4 flex items-center justify-between cursor-pointer ${isExpanded ? 'bg-[#fbfbfd] border-b border-[#e8e8ed]' : ''}`}
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
            >
              <div className="flex flex-col">
                <h4 className={`text-[13px] font-bold ${proj.name ? 'text-[#1d1d1f]' : 'text-[#a1a1a6] italic'}`}>
                  {proj.name || '(Unnamed Project)'}
                </h4>
                <p className="text-[11px] text-[#6e6e73] mt-0.5 truncate max-w-xs">
                  {proj.techStack?.length > 0 ? proj.techStack.join(', ') : '(No tech stack)'}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); removeProject(i); }}
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
                <div className="col-span-2">
                  <label className={labelClass}>Project Name</label>
                  <input className={inputClass} value={proj.name} onChange={(e) => updateProject(i, 'name', e.target.value)} placeholder="e.g. AI Resume Builder" />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Tech Stack (comma separated)</label>
                  <input className={inputClass} value={proj.techStack?.join(', ')} onChange={(e) => updateProject(i, 'techStack', e.target.value)} placeholder="e.g. React, Node.js, MongoDB" />
                </div>
                <div>
                  <label className={labelClass}>Live Preview URL</label>
                  <input className={inputClass} value={proj.projectLink || ""} onChange={(e) => updateProject(i, 'projectLink', e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <label className={labelClass}>GitHub Repository URL</label>
                  <input className={inputClass} value={proj.gitRepo || ""} onChange={(e) => updateProject(i, 'gitRepo', e.target.value)} placeholder="https://github.com/..." />
                </div>
                <div className="col-span-2">
                  <div className="flex justify-between items-end mb-1">
                    <label className={labelClass}>Description / Achievements</label>
                    <button
                      onClick={() => handleOptimize('projects', proj.points?.join('\n'), i)}
                      disabled={optimizing}
                      className="text-[10px] font-bold text-[#0066cc] bg-[#0066cc]/5 px-3 py-1 rounded-full uppercase tracking-wider hover:bg-[#0066cc]/10 transition-all flex items-center gap-1"
                    >
                      {optimizing ? "Optimizing..." : "✨ AI Optimize"}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#86868b] mb-3 leading-tight">
                    <span className="font-semibold">Pro Tip:</span> Bullet points should highlight the problem you solved and the technical challenges you overcame.
                  </p>
                  <textarea
                    className={`${inputClass} h-40 resize-none leading-relaxed p-4 bg-white shadow-inner focus:shadow-none transition-shadow`}
                    value={proj.points?.join('\n')}
                    onChange={(e) => updateProject(i, 'points', e.target.value)}
                    placeholder="• Built a full-stack resume editor resulting in 500+ daily active users&#10;• Implemented robust state management using React hooks"
                  />
                </div>
              </div>
            </div>
            
          </div>
        );
      })}
      
      <button onClick={handleAdd} className={`${secondaryBtn} w-full py-4 border-dashed bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#6e6e73] transition-colors`}>
        + Add Another Project
      </button>
    </div>
  );
};

export default ProjectsTab;
