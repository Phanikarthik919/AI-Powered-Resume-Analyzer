import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-resume-analyzer-20gi.onrender.com",
  withCredentials: true, //  IMPORTANT for cookies
});

export default API;
