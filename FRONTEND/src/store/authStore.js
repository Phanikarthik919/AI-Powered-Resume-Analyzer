import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: (user, token) => {
        set({ user, token });
      },

      updateUser: (user) => {
        set({ user: { ...get().user, ...user } });
      },

      logout: () => {
        set({ user: null, token: null });
      },

      isAuthenticated: () => Boolean(get().token),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);

export default useAuthStore;
