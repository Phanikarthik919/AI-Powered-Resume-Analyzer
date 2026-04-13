import { create } from "zustand";
import API from "../api/axios";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  authChecked: false,

  // LOGIN
  login: async (data) => {
    try {
      set({ loading: true });

      const res = await API.post("/common-api/login", data, {
        withCredentials: true,
      });

      set({
        user: res.data.payload,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  // REGISTER
  register: async (data) => {
    try {
      set({ loading: true });

      const res = await API.post("/user-api/register", data);

      set({ loading: false });

      return res.data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  //Get Profile
  getProfile: async () => {
    try {
      set({ loading: true });

      const res = await API.get("/user-api/profile", {
        withCredentials: true,
      });

      set({
        user: res.data.payload,
        isAuthenticated: true,
        loading: false,
        authChecked: true,
      });
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        authChecked: true,
      });
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      await API.post(
        "/common-api/logout",
        {},
        {
          withCredentials: true,
        },
      );

      set({
        user: null,
        isAuthenticated: false,
        authChecked: true,
      });
    } catch (err) {
      console.log(err);
    }
  },
}));

export default useAuthStore;
