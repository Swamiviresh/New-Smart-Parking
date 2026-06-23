import { create } from "zustand";

const TOKEN_KEY = "smart_parking_token";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  rfid_tag: string | null;
}

export type AppView = "landing" | "login" | "dashboard" | "profile";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  view: AppView;

  setView: (view: AppView) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (updater: (prev: User | null) => User | null) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  view: "landing",

  setView: (view) => set({ view }),

  login: async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    set({
      token: data.token,
      user: data.user,
      isAuthenticated: true,
      view: "dashboard",
    });
  },

  register: async (name, email, password) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // Auto-login after registration
    await get().login(email, password);
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      view: "landing",
    });
  },

  setUser: (updater) => {
    const currentUser = get().user;
    set({ user: updater(currentUser) });
  },

  checkAuth: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetch("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Invalid token");
        })
        .then((user) => {
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            view: "dashboard",
          });
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            view: "landing",
          });
        });
    } else {
      set({ isLoading: false, view: "landing" });
    }
  },
}));