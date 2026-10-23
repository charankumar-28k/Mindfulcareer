import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? "";

const isMissingEnv = !supabaseUrl || !supabaseAnonKey;

if (isMissingEnv && typeof window !== "undefined") {
  console.warn(
    "[MINDFULCAREER] Supabase env vars missing.\n" +
    "Create a .env file in the project root with:\n" +
    "  VITE_SUPABASE_URL=https://your-project.supabase.co\n" +
    "  VITE_SUPABASE_ANON_KEY=your-anon-key\n" +
    "Get these from: Supabase Dashboard → Project Settings → API"
  );
}

// Use placeholder URL so createClient doesn't throw — all DB calls will
// simply return errors which are handled gracefully in each component.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
);

export const supabaseReady = !isMissingEnv;

export type Role = "student" | "counsellor" | "company" | "admin";

export interface Profile {
  id: string;
  role: Role;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}
