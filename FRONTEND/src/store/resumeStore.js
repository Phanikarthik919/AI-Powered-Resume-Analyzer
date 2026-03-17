import { create } from 'zustand';

export const useResumeStore = create((set) => ({
  resumes: [],          // list of analyzed resumes
  currentResume: null,  // the resume currently being analyzed
  loading: false,
  error: null,

  setResumes: (resumes) => set({ resumes }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  addResume: (resume) =>
    set((state) => ({
      resumes: [resume, ...state.resumes],
      currentResume: resume,
    })),

  setCurrentResume: (resume) => set({ currentResume: resume }),

  clearCurrent: () => set({ currentResume: null }),
}));

export default useResumeStore;
