import { create } from 'zustand';

const loadUser = () => {
  try { return JSON.parse(localStorage.getItem('tmf-user')) || null; }
  catch { return null; }
};

const useAuthStore = create((set, get) => ({
  user: loadUser(),

  login: (name, email) => {
    const user = { name, email };
    localStorage.setItem('tmf-user', JSON.stringify(user));
    set({ user });
  },

  register: (name, email) => {
    const user = { name, email };
    localStorage.setItem('tmf-user', JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('tmf-user');
    set({ user: null });
  },

  updateProfile: (name, email) => {
    const user = { name, email };
    localStorage.setItem('tmf-user', JSON.stringify(user));
    set({ user });
  },

  isLoggedIn: () => get().user !== null,
}));

export default useAuthStore;

