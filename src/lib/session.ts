export type Role = "user" | "counsellor";

export interface Session {
  role: Role;
  name: string;
  email: string;
  joinedAt: string;
}

export interface Application {
  id: string;
  name: string;
  email: string;
  position: string;
  date: string;
  status?: string;
}

const SESSION_KEY = "mc_session";
const APPLICATIONS_KEY = "mc_applications";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Omit<Session, "joinedAt">): void {
  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ ...session, joinedAt: new Date().toISOString() }),
  );
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getApplications(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(
      window.localStorage.getItem(APPLICATIONS_KEY) ?? "[]",
    ) as Application[];
  } catch {
    return [];
  }
}

export function addApplication(app: {
  name: string;
  email: string;
  position: string;
}): void {
  const list = getApplications();
  list.unshift({
    ...app,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}`,
    date: new Date().toISOString(),
    status: "In review",
  });
  window.localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(list));
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}
