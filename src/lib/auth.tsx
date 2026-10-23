import { createContext, useContext, useState, type ReactNode } from "react";

export type Role = "student" | "counsellor" | "company" | "admin";

export interface MockUser {
  id: string;
  email: string;
  role: Role;
  full_name: string;
}

interface AuthCtx {
  user: MockUser | null;
  loading: boolean;
  signIn: (role: Role) => void;
  signOut: () => void;
}

const MOCK_USERS: Record<Role, MockUser> = {
  student:    { id: "1", email: "student@demo.com",    role: "student",    full_name: "Arjun Sharma" },
  counsellor: { id: "2", email: "counsellor@demo.com", role: "counsellor", full_name: "Dr. Ananya Rao" },
  company:    { id: "3", email: "company@demo.com",    role: "company",    full_name: "TechCorp India" },
  admin:      { id: "4", email: "admin@demo.com",      role: "admin",      full_name: "Admin User" },
};

const Ctx = createContext<AuthCtx>({ user: null, loading: false, signIn: () => {}, signOut: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(() => {
    if (typeof sessionStorage === "undefined") return null;
    const saved = sessionStorage.getItem("mc_user");
    return saved ? (JSON.parse(saved) as MockUser) : null;
  });

  const signIn = (role: Role) => {
    const u = MOCK_USERS[role];
    if (typeof sessionStorage !== "undefined") sessionStorage.setItem("mc_user", JSON.stringify(u));
    setUser(u);
  };

  const signOut = () => {
    if (typeof sessionStorage !== "undefined") sessionStorage.removeItem("mc_user");
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading: false, signIn, signOut }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
