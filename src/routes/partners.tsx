import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/partners")({
  component: PartnersPage,
  head: () => ({
    meta: [
      { title: "Company Partnerships — MINDFULCAREER" },
      { name: "description", content: "Partner with MINDFULCAREER to reach career-ready students. Post jobs, internships, scholarships and mentorship programs." },
    ],
  }),
});

const PARTNERSHIP_TYPES = [
  { icon: "💼", title: "Hiring & Internships", desc: "Post full-time roles and internship opportunities directly to students matched by career track and skills." },
  { icon: "🧑‍🏫", title: "Mentorship", desc: "Connect your senior professionals with students for structured mentorship programs and career talks." },
  { icon: "🎓", title: "Scholarships & Sponsorship", desc: "Fund deserving students through scholarships, fee waivers or sponsored counselling sessions." },
  { icon: "🏋️", title: "Training & Workshops", desc: "Conduct skill-building workshops, bootcamps and certification programs for our student community." },
  { icon: "🚀", title: "Incubation", desc: "Support student entrepreneurs with incubation, seed funding, co-working space and expert mentoring." },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Apply to partner", desc: "Fill out the partnership application form with your company details and program type." },
  { step: "02", title: "Review & approval", desc: "Our team reviews your application within 3–5 business days and approves verified companies." },
  { step: "03", title: "Post opportunities", desc: "Once approved, post jobs, internships, scholarships or programs on your company dashboard." },
  { step: "04", title: "Reach students", desc: "Your opportunities are shown to students matched by career track, skills and location." },
];

function PartnersPage() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }); },
      { threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav />

      {/* Hero */}
      <section className="bg-navy py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6" data-reveal>
          <span className="inline-block rounded-full bg-gold/20 px-5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-gold">
            COMPANY PARTNERSHIPS
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold text-white md:text-5xl">
            Grow with MINDFULCAREER
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/70">
            Partner with India's leading career guidance platform. Reach thousands of career-ready students matched to your industry, location and requirements.
          </p>
          <Link
            to="/partners/apply"
            className="mt-8 inline-block rounded-full bg-gold px-10 py-4 font-display text-sm font-bold text-navy transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(252,163,17,0.7)]"
          >
            Apply to partner →
          </Link>
        </div>
      </section>

      {/* Why partner */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center" data-reveal>
            <span className="inline-block rounded-full border border-steel px-5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-navy">
              WHY PARTNER WITH US
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold text-navy md:text-4xl">
              Five ways to collaborate
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNERSHIP_TYPES.map((pt, i) => (
              <div key={pt.title} data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
                className="group rounded-3xl border border-steel bg-white p-8 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)] transition duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-[0_24px_44px_-18px_rgba(20,33,61,0.3)]">
                <span className="text-4xl">{pt.icon}</span>
                <h3 className="mt-4 font-display text-base font-bold text-navy">{pt.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pt.desc}</p>
              </div>
            ))}
            {/* CTA card */}
            <div data-reveal style={{ "--reveal-delay": `${5 * 90}ms` } as React.CSSProperties}
              className="flex flex-col items-center justify-center rounded-3xl bg-navy p-8 text-center">
              <p className="font-display text-lg font-bold text-white">Ready to partner?</p>
              <p className="mt-2 text-sm text-white/60">Join 150+ companies already working with MINDFULCAREER.</p>
              <Link to="/partners/apply"
                className="mt-6 rounded-full bg-gold px-7 py-3 font-display text-sm font-bold text-navy transition hover:-translate-y-0.5">
                Apply now
              </Link>
            </div>
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
              From application to active partner
            </h2>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
                className="rounded-3xl bg-white p-8 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)] transition hover:-translate-y-1.5">
                <span className="font-display text-5xl font-bold text-steel">{step.step}</span>
                <h3 className="mt-4 font-display text-base font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center" data-reveal>
            <Link to="/partners/apply"
              className="inline-block rounded-full bg-navy px-10 py-4 font-display text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(20,33,61,0.5)]">
              Apply to partner
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
