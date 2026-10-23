import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";

function Svg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Guidance", to: "/guidance" },
  { label: "Counsellors", to: "/counsellors" },
  { label: "Partners", to: "/partners" },
  { label: "Contact", to: "/contact" },
];

const BRAND_MARK = (
  <img src="/logo.png" alt="mindfulcareer" style={{ height: "70px", width: "auto" }} className="shrink-0 object-contain" />
);

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isGuidance = location.pathname === "/guidance";

  const dashboardTo =
    user?.role === "counsellor" ? "/counsellor/dashboard"
    : user?.role === "company" ? "/company/dashboard"
    : user?.role === "admin" ? "/admin"
    : "/student/dashboard";

  const handleSignOut = () => {
    signOut();
    setMenuOpen(false);
    navigate({ to: "/login" });
  };

  const linkClass =
    "relative text-sm font-medium text-white/70 transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gold after:transition-all after:duration-300 hover:text-white hover:after:w-full";

  return (
    <>
      <header className="sticky top-0 z-50 bg-navy shadow-md" style={{ height: "59px" }}>
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center">
            {BRAND_MARK}
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link
                  to={dashboardTo}
                  className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-gold hover:text-gold"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gold font-display text-xs font-bold text-navy">
                    {(user.full_name ?? "U")[0]?.toUpperCase()}
                  </span>
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-gold hover:text-gold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass}>Login</Link>
                <Link
                  to="/guidance"
                  className="rounded-full bg-gold px-5 py-2.5 font-display text-sm font-bold text-navy transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(252,163,17,0.7)]"
                >
                  Start free guidance
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
          >
            <Svg className="h-6 w-6">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </Svg>
          </button>
        </div>

        {menuOpen && (
          <nav aria-label="Mobile" className="border-t border-white/10 px-4 pb-5 pt-3 md:hidden">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {user ? (
              <div className="mt-3 flex gap-2 border-t border-white/10 pt-4">
                <Link
                  to={dashboardTo}
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-full border border-white/20 py-2.5 text-center text-sm font-medium text-white transition hover:border-gold hover:text-gold"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex-1 rounded-full border border-white/20 py-2.5 text-sm font-medium text-white/70 transition hover:border-gold hover:text-gold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-4">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-full border border-white/25 py-2.5 text-center text-sm font-semibold text-white transition hover:border-gold hover:text-gold"
                >
                  Login
                </Link>
                <Link
                  to="/guidance"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-full bg-gold py-2.5 text-center font-display text-sm font-bold text-navy"
                >
                  Start free guidance
                </Link>
              </div>
            )}
          </nav>
        )}
      </header>

      {/* Floating robot button — hidden on /guidance */}
      {!isGuidance && (
        <Link
          to="/guidance"
          aria-label="Open career guidance chatbot"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-navy shadow-[0_8px_30px_-8px_rgba(20,33,61,0.6)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-8px_rgba(20,33,61,0.7)]"
        >
          <RobotIcon />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold">
            <span className="h-2 w-2 animate-ping rounded-full bg-gold opacity-75" />
          </span>
        </Link>
      )}
    </>
  );
}

function RobotIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8" aria-hidden="true">
      <rect x="10" y="14" width="20" height="16" rx="4" fill="#FCA311" />
      <rect x="14" y="18" width="4" height="4" rx="1" fill="#14213D" />
      <rect x="22" y="18" width="4" height="4" rx="1" fill="#14213D" />
      <rect x="16" y="24" width="8" height="2" rx="1" fill="#14213D" />
      <rect x="18" y="8" width="4" height="6" rx="2" fill="#FCA311" />
      <circle cx="20" cy="7" r="2" fill="#FCA311" />
      <rect x="6" y="18" width="4" height="6" rx="2" fill="#FCA311" />
      <rect x="30" y="18" width="4" height="6" rx="2" fill="#FCA311" />
    </svg>
  );
}

export { RobotIcon };
