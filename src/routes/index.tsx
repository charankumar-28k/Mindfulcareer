import { createFileRoute, Link } from "@tanstack/react-router";
import { type CSSProperties, type ReactNode, useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";
import heroImg from "@/assets/hero-careers.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "MINDFULCAREER — Career Guidance & Paid Counselling" },
      { name: "description", content: "Free AI career guidance chatbot, paid 1-to-1 counselling sessions, and company partnerships for students across India." },
    ],
  }),
});

function Svg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

const PATHS = [
  { id: "after12", label: "After 12th", img: "/after 12.jpg", desc: "Stream selection, entrance exams, college admissions and career mapping after Class 12." },
  { id: "higher", label: "Higher Study", img: "/higher studies.jpg", desc: "Masters, MBA, PhD, study abroad — plan your postgraduate journey with expert guidance." },
  { id: "govt", label: "Govt Job", img: "/govt jobs.jpg", desc: "UPSC, SSC, banking, railways — structured preparation plans for government exams." },
  { id: "employment", label: "Employment", img: "/employment.jpg", desc: "Resume, skills, interviews — land your first or next job with a clear action plan." },
  { id: "entrepreneur", label: "Entrepreneur", img: "/enterpuerner.jpg", desc: "Validate your idea, find funding, build your team — start your entrepreneurial journey." },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Take the free chatbot", desc: "Answer guided questions about your background, goals and interests. No login needed." },
  { step: "02", title: "Get your PDF report", desc: "Receive a personalised career report with a 30-60-90 day action plan and resources." },
  { step: "03", title: "Book a counsellor", desc: "Choose a specialist matched to your path, pick a slot and pay securely online." },
  { step: "04", title: "Attend your session", desc: "Meet your counsellor via video call. Notes and recordings saved to your dashboard." },
];

const STATS = [
  { value: "12,000+", label: "Students guided" },
  { value: "200+", label: "Expert counsellors" },
  { value: "150+", label: "Company partners" },
  { value: "4.9/5", label: "Average rating" },
];

const revealDelay = (i: number) => ({ "--reveal-delay": `${i * 90}ms` }) as CSSProperties;

function HomePage() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav />

      {/* Hero */}
      <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden md:min-h-[680px]">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-scrim absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <span className="inline-block rounded-full bg-gold px-5 py-1.5 font-display text-[11px] font-bold tracking-[0.2em] text-navy">
            FREE CAREER GUIDANCE
          </span>
          <h1 className="hero-title mt-6 font-display text-5xl font-bold leading-tight text-white md:text-7xl">
            Your Career,<br />
            <span className="text-gold">Your Choice.</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-white/80 md:text-lg">
            AI-powered guidance chatbot, expert counsellors, and company partnerships — all in one place for students across India.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/guidance"
              className="rounded-full bg-gold px-8 py-3.5 font-display text-sm font-bold text-navy transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(252,163,17,0.7)]"
            >
              Start free guidance →
            </Link>
            <Link
              to="/counsellors"
              className="rounded-full border-2 border-white/40 px-8 py-3.5 font-display text-sm font-bold text-white transition duration-300 hover:border-gold hover:text-gold"
            >
              Find a counsellor
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-navy py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} data-reveal style={revealDelay(i)} className="text-center">
              <p className="font-display text-3xl font-bold text-gold">{s.value}</p>
              <p className="mt-1 text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Five paths */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center" data-reveal>
            <span className="inline-block rounded-full border border-steel px-5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-navy">
              FIVE CAREER PATHS
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold text-navy md:text-4xl">
              Where are you headed?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Choose your path and get a personalised guidance report in minutes — completely free.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PATHS.map((path, i) => (
              <Link
                key={path.id}
                to="/guidance"
                data-reveal
                style={revealDelay(i)}
                className="group flex flex-col rounded-3xl border border-steel bg-white p-7 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)] transition duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-[0_24px_44px_-18px_rgba(20,33,61,0.3)]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-steel/40 p-2">
                  <img
                    src={path.img}
                    alt={path.label}
                    className="h-full w-full object-contain"
                  />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-navy">{path.label}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">{path.desc}</p>
                <span className="mt-5 self-start rounded-full bg-steel px-4 py-1.5 text-[11px] font-semibold text-navy transition duration-300 group-hover:bg-gold">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-steel py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center" data-reveal>
            <span className="inline-block rounded-full border border-navy/15 bg-white px-5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-navy">
              HOW IT WORKS
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold text-navy md:text-4xl">
              From chatbot to counsellor in 4 steps
            </h2>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} data-reveal style={revealDelay(i)}
                className="relative rounded-3xl bg-white p-8 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)] transition duration-300 hover:-translate-y-1.5">
                <span className="font-display text-5xl font-bold text-steel">{step.step}</span>
                <h3 className="mt-4 font-display text-base font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center" data-reveal>
            <Link
              to="/guidance"
              className="inline-block rounded-full bg-navy px-10 py-4 font-display text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(20,33,61,0.5)]"
            >
              Start your free guidance now
            </Link>
          </div>
        </div>
      </section>

      {/* Counsellors preview */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end" data-reveal>
            <div>
              <span className="inline-block rounded-full border border-steel px-5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-navy">
                EXPERT COUNSELLORS
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold text-navy md:text-4xl">
                Meet your guide
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Verified experts across all five career paths. Book a 15-min intro call or a full 45-min session.
              </p>
            </div>
            <Link
              to="/counsellors"
              className="shrink-0 rounded-full border-2 border-navy px-7 py-3 font-display text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
            >
              View all counsellors
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-reveal style={revealDelay(1)}>
            {[
              { name: "Dr. Ananya Rao", spec: "After 12th & Higher Study", lang: "English, Hindi, Telugu", price: "₹799", rating: "4.9" },
              { name: "Vikram Nair", spec: "Government Jobs", lang: "English, Malayalam, Hindi", price: "₹599", rating: "4.8" },
              { name: "Priya Mehta", spec: "Employment & Entrepreneurship", lang: "English, Gujarati", price: "₹899", rating: "5.0" },
            ].map((c, i) => (
              <div key={c.name} data-reveal style={revealDelay(i)}
                className="group rounded-3xl border border-steel bg-white p-7 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_44px_-18px_rgba(20,33,61,0.3)]">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-navy font-display text-xl font-bold text-gold">
                    {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-navy">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.spec}</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{c.lang}</p>
                    <p className="mt-1 font-display text-lg font-bold text-navy">{c.price}<span className="text-xs font-normal text-muted-foreground">/session</span></p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">
                    ★ {c.rating}
                  </span>
                </div>
                <Link
                  to="/counsellors"
                  className="mt-5 block rounded-full bg-steel py-2.5 text-center font-display text-xs font-bold uppercase tracking-wide text-navy transition duration-300 group-hover:bg-gold"
                >
                  Book session
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners CTA */}
      <section className="bg-navy py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6" data-reveal>
          <span className="inline-block rounded-full bg-gold/20 px-5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-gold">
            COMPANY PARTNERSHIPS
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold text-white md:text-4xl">
            Partner with MINDFULCAREER
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Post jobs, internships, scholarships and mentorship programs. Reach thousands of career-ready students matched to your industry.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/partners"
              className="rounded-full bg-gold px-8 py-3.5 font-display text-sm font-bold text-navy transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(252,163,17,0.7)]"
            >
              Become a partner
            </Link>
            <Link
              to="/partners"
              className="rounded-full border-2 border-white/30 px-8 py-3.5 font-display text-sm font-bold text-white transition hover:border-gold hover:text-gold"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
