"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "CUSTOMER" | "STAFF" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, pass: string, portal?: "CUSTOMER" | "STAFF") => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isStaffOrAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  isStaffOrAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check current session on load
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          // Check local storage fallback for offline/demo compatibility
          const cached = localStorage.getItem("khalid3d_user");
          if (cached) {
            setUser(JSON.parse(cached));
          }
        }
      } catch {
        const cached = localStorage.getItem("khalid3d_user");
        if (cached) {
          setUser(JSON.parse(cached));
        }
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email: string, pass: string, portal: "CUSTOMER" | "STAFF" = "CUSTOMER") => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass, portal }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        return { success: false, error: data.error || "Login failed" };
      }
      setUser(data.user);
      localStorage.setItem("khalid3d_user", JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, error: "Network error during authentication" };
    }
  };

  const register = async (name: string, email: string, pass: string, phone?: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: pass, phone }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        return { success: false, error: data.error || "Registration failed" };
      }
      setUser(data.user);
      localStorage.setItem("khalid3d_user", JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, error: "Network error during registration" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem("khalid3d_user");
  };

  const isStaffOrAdmin = user?.role === "STAFF" || user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isStaffOrAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
