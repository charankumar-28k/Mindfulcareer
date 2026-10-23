import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { useAuth, type Role } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign In — MINDFULCAREER" },
      { name: "description", content: "Sign in to your MINDFULCAREER account." },
    ],
  }),
});

type Portal = Role;

const PORTALS: { value: Portal; label: string; desc: string; icon: string; color: string; bg: string; email: string; password: string }[] = [
  { value: "student",    label: "Student",    desc: "Access guidance reports & book sessions",  icon: "🎓", color: "#1565c0", bg: "#e8f0fe", email: "student@demo.com",    password: "Student@123" },
  { value: "counsellor", label: "Counsellor", desc: "Manage bookings & availability",           icon: "🧑‍💼", color: "#1a7c2e", bg: "#e8f5e9", email: "counsellor@demo.com", password: "Counsellor@123" },
  { value: "company",    label: "Company",    desc: "Post opportunities & track applicants",    icon: "🏢", color: "#14213D", bg: "#e8eaf6", email: "company@demo.com",    password: "Company@123" },
  { value: "admin",      label: "Admin",      desc: "Manage platform & approvals",              icon: "⚙️", color: "#b71c1c", bg: "#ffebee", email: "admin@demo.com",      password: "Admin@123" },
];

function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [portal, setPortal] = useState<Portal>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const active = PORTALS.find((p) => p.value === portal)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (email === active.email && password === active.password) {
        signIn(portal);
        if (portal === "admin") navigate({ to: "/admin" });
        else if (portal === "counsellor") navigate({ to: "/counsellor/dashboard" });
        else if (portal === "company") navigate({ to: "/company/dashboard" });
        else navigate({ to: "/student/dashboard" });
      } else {
        setError("Invalid credentials. Use the demo credentials shown below.");
      }
      setLoading(false);
    }, 600);
  };

  const inputClass = "w-full rounded-2xl border border-steel bg-steel/50 px-5 py-3.5 text-sm text-navy outline-none transition placeholder:text-muted-foreground focus:border-gold focus:bg-white focus:ring-2 focus:ring-gold/40";

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <SiteNav />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6">

        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-navy">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Select your portal and sign in</p>
        </div>

        {/* Portal selector */}
        <div className="mb-8 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {PORTALS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => { setPortal(p.value); setError(""); setEmail(""); setPassword(""); }}
              className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-center transition-all duration-200 ${
                portal === p.value
                  ? "border-gold shadow-[0_4px_20px_-6px_rgba(252,163,17,0.5)]"
                  : "border-steel bg-white hover:border-navy/30 hover:shadow-md"
              }`}
              style={{ background: portal === p.value ? p.bg : "white" }}
            >
              {portal === p.value && (
                <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold">
                  <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#14213D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
              <span className="text-3xl">{p.icon}</span>
              <span className="font-display text-sm font-bold" style={{ color: p.color }}>{p.label}</span>
              <span className="text-[10px] leading-tight text-muted-foreground">{p.desc}</span>
            </button>
          ))}
        </div>

        {/* Login form */}
        <div className="w-full max-w-md rounded-3xl border border-steel bg-white p-8 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-2xl">{active.icon}</span>
            <div>
              <h2 className="font-display text-lg font-bold text-navy">{active.label} Portal</h2>
              <p className="text-xs text-muted-foreground">{active.desc}</p>
            </div>
          </div>

          {/* Demo hint */}
          <div className="mb-4 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-3 text-xs text-amber-800">
            <span className="font-bold">Demo credentials</span> —{" "}
            <button type="button" className="underline font-mono" onClick={() => { setEmail(active.email); setPassword(active.password); }}>
              click to autofill
            </button>
            <div className="mt-1 font-mono">{active.email} / {active.password}</div>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl bg-red-50 px-5 py-3 text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" autoComplete="email" className={inputClass} />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" autoComplete="current-password" className={inputClass} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded-full bg-gold py-3.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-navy transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(252,163,17,0.7)] disabled:opacity-50">
              {loading ? "Signing in…" : `Sign in as ${active.label}`}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 transition hover:text-navy/80">
              Sign up free
            </Link>
          </p>
        </div>

      </main>
    </div>
  );
}
