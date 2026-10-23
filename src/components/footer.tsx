import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

function Svg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_0.9fr_0.9fr_1.2fr]">
        <div>
          <div>
            <img src="/logo.png" alt="mindfulcareer" className="h-11 w-auto" />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
            Thoughtful career guidance for every student — helping young people explore, plan and achieve brighter futures.
          </p>
          <div className="mt-6 flex gap-3">
            {["facebook", "twitter", "instagram", "linkedin"].map((s) => (
              <a key={s} href="#" aria-label={s}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/80 transition duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-navy">
                <Svg className="h-4 w-4">
                  {s === "facebook" && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />}
                  {s === "twitter" && <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />}
                  {s === "instagram" && <><rect width="20" height="20" x="2" y="2" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></>}
                  {s === "linkedin" && <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v1.5A6 6 0 0 1 16 8z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></>}
                </Svg>
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Platform links">
          <h3 className="font-display text-base font-semibold">Platform</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            {[
              { label: "Career Guidance", to: "/guidance" },
              { label: "Find Counsellors", to: "/counsellors" },
              { label: "Company Partners", to: "/partners" },
              { label: "Contact Us", to: "/contact" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="transition-colors hover:text-gold">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal links">
          <h3 className="font-display text-base font-semibold">Legal</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            {[
              { label: "Terms of Service", to: "/terms" },
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Refund & Cancellation", to: "/refund" },
              { label: "Parental Consent", to: "/parental-consent" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="transition-colors hover:text-gold">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-display text-base font-semibold">Contact</h3>
          <ul className="mt-5 space-y-3.5 text-sm text-white/60">
            <li className="flex items-start gap-3">
              <Svg className="mt-0.5 h-4 w-4 shrink-0 text-gold">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </Svg>
              <span>India (Pan-India service)</span>
            </li>
            <li className="flex items-start gap-3">
              <Svg className="mt-0.5 h-4 w-4 shrink-0 text-gold">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </Svg>
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-start gap-3">
              <Svg className="mt-0.5 h-4 w-4 shrink-0 text-gold">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </Svg>
              <span>hello@mindfulcareer.in</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        Copyright © {new Date().getFullYear()} mindfulcareer. All rights reserved.
      </div>
    </footer>
  );
}
