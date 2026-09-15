"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "CUSTOMER" | "STAFF" | "ADMIN";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export const DEMO_USERS: Record<UserRole, DemoUser> = {
  CUSTOMER: {
    id: "demo-customer-id",
    name: "Alex Chen",
    email: "customer@demo.com",
    role: "CUSTOMER",
    phone: "+1 (555) 234-5678",
  },
  STAFF: {
    id: "demo-staff-id",
    name: "Sarah Miller (CAM Engineer)",
    email: "engineer@jlc3dp.demo",
    role: "STAFF",
    phone: "+1 (555) 890-1234",
  },
  ADMIN: {
    id: "demo-admin-id",
    name: "Marcus Vance (Ops Director)",
    email: "admin@jlc3dp.demo",
    role: "ADMIN",
    phone: "+1 (555) 999-0000",
  },
};

interface AuthContextType {
  user: DemoUser;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  isStaffOrAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: DEMO_USERS.CUSTOMER,
  role: "CUSTOMER",
  switchRole: () => {},
  isStaffOrAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>("CUSTOMER");

  useEffect(() => {
    const saved = localStorage.getItem("jlc3dp_role") as UserRole;
    if (saved && DEMO_USERS[saved]) {
      setRole(saved);
    }
  }, []);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem("jlc3dp_role", newRole);
  };

  const user = DEMO_USERS[role];
  const isStaffOrAdmin = role === "STAFF" || role === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, role, switchRole, isStaffOrAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
