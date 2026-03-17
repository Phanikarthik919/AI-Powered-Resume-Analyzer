import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

// ─── Auth ──────────────────────────────────────────────────────────

export const loginUser = ({ email, password }) =>
  api.post('/common-api/login', { email, password });

export const registerUser = ({ name, email, password }) =>
  api.post('/user-api/register', { name, email, password });

export const logoutUser = () =>
  api.get('/common-api/logout');

// ─── Resume ────────────────────────────────────────────────────────

export const uploadResume = (file, resumeName, targetRole, jobDescription = "") => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('resumeName', resumeName);
  formData.append('targetRole', targetRole);
  formData.append('jobDescription', jobDescription);

  return api.post('/user-api/upload-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getResumeHistory = () =>
  api.get('/user-api/user-resumes');

export const getResumeAnalysis = (resumeId) =>
  api.get(`/user-api/resume/${resumeId}`);

export const updateResumeData = (resumeId, parsedData) =>
  api.put(`/user-api/update-resume/${resumeId}`, { parsedData });

export const optimizeSection = (sectionType, content, targetRole, jobDescription) =>
  api.post("/user-api/optimize-section", { sectionType, content, targetRole, jobDescription });

export const downloadResume = (resumeId) =>
  api.get(`/user-api/resume/${resumeId}/download`, { responseType: 'blob' });

// ─── Profile ────────────────────────────────────────────────────────

export const getProfile = () =>
  api.get('/user-api/profile');

export const updateProfile = ({ name, email }) =>
  api.patch('/user-api/update-profile', { name, email });

export const changePassword = ({ oldPassword, newPassword }) =>
  api.put('/common-api/change-password', { currentPassword: oldPassword, newPassword, confirmNewPassword: newPassword });

export default api;
