import { create } from "zustand";
import API from "../api/axios";
import toast from "react-hot-toast";

const useResumeStore = create((set) => ({
  resumes: [],
  selectedResume: null,
  loading: false,

  //  Upload Resume
  uploadResume: async (formData, navigate) => {
    try {
      set({ loading: true });

      const res = await API.post("/user-api/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      set({ loading: false });

      toast.success("Resume uploaded successfully");

      // redirect to details page
      const resumeId = res.data.resume._id;
      navigate(`/resume/${resumeId}`);
    } catch (err) {
      set({ loading: false });
      toast.error("Upload failed");
      console.log(err);
    }
  },

  //  Get all resumes (Dashboard)
  getResumes: async () => {
    try {
      set({ loading: true });

      const res = await API.get("/user-api/user-resumes", {
        withCredentials: true,
      });

      set({
        resumes: res.data.payload,
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
      console.log(err);
    }
  },

  //  Get single resume (Details page)
  getResumeById: async (id) => {
    try {
      set({ loading: true });

      const res = await API.get(`/user-api/resume/${id}`, {
        withCredentials: true,
      });

      set({
        selectedResume: res.data.payload,
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
      console.log(err);
    }
  },

  // Clear selected resume (optional)
  clearResume: () => {
    set({ selectedResume: null });
  },
}));

export default useResumeStore;
