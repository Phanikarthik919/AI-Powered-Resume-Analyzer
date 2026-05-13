import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { getResumeAnalysis, updateResumeData, optimizeSection } from "../services/api";
import ResumePDFTemplate from "../components/ResumePDFTemplate";
import {
  pageWrapper,
  headingClass,
  cardClass,
  primaryBtn,
  secondaryBtn,
  inputClass,
  labelClass,
  mutedText,
  loadingClass,
  errorClass, bodyText
} from "../styles/common";
import toast from "react-hot-toast";

// Modular Editor Components
import PersonalTab from "../components/resume/editor/PersonalTab";
import SummaryTab from "../components/resume/editor/SummaryTab";
import SkillsTab from "../components/resume/editor/SkillsTab";
import ExperienceTab from "../components/resume/editor/ExperienceTab";
import ProjectsTab from "../components/resume/editor/ProjectsTab";
import AchievementsTab from "../components/resume/editor/AchievementsTab";
import EducationTab from "../components/resume/editor/EducationTab";
import SkillModal from "../components/resume/editor/SkillModal";
import OptimizationModal from "../components/resume/editor/OptimizationModal";

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [debouncedData, setDebouncedData] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [optimizationModal, setOptimizationModal] = useState({ show: false, content: "", justification: "", section: "", index: -1 });
  const [newCatName, setNewCatName] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Calculate completion percentage
  const completion = useMemo(() => {
    if (!data) return 0;
    const sections = {
      personal: !!(data.personalInfo?.name && data.personalInfo?.email),
      summary: !!(data.summary?.length > 50),
      skills: !!(Object.keys(data.skills || {}).length > 0),
      experience: !!(data.experience?.length > 0),
      projects: !!(data.projects?.length > 0),
      education: !!(data.education?.length > 0),
    };
    const filled = Object.values(sections).filter(Boolean).length;
    return Math.round((filled / Object.keys(sections).length) * 100);
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getResumeAnalysis(id);
        if (res.payload) {
          setTargetRole(res.payload.targetRole || "");
          setJobDescription(res.payload.jobDescription || "");
          const parsed = res.payload.parsedData || {};
          if (!parsed.achievements) parsed.achievements = [];
          if (!parsed.skills) parsed.skills = {};
          setData(parsed);
          setDebouncedData(parsed);
          setSuggestions(res.payload.aiSuggestions || []);
        }
      } catch (err) {
        setError("Failed to load resume data.");
        toast.error("Error loading resume data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!data) return;
    const timer = setTimeout(() => {
      setDebouncedData(data);
    }, 800);
    return () => clearTimeout(timer);
  }, [data]);

  const resumeDocument = useMemo(() => {
    if (!debouncedData && !data) return null;
    return <ResumePDFTemplate data={debouncedData || data} />;
  }, [debouncedData]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateResumeData(id, data);
      toast.success("Changes saved!");
    } catch (err) {
      toast.error("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={pageWrapper}><p className={loadingClass}>Loading Editor...</p></div>;
  if (error) return <div className={pageWrapper}><p className={errorClass}>{error}</p></div>;
  if (!data) return <div className={pageWrapper}><p className={errorClass}>No data found</p></div>;

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const handleSummaryChange = (e) => {
    setData(prev => ({ ...prev, summary: e.target.value }));
  };

  const handleSkillChange = (category, value) => {
    setData(prev => ({
      ...prev,
      skills: { ...prev.skills, [category]: value.split(',').map(s => s.trim()) }
    }));
  };

  const handleAddSkillCategory = () => {
    if (newCatName?.trim()) {
      setData(prev => ({
        ...prev,
        skills: { ...prev.skills, [newCatName.trim()]: [] }
      }));
      setNewCatName("");
      setShowSkillModal(false);
    }
  };

  const removeSkillCategory = (category) => {
    if (window.confirm(`Delete "${category}"?`)) {
      const newSkills = { ...data.skills };
      delete newSkills[category];
      setData(prev => ({ ...prev, skills: newSkills }));
    }
  };

  const updateExperience = (index, field, value) => {
    const newExp = [...data.experience];
    if (field === 'description') {
      newExp[index][field] = value.split('\n');
    } else {
      newExp[index][field] = value;
    }
    setData(prev => ({ ...prev, experience: newExp }));
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), { title: "", company: "", duration: "", description: [] }]
    }));
  };

  const removeExperience = (index) => {
    const newExp = data.experience.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, experience: newExp }));
  };

  const updateProject = (index, field, value) => {
    const newProjects = [...data.projects];
    if (field === 'techStack') {
      newProjects[index][field] = value.split(',').map(s => s.trim());
    } else if (field === 'points') {
      newProjects[index][field] = value.split('\n');
    } else {
      newProjects[index][field] = value;
    }
    setData(prev => ({ ...prev, projects: newProjects }));
  };

  const addProject = () => {
    setData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), { name: "", techStack: [], points: [], projectLink: "", gitRepo: "" }]
    }));
  };

  const removeProject = (index) => {
    const newProj = data.projects.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, projects: newProj }));
  };

  const updateEducation = (index, field, value) => {
    const newEdu = [...data.education];
    newEdu[index][field] = value;
    setData(prev => ({ ...prev, education: newEdu }));
  };

  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [...(prev.education || []), { degree: "", institution: "", year: "", score: "" }]
    }));
  };

  const removeEducation = (index) => {
    const newEdu = data.education.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, education: newEdu }));
  };

  const handleAchievementsChange = (value) => {
    setData(prev => ({ ...prev, achievements: value.split('\n') }));
  };

  const handleOptimize = async (type, content, index = -1) => {
    if (!content || content.length < 5) return toast.error("Add content first!");
    try {
      setOptimizing(true);
      const res = await optimizeSection(type, content, targetRole, jobDescription);
      if (res.payload) {
        setOptimizationModal({
          show: true,
          content: res.payload.optimizedContent,
          justification: res.payload.justification,
          section: type,
          index: index
        });
      }
    } catch (err) {
      toast.error("Optimization failed.");
    } finally {
      setOptimizing(false);
    }
  };

  const applyOptimization = () => {
    const { section, content, index } = optimizationModal;
    if (section === 'summary') setData(prev => ({ ...prev, summary: content }));
    else if (section === 'experience') {
      const newExp = [...data.experience];
      newExp[index].description = content.split('\n').filter(p => p.trim());
      setData(prev => ({ ...prev, experience: newExp }));
    } else if (section === 'projects') {
      const newProj = [...data.projects];
      newProj[index].points = content.split('\n').filter(p => p.trim());
      setData(prev => ({ ...prev, projects: newProj }));
    }
    setOptimizationModal({ show: false, content: "", justification: "", section: "", index: -1 });
    toast.success("AI suggestion applied!");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#fbfbfd]">
      {/* Dynamic Top Bar */}
      <div className="h-[60px] border-b border-[#e8e8ed] px-6 flex items-center justify-between bg-white/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#f5f5f7] rounded-full transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div className="h-6 w-px bg-[#e8e8ed]" />
          <div className="flex flex-col">
            <h1 className="text-[14px] font-semibold text-[#1d1d1f]">Resume Intelligence Editor</h1>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1 bg-[#e8e8ed] rounded-full overflow-hidden">
                <div className="h-full bg-[#0066cc] transition-all duration-1000" style={{ width: `${completion}%` }} />
              </div>
              <span className="text-[10px] font-bold text-[#6e6e73]">{completion}% Complete</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
            {saving ? (
              <span className="flex items-center gap-2 text-[11px] text-[#0066cc] font-medium animate-pulse">
                <div className="w-1.5 h-1.5 bg-[#0066cc] rounded-full" /> Auto-saving...
              </span>
            ) : (
              <span className="text-[11px] text-[#34c759] font-medium flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> Saved
              </span>
            )}
          </div>
          <PDFDownloadLink
            document={resumeDocument}
            fileName={`${data.personalInfo?.name || 'Resume'}_Optimized.pdf`}
            className="bg-[#1d1d1f] text-white text-[12px] font-semibold px-5 py-2.5 rounded-full hover:bg-black transition-all flex items-center gap-2"
          >
            {({ loading }) => (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                {loading ? "Preparing..." : "Export PDF"}
              </>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Step 1: Vertical Sidebar Navigation */}
        <aside className="w-[240px] bg-white border-r border-[#e8e8ed] flex flex-col z-10">
          <div className="p-4 flex-1 overflow-y-auto space-y-1">
            {[
              { id: 'personal', label: 'Personal Details', icon: '👤' },
              { id: 'summary', label: 'Professional Summary', icon: '📝' },
              { id: 'skills', label: 'Skills & Expertise', icon: '⚡' },
              { id: 'experience', label: 'Work Experience', icon: '💼' },
              { id: 'projects', label: 'Key Projects', icon: '🚀' },
              { id: 'achievements', label: 'Achievements', icon: '🏆' },
              { id: 'education', label: 'Education', icon: '🎓' },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all ${
                  activeTab === section.id 
                    ? "bg-[#0066cc]/5 text-[#0066cc] shadow-[inset_0_0_0_1px_rgba(0,102,204,0.1)]" 
                    : "text-[#6e6e73] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
                }`}
              >
                <span className="text-base">{section.icon}</span>
                {section.label}
                {activeTab === section.id && <div className="ml-auto w-1.5 h-1.5 bg-[#0066cc] rounded-full" />}
              </button>
            ))}
          </div>
          
          {/* AI Assist Quick Access */}
          <div className="p-4 border-t border-[#e8e8ed] bg-[#fbfbfd]">
            <div className="bg-[#1d1d1f] rounded-2xl p-4 text-white">
              <h4 className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-2">AI Assistant</h4>
              <p className="text-[12px] leading-relaxed mb-3">Improve your resume with one click.</p>
              <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-[11px] font-bold transition-all">
                ✨ Fix All Issues
              </button>
            </div>
          </div>
        </aside>

        {/* Step 2: Main Editor Area */}
        <main className="flex-1 overflow-y-auto bg-white p-10 custom-scrollbar relative">
          <div className="max-w-[700px] mx-auto">
            <header className="mb-10">
              <span className="text-[11px] font-bold text-[#0066cc] uppercase tracking-widest">Section {["personal", "summary", "skills", "experience", "projects", "achievements", "education"].indexOf(activeTab) + 1} of 7</span>
              <h2 className="text-3xl font-bold text-[#1d1d1f] mt-2 capitalize">{activeTab.replace('-', ' ')}</h2>
            </header>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {activeTab === 'personal' && <PersonalTab personalInfo={data.personalInfo} handlePersonalChange={handlePersonalChange} labelClass={labelClass} inputClass={inputClass} />}
              {activeTab === 'summary' && <SummaryTab summary={data.summary} handleSummaryChange={handleSummaryChange} handleOptimize={handleOptimize} optimizing={optimizing} labelClass={labelClass} inputClass={inputClass} />}
              {activeTab === 'skills' && <SkillsTab skills={data.skills} handleSkillChange={handleSkillChange} removeSkillCategory={removeSkillCategory} setShowSkillModal={setShowSkillModal} labelClass={labelClass} inputClass={inputClass} />}
              {activeTab === 'experience' && <ExperienceTab experience={data.experience} updateExperience={updateExperience} removeExperience={removeExperience} addExperience={addExperience} handleOptimize={handleOptimize} optimizing={optimizing} labelClass={labelClass} inputClass={inputClass} secondaryBtn={secondaryBtn} />}
              {activeTab === 'projects' && <ProjectsTab projects={data.projects} updateProject={updateProject} removeProject={removeProject} addProject={addProject} handleOptimize={handleOptimize} optimizing={optimizing} labelClass={labelClass} inputClass={inputClass} secondaryBtn={secondaryBtn} />}
              {activeTab === 'achievements' && <AchievementsTab achievements={data.achievements} handleAchievementsChange={handleAchievementsChange} labelClass={labelClass} inputClass={inputClass} />}
              {activeTab === 'education' && <EducationTab education={data.education} updateEducation={updateEducation} removeEducation={removeEducation} addEducation={addEducation} labelClass={labelClass} inputClass={inputClass} secondaryBtn={secondaryBtn} />}
            </div>

            {/* Floating Navigation Controls */}
            <div className="mt-20 pt-10 border-t border-[#e8e8ed] flex justify-between items-center pb-20">
              <button
                disabled={activeTab === 'personal'}
                onClick={() => {
                  const tabs = ["personal", "summary", "skills", "experience", "projects", "achievements", "education"];
                  setActiveTab(tabs[tabs.indexOf(activeTab) - 1]);
                }}
                className="flex items-center gap-2 text-[13px] font-bold text-[#6e6e73] hover:text-[#1d1d1f] disabled:opacity-30 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  const tabs = ["personal", "summary", "skills", "experience", "projects", "achievements", "education"];
                  const idx = tabs.indexOf(activeTab);
                  if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
                  else handleSave();
                }}
                className="bg-[#0066cc] text-white px-8 py-3 rounded-full text-[13px] font-bold shadow-lg shadow-[#0066cc]/20 hover:scale-105 active:scale-95 transition-all"
              >
                {activeTab === 'education' ? 'Save & Finalize' : 'Next Section →'}
              </button>
            </div>
          </div>
        </main>

        {/* Step 3: Interactive Live Preview (Right Side) */}
        <section className="w-[500px] bg-[#f5f5f7] border-l border-[#e8e8ed] flex flex-col relative">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white shadow-sm border border-[#e8e8ed] px-3 py-1.5 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#34c759] rounded-full" />
            <span className="text-[10px] font-bold text-[#1d1d1f] uppercase tracking-wider">Live Preview</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-10 flex flex-col items-center custom-scrollbar">
            <div className="w-[400px] min-h-[560px] bg-white shadow-2xl rounded-sm transform origin-top transition-transform duration-500 hover:scale-[1.02]">
              <PDFViewer
                width="100%"
                height="560px"
                showToolbar={false}
                className="border-none"
              >
                {resumeDocument}
              </PDFViewer>
            </div>
            
            <div className="mt-8 bg-white/50 backdrop-blur-sm border border-white p-4 rounded-2xl max-w-[360px]">
              <h5 className="text-[11px] font-bold text-[#1d1d1f] mb-1">Editor Pro-Tip</h5>
              <p className="text-[11px] text-[#6e6e73] leading-relaxed">
                Your resume is automatically updated as you type. Use the <span className="text-[#0066cc] font-bold">Export PDF</span> button when you're ready to apply.
              </p>
            </div>
          </div>
        </section>
      </div>
      <SkillModal 
        showSkillModal={showSkillModal}
        setShowSkillModal={setShowSkillModal}
        newCatName={newCatName}
        setNewCatName={setNewCatName}
        handleAddSkillCategory={handleAddSkillCategory}
        inputClass={inputClass}
        primaryBtn={primaryBtn}
        secondaryBtn={secondaryBtn}
      />

      <OptimizationModal 
        optimizationModal={optimizationModal}
        setOptimizationModal={setOptimizationModal}
        applyOptimization={applyOptimization}
        inputClass={inputClass}
        primaryBtn={primaryBtn}
        secondaryBtn={secondaryBtn}
      />
    </div>
  );
}
