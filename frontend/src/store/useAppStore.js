import { create } from 'zustand';

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

const initialToken = localStorage.getItem('vendorbridge_token');
let initialUser = null;

if (initialToken) {
  const payload = decodeToken(initialToken);
  if (payload) {
    initialUser = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      vendorId: payload.vendorId,
      name: payload.name || payload.email,
    };
  } else {
    localStorage.removeItem('vendorbridge_token');
  }
}

export const useAppStore = create((set, get) => ({
  user: initialUser,
  token: initialUser ? initialToken : null,
  notifications: [],

  isAuthenticated: () => {
    const { token, user } = get();
    return !!token && !!user;
  },

  setAuth: ({ user, token }) => {
    localStorage.setItem('vendorbridge_token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('vendorbridge_token');
    set({ user: null, token: null });
  },

  initAuth: () => {
    const token = localStorage.getItem('vendorbridge_token');
    if (!token) {
      set({ user: null, token: null });
      return;
    }
    const payload = decodeToken(token);
    if (!payload) {
      localStorage.removeItem('vendorbridge_token');
      set({ user: null, token: null });
      return;
    }
    set({
      token,
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        vendorId: payload.vendorId,
        name: payload.name || payload.email,
      },
    });
  },

  setNotifications: (notifications) => set({ notifications }),
}));
