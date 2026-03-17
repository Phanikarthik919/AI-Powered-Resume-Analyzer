import React from 'react';

const ProjectsTab = ({ projects, updateProject, removeProject, addProject, handleOptimize, optimizing, labelClass, inputClass, secondaryBtn }) => {
  return (
    <div className="space-y-8">
      {projects?.map((proj, i) => (
        <div key={i} className="p-6 bg-[#f5f5f7] rounded-2xl relative border border-[#e8e8ed] group">
          <button onClick={() => removeProject(i)} className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-[#e8e8ed] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[#ff3b30]">×</button>
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label className={labelClass}>Project Name</label>
              <input className={inputClass} value={proj.name} onChange={(e) => updateProject(i, 'name', e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Tech Stack (comma separated)</label>
              <input className={inputClass} value={proj.techStack?.join(', ')} onChange={(e) => updateProject(i, 'techStack', e.target.value)} />
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
                <label className={labelClass}>Description / Achievements (one bullet per line)</label>
                <button
                  onClick={() => handleOptimize('projects', proj.points?.join('\n'), i)}
                  disabled={optimizing}
                  className="text-[10px] font-bold text-[#0066cc] bg-[#0066cc]/5 px-3 py-1 rounded-full uppercase tracking-wider hover:bg-[#0066cc]/10 transition-all flex items-center gap-1"
                >
                  {optimizing ? "Optimizing..." : "✨ AI Optimize"}
                </button>
              </div>
              <textarea
                className={`${inputClass} h-40 resize-none leading-relaxed p-4 bg-white`}
                value={proj.points?.join('\n')}
                onChange={(e) => updateProject(i, 'points', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      <button onClick={addProject} className={`${secondaryBtn} w-full py-4 border-dashed bg-[#f5f5f7] text-[#6e6e73]`}>
        + Add Project entry
      </button>
    </div>
  );
};

export default ProjectsTab;
