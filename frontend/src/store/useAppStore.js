import { create } from 'zustand';

export const useAppStore = create((set) => ({
  user: null,
  token: localStorage.getItem('vendorbridge_token'),
  notifications: [],
  setAuth: ({ user, token }) => {
    localStorage.setItem('vendorbridge_token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('vendorbridge_token');
    set({ user: null, token: null });
  },
}));
