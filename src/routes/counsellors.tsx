import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/counsellors")({
  component: CounsellorsPage,
  head: () => ({
    meta: [
      { title: "Find a Counsellor — MINDFULCAREER" },
      { name: "description", content: "Browse verified career counsellors. Filter by path, language and price." },
    ],
  }),
});

interface Counsellor {
  id: string;
  full_name: string;
  specialty: string;
  languages: string[];
  price_intro: number;
  price_standard: number;
  price_package: number;
  rating: number;
  review_count: number;
  bio: string;
  photo_url: string | null;
  is_approved: boolean;
}

const PATHS = ["All", "After 12th", "Higher Study", "Govt Job", "Employment", "Entrepreneur"];
const LANGUAGES = ["All", "English", "Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", "Gujarati", "Bengali", "Marathi"];
const PRICE_RANGES = ["All", "Under ₹500", "₹500–₹1000", "Above ₹1000"];

// Sample data shown when Supabase is not yet connected
const SAMPLE_COUNSELLORS: Counsellor[] = [
  { id: "11111111-1111-1111-1111-111111111111", full_name: "Dr. Ananya Rao", specialty: "After 12th", languages: ["English", "Hindi", "Telugu"], price_intro: 299, price_standard: 799, price_package: 1999, rating: 4.9, review_count: 142, bio: "10+ years guiding students through stream selection, entrance exams and college admissions.", photo_url: null, is_approved: true },
  { id: "22222222-2222-2222-2222-222222222222", full_name: "Vikram Nair", specialty: "Govt Job", languages: ["English", "Malayalam", "Hindi"], price_intro: 199, price_standard: 599, price_package: 1499, rating: 4.8, review_count: 98, bio: "Former IAS officer with deep expertise in UPSC, SSC and state PSC preparation strategies.", photo_url: null, is_approved: true },
  { id: "33333333-3333-3333-3333-333333333333", full_name: "Priya Mehta", specialty: "Employment", languages: ["English", "Gujarati"], price_intro: 349, price_standard: 899, price_package: 2299, rating: 5.0, review_count: 67, bio: "HR professional and career coach specialising in resume building, interviews and job search.", photo_url: null, is_approved: true },
  { id: "44444444-4444-4444-4444-444444444444", full_name: "Arjun Krishnamurthy", specialty: "Higher Study", languages: ["English", "Tamil", "Kannada"], price_intro: 299, price_standard: 799, price_package: 1999, rating: 4.7, review_count: 55, bio: "Helped 200+ students get into top universities in India and abroad for Masters and MBA.", photo_url: null, is_approved: true },
  { id: "55555555-5555-5555-5555-555555555555", full_name: "Sneha Banerjee", specialty: "Entrepreneur", languages: ["English", "Bengali", "Hindi"], price_intro: 399, price_standard: 999, price_package: 2499, rating: 4.9, review_count: 33, bio: "Serial entrepreneur and startup mentor. Helps aspiring founders validate ideas and find funding.", photo_url: null, is_approved: true },
  { id: "66666666-6666-6666-6666-666666666666", full_name: "Rahul Sharma", specialty: "After 12th", languages: ["English", "Hindi", "Marathi"], price_intro: 249, price_standard: 699, price_package: 1799, rating: 4.6, review_count: 89, bio: "Education counsellor with expertise in JEE, NEET, CUET and scholarship applications.", photo_url: null, is_approved: true },
];

function CounsellorsPage() {
  const [counsellors] = useState<Counsellor[]>(SAMPLE_COUNSELLORS);
  const [pathFilter, setPathFilter] = useState("All");
  const [langFilter, setLangFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  const filtered = counsellors.filter((c) => {
    if (pathFilter !== "All" && c.specialty !== pathFilter) return false;
    if (langFilter !== "All" && !c.languages.includes(langFilter)) return false;
    if (priceFilter === "Under ₹500" && c.price_standard >= 500) return false;
    if (priceFilter === "₹500–₹1000" && (c.price_standard < 500 || c.price_standard > 1000)) return false;
    if (priceFilter === "Above ₹1000" && c.price_standard <= 1000) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav />

      <section className="bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <span className="inline-block rounded-full bg-gold/20 px-5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-gold">
            EXPERT COUNSELLORS
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold text-white md:text-5xl">
            Find your guide
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
            All counsellors are verified and approved by our team. Book a 15-min intro call or a full 45-min session.
          </p>
        </div>
      </section>

      <section className="bg-steel py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy">Career Path</label>
              <select
                value={pathFilter}
                onChange={(e) => setPathFilter(e.target.value)}
                className="rounded-xl border border-steel bg-white px-4 py-2 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              >
                {PATHS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy">Language</label>
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                className="rounded-xl border border-steel bg-white px-4 py-2 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              >
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy">Price Range</label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="rounded-xl border border-steel bg-white px-4 py-2 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              >
                {PRICE_RANGES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground">No counsellors match your filters. Try adjusting them.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <article key={c.id}
                  className="group flex flex-col rounded-3xl border border-steel bg-white p-7 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_44px_-18px_rgba(20,33,61,0.3)]">
                  <div className="flex items-center gap-4">
                    {c.photo_url ? (
                      <img src={c.photo_url} alt={c.full_name} className="h-14 w-14 rounded-full object-cover" />
                    ) : (
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-navy font-display text-xl font-bold text-gold">
                        {c.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    )}
                    <div>
                      <h2 className="font-display text-base font-bold text-navy">{c.full_name}</h2>
                      <span className="inline-block rounded-full bg-gold px-3 py-0.5 text-[11px] font-bold text-navy">{c.specialty}</span>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">{c.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.languages.map((l) => (
                      <span key={l} className="rounded-full border border-steel px-3 py-0.5 text-[11px] text-navy">{l}</span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="font-display text-lg font-bold text-navy">₹{c.price_intro}<span className="text-xs font-normal text-muted-foreground">/intro</span></p>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">
                      ★ {c.rating} <span className="font-normal text-navy/60">({c.review_count})</span>
                    </span>
                  </div>
                  <Link
                    to="/counsellors/$id"
                    params={{ id: c.id }}
                    className="mt-5 block rounded-full bg-steel py-2.5 text-center font-display text-xs font-bold uppercase tracking-wide text-navy transition duration-300 group-hover:bg-gold"
                  >
                    View profile & book
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
