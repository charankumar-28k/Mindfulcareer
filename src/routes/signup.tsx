import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { useAuth, type Role } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [{ title: "Create Account — MINDFULCAREER" }],
  }),
});

const ROLES: { value: Role; label: string; desc: string; icon: ReactNode; color: string }[] = [
  {
    value: "student",
    label: "Student",
    desc: "Get free guidance, book counsellors, browse opportunities.",
    color: "#1565c0",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-9 w-9" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#e8f0fe"/>
        <path d="M20 10 L32 16 L20 22 L8 16 Z" fill="#1565c0"/>
        <path d="M12 18.5 L12 26 Q20 30 28 26 L28 18.5" stroke="#1565c0" strokeWidth="2" fill="#bbdefb" strokeLinejoin="round"/>
        <rect x="30" y="16" width="2.5" height="8" rx="1.25" fill="#1565c0"/>
        <circle cx="31.25" cy="25.5" r="1.5" fill="#FCA311"/>
      </svg>
    ),
  },
  {
    value: "counsellor",
    label: "Counsellor",
    desc: "Offer paid sessions, manage availability and earnings.",
    color: "#1a7c2e",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-9 w-9" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#e8f5e9"/>
        <circle cx="20" cy="15" r="5" fill="#1a7c2e"/>
        <path d="M10 30 Q10 23 20 23 Q30 23 30 30" fill="#a5d6a7" />
        <path d="M26 19 L29 16 M29 16 L32 19 M29 16 L29 22" stroke="#FCA311" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    value: "company",
    label: "Company",
    desc: "Post jobs, internships and programs for students.",
    color: "#14213D",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-9 w-9" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#e8eaf6"/>
        <rect x="10" y="18" width="20" height="13" rx="1.5" fill="#14213D"/>
        <rect x="15" y="13" width="10" height="7" rx="1.5" fill="#3949ab"/>
        <rect x="17" y="22" width="6" height="5" rx="1" fill="#FCA311"/>
        <rect x="13" y="21" width="3" height="3" rx="0.5" fill="white" opacity="0.7"/>
        <rect x="24" y="21" width="3" height="3" rx="0.5" fill="white" opacity="0.7"/>
      </svg>
    ),
  },
];

function SignupPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [role, setRole] = useState<Role>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setTimeout(() => {
      signIn(role);
      if (role === "counsellor") navigate({ to: "/counsellor/dashboard" });
      else if (role === "company") navigate({ to: "/company/dashboard" });
      else navigate({ to: "/student/dashboard" });
      setLoading(false);
    }, 600);
  };

  const inputClass = "w-full rounded-2xl border border-steel bg-steel/50 px-5 py-3.5 text-sm text-navy outline-none transition placeholder:text-muted-foreground focus:border-gold focus:bg-white focus:ring-2 focus:ring-gold/40";

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <SiteNav />
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-lg">
          <h1 className="font-display text-3xl font-bold text-navy">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join MINDFULCAREER — it's free for students.</p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {ROLES.map((r) => (
              <button key={r.value} type="button" onClick={() => setRole(r.value)}
                className={`group relative rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                  role === r.value
                    ? "border-gold bg-gold/10 shadow-[0_4px_20px_-6px_rgba(252,163,17,0.4)]"
                    : "border-steel bg-white hover:border-navy hover:shadow-md"
                }`}>
                {role === r.value && (
                  <span className="absolute top-2.5 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold">
                    <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#14213D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
                <div className="mb-3">{r.icon}</div>
                <p className="font-display text-sm font-bold text-navy">{r.label}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{r.desc}</p>
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 rounded-2xl bg-red-50 px-5 py-3 text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name" autoComplete="name" className={inputClass} />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address" autoComplete="email" className={inputClass} />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 8 characters)" autoComplete="new-password" className={inputClass} />
            <button type="submit" disabled={loading}
              className="w-full rounded-full bg-gold py-3.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-navy transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(252,163,17,0.7)] disabled:opacity-50">
              {loading ? "Creating account…" : `Create ${role} account`}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4">Sign in</Link>
          </p>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            By signing up you agree to our{" "}
            <Link to="/terms" className="underline">Terms</Link> and{" "}
            <Link to="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}
