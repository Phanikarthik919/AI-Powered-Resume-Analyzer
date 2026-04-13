import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? "http://localhost:5001" : "https://ai-resume-analyzer-20gi.onrender.com",
  withCredentials: true, //  IMPORTANT for cookies
});

export default API;
