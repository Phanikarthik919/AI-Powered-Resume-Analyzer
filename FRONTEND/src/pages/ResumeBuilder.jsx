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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getResumeAnalysis(id);
        if (res.payload) {
          setTargetRole(res.payload.targetRole || "");
          setJobDescription(res.payload.jobDescription || "");
          const parsed = res.payload.parsedData || {};
          // Ensure achievements is an array
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

  // Sync data to debouncedData with a delay
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
      toast.success("Resume changes saved successfully!");
    } catch (err) {
      toast.error("Failed to save changes: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={pageWrapper}><p className={loadingClass}>Preparing your editor...</p></div>;
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

  // ── Skills Management ──────────────────────────────────────
  const handleSkillChange = (category, value) => {
    setData(prev => ({
      ...prev,
      skills: { ...prev.skills, [category]: value.split(',').map(s => s.trim()) }
    }));
  };

  const handleAddSkillCategory = () => {
    if (newCatName && newCatName.trim()) {
      setData(prev => ({
        ...prev,
        skills: { ...prev.skills, [newCatName.trim()]: [] }
      }));
      setNewCatName("");
      setShowSkillModal(false);
      toast.success("New category added!");
    }
  };

  const removeSkillCategory = (category) => {
    if (window.confirm(`Delete the "${category}" skill category?`)) {
      const newSkills = { ...data.skills };
      delete newSkills[category];
      setData(prev => ({ ...prev, skills: newSkills }));
    }
  };

  // ── Experience Management ──────────────────────────────────
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

  // ── Projects Management ────────────────────────────────────
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

  // ── Education Management ───────────────────────────────────
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

  // ── Achievements Management ────────────────────────────────
  const handleAchievementsChange = (value) => {
    setData(prev => ({ ...prev, achievements: value.split('\n') }));
  };

  // ── AI Optimization Handling ────────────────────────────────
  const handleOptimize = async (type, content, index = -1) => {
    if (!content || content.length < 5) {
      toast.error("Add some content first before optimizing!");
      return;
    }

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
      console.error("Optimization error:", err);
      toast.error("Optimization failed. Please try again.");
    } finally {
      setOptimizing(false);
    }
  };

  const applyOptimization = () => {
    const { section, content, index } = optimizationModal;
    if (section === 'summary') {
      setData(prev => ({ ...prev, summary: content }));
    } else if (section === 'experience') {
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
    <div className="flex flex-col h-[calc(100vh-52px)] overflow-hidden bg-white">
      {/* Top Bar */}
      <div className="h-14 border-b border-[#e8e8ed] px-6 flex items-center justify-between bg-white z-10 transition-shadow duration-300">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-[#6e6e73] hover:text-[#1d1d1f] font-medium transition-colors">
            ← Back
          </button>
          <div className="h-4 w-px bg-[#e8e8ed]" />
          <h1 className="font-semibold text-[#1d1d1f] tracking-tight">Resume Builder</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`${secondaryBtn} border-[#0066cc] text-[#0066cc] hover:bg-[#0066cc]/5 px-6! transition-all`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <PDFDownloadLink
            document={resumeDocument}
            fileName={`${data.personalInfo?.name || 'Resume'}_Optimized.pdf`}
            className={`${primaryBtn} shadow-lg shadow-[#0066cc]/20 hover:scale-105 active:scale-95 transition-all`}
          >
            {({ loading }) => (loading ? "Generating..." : "Download PDF")}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Editor */}
        <div className="w-1/2 overflow-y-auto border-r border-[#e8e8ed] p-8 space-y-8 custom-scrollbar bg-white">

          {/* AI Suggestions Callout */}
          {suggestions.length > 0 && (
            <div className="bg-[#0066cc]/5 border border-[#0066cc]/10 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#0066cc]/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:w-28 group-hover:h-28" />
              <h2 className="text-xs font-bold text-[#0066cc] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="text-base">✨</span> AI Improvement Tips
              </h2>
              <ul className="space-y-3">
                {suggestions.map((s, i) => (
                  <li key={i} className="text-[13px] text-[#1d1d1f] flex gap-3 leading-relaxed">
                    <span className="text-[#0066cc] font-bold">•</span>
                    <span className="opacity-90">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex gap-6 border-b border-[#e8e8ed] overflow-x-auto pb-px custom-scrollbar-hide">
            {["personal", "summary", "skills", "experience", "projects", "achievements", "education"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[11px] font-bold uppercase tracking-[0.15em] pb-3 px-1 transition-all relative whitespace-nowrap ${activeTab === tab ? "text-[#0066cc]" : "text-[#a1a1a6] hover:text-[#1d1d1f]"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066cc] animate-in fade-in zoom-in-95" />
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeTab === 'personal' && (
              <PersonalTab 
                personalInfo={data.personalInfo} 
                handlePersonalChange={handlePersonalChange} 
                labelClass={labelClass} 
                inputClass={inputClass} 
              />
            )}

            {activeTab === 'summary' && (
              <SummaryTab 
                summary={data.summary} 
                handleSummaryChange={handleSummaryChange} 
                handleOptimize={handleOptimize} 
                optimizing={optimizing} 
                labelClass={labelClass} 
                inputClass={inputClass} 
              />
            )}

            {activeTab === 'skills' && (
              <SkillsTab 
                skills={data.skills} 
                handleSkillChange={handleSkillChange} 
                removeSkillCategory={removeSkillCategory} 
                setShowSkillModal={setShowSkillModal} 
                labelClass={labelClass} 
                inputClass={inputClass} 
              />
            )}

            {activeTab === 'experience' && (
              <ExperienceTab 
                experience={data.experience} 
                updateExperience={updateExperience} 
                removeExperience={removeExperience} 
                addExperience={addExperience} 
                handleOptimize={handleOptimize} 
                optimizing={optimizing} 
                labelClass={labelClass} 
                inputClass={inputClass} 
                secondaryBtn={secondaryBtn}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsTab 
                projects={data.projects} 
                updateProject={updateProject} 
                removeProject={removeProject} 
                addProject={addProject} 
                handleOptimize={handleOptimize} 
                optimizing={optimizing} 
                labelClass={labelClass} 
                inputClass={inputClass} 
                secondaryBtn={secondaryBtn}
              />
            )}

            {activeTab === 'achievements' && (
              <AchievementsTab 
                achievements={data.achievements} 
                handleAchievementsChange={handleAchievementsChange} 
                labelClass={labelClass} 
                inputClass={inputClass} 
              />
            )}

            {activeTab === 'education' && (
              <EducationTab 
                education={data.education} 
                updateEducation={updateEducation} 
                removeEducation={removeEducation} 
                addEducation={addEducation} 
                labelClass={labelClass} 
                inputClass={inputClass} 
                secondaryBtn={secondaryBtn}
              />
            )}

          </div>
        </div>

        {/* Right Panel: Preview */}
        <div className="w-1/2 bg-[#f5f5f7] flex flex-col items-center justify-start p-12 overflow-y-auto custom-scrollbar relative">
          <div className="w-[595px] min-h-[842px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden flex flex-col z-10 sticky top-0 transform-gpu transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)]">
            <PDFViewer
              width="100%"
              height="842px"
              showToolbar={false}
              className="border-none"
              style={{
                border: 'none',
                backgroundColor: 'white',
                // This targets the internal iframe contents to remove background
                WebkitFilter: 'brightness(1.02)'
              }}
            >
              {resumeDocument}
            </PDFViewer>
          </div>

          {/* Subtle Page Background Decoration */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden flex items-center justify-center">
            <div className="w-[800px] h-[800px] border-[100px] border-[#0066cc] rounded-full blur-[120px]" />
          </div>
        </div>
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
