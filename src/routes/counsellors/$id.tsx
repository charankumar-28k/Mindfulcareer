import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/counsellors/$id")({
  component: CounsellorDetailPage,
  head: () => ({ meta: [{ title: "Counsellor Profile — MINDFULCAREER" }] }),
});

const MOCK_COUNSELLORS: Record<string, { full_name: string; specialty: string; bio: string; languages: string[]; rating: number; review_count: number }> = {
  "11111111-1111-1111-1111-111111111111": { full_name: "Dr. Ananya Rao", specialty: "After 12th", bio: "10+ years guiding students through stream selection, entrance exams and college admissions. Former academic counsellor at a top engineering college.", languages: ["English", "Hindi", "Telugu"], rating: 4.9, review_count: 142 },
  "22222222-2222-2222-2222-222222222222": { full_name: "Vikram Nair", specialty: "Govt Job", bio: "Former IAS officer with deep expertise in UPSC, SSC and state PSC preparation strategies. Has mentored 500+ aspirants.", languages: ["English", "Malayalam", "Hindi"], rating: 4.8, review_count: 98 },
  "33333333-3333-3333-3333-333333333333": { full_name: "Priya Mehta", specialty: "Employment", bio: "HR professional and career coach specialising in resume building, interviews and job search strategy for freshers and experienced professionals.", languages: ["English", "Gujarati"], rating: 5.0, review_count: 67 },
  "44444444-4444-4444-4444-444444444444": { full_name: "Arjun Krishnamurthy", specialty: "Higher Study", bio: "Helped 200+ students get into top universities in India and abroad for Masters and MBA. Expert in GATE, GRE, IELTS, and application essays.", languages: ["English", "Tamil", "Kannada"], rating: 4.7, review_count: 55 },
  "55555555-5555-5555-5555-555555555555": { full_name: "Sneha Banerjee", specialty: "Entrepreneur", bio: "Serial entrepreneur and startup mentor. Helps aspiring founders validate ideas, find funding, and build their first team.", languages: ["English", "Bengali", "Hindi"], rating: 4.9, review_count: 33 },
  "66666666-6666-6666-6666-666666666666": { full_name: "Rahul Sharma", specialty: "After 12th", bio: "Education counsellor with expertise in JEE, NEET, CUET and scholarship applications. Trained 1000+ students across India.", languages: ["English", "Hindi", "Marathi"], rating: 4.6, review_count: 89 },
};

const MOCK_REVIEWS = [
  { id: "r1", student_name: "Arjun S.", rating: 5, comment: "Incredibly helpful session. Got clarity on my career path within 30 minutes!" },
  { id: "r2", student_name: "Priya M.", rating: 5, comment: "Very knowledgeable and patient. Highly recommend to anyone confused about their future." },
  { id: "r3", student_name: "Rahul V.", rating: 4, comment: "Great insights on exam preparation strategy. Will book again." },
];

const MOCK_SLOTS = [
  { id: "s1", date: "Aug 10", time: "10:00 AM" },
  { id: "s2", date: "Aug 11", time: "2:00 PM" },
  { id: "s3", date: "Aug 12", time: "11:00 AM" },
  { id: "s4", date: "Aug 13", time: "4:00 PM" },
];

const PRICING = [
  { type: "intro",    label: "Intro Call",      duration: "15 min",    price: 299 },
  { type: "standard", label: "Standard Session", duration: "45 min",    price: 799 },
  { type: "package",  label: "Package of 3",    duration: "3 × 45 min", price: 1999 },
];

function CounsellorDetailPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedPricing, setSelectedPricing] = useState("standard");
  const [bookingStep, setBookingStep] = useState<"select" | "confirm" | "done">("select");

  const c = MOCK_COUNSELLORS[id] ?? MOCK_COUNSELLORS["11111111-1111-1111-1111-111111111111"]!;

  const getPrice = () => PRICING.find((p) => p.type === selectedPricing)?.price ?? 799;

  const handleBook = () => {
    if (!user) { window.location.href = "/login"; return; }
    if (!selectedSlot) return;
    setBookingStep("confirm");
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav />

      <section className="bg-navy py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link to="/counsellors" className="text-sm text-white/60 transition hover:text-gold">← Back to counsellors</Link>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gold font-display text-3xl font-bold text-navy">
              {c.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </span>
            <div>
              <h1 className="font-display text-3xl font-bold text-white">{c.full_name}</h1>
              <span className="mt-2 inline-block rounded-full bg-gold px-4 py-1 font-display text-sm font-bold text-navy">{c.specialty}</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.languages.map((l) => (
                  <span key={l} className="rounded-full border border-white/20 px-3 py-0.5 text-xs text-white/70">{l}</span>
                ))}
              </div>
            </div>
            <div className="sm:ml-auto">
              <span className="flex items-center gap-1 rounded-full bg-gold px-4 py-1.5 font-display text-sm font-bold text-navy">
                ★ {c.rating} ({c.review_count} reviews)
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_380px]">
          {/* Left */}
          <div className="space-y-10">
            <div className="rounded-3xl border border-steel bg-white p-8 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
              <h2 className="font-display text-lg font-bold text-navy">About</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.bio}</p>
            </div>

            <div className="rounded-3xl border border-steel bg-white p-8 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
              <h2 className="font-display text-lg font-bold text-navy">Reviews</h2>
              <ul className="mt-5 space-y-5">
                {MOCK_REVIEWS.map((r) => (
                  <li key={r.id} className="border-b border-steel pb-5 last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-semibold text-navy">{r.student_name}</span>
                      <span className="text-xs text-gold">{"★".repeat(r.rating)}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: booking */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-steel bg-white p-7 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
              <h2 className="font-display text-lg font-bold text-navy">Choose a session</h2>
              <div className="mt-5 space-y-3">
                {PRICING.map((p) => (
                  <button key={p.type} type="button" onClick={() => setSelectedPricing(p.type)}
                    className={`w-full rounded-2xl border-2 p-4 text-left transition ${selectedPricing === p.type ? "border-gold bg-gold/10" : "border-steel hover:border-navy"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display text-sm font-bold text-navy">{p.label}</p>
                        <p className="text-xs text-muted-foreground">{p.duration}</p>
                      </div>
                      <p className="font-display text-lg font-bold text-navy">₹{p.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-steel bg-white p-7 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
              <h2 className="font-display text-lg font-bold text-navy">Available slots</h2>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {MOCK_SLOTS.map((slot) => (
                  <button key={slot.id} type="button" onClick={() => setSelectedSlot(slot.id)}
                    className={`rounded-xl border-2 p-3 text-center text-xs transition ${selectedSlot === slot.id ? "border-gold bg-gold/10 font-bold text-navy" : "border-steel hover:border-navy"}`}>
                    <p className="font-semibold">{slot.date}</p>
                    <p className="text-muted-foreground">{slot.time}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-steel/50 p-5 text-xs text-muted-foreground">
              <p className="font-semibold text-navy">Cancellation Policy</p>
              <p className="mt-1">Free cancellation up to 24 hours before the session.</p>
            </div>

            {bookingStep === "select" && (
              <button type="button" onClick={handleBook} disabled={!selectedSlot}
                className="w-full rounded-full bg-gold py-4 font-display text-sm font-bold text-navy transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(252,163,17,0.7)] disabled:opacity-40">
                {user ? "Book session" : "Sign in to book"}
              </button>
            )}

            {bookingStep === "confirm" && (
              <div className="space-y-3">
                <div className="rounded-2xl bg-steel/40 p-4 text-sm text-navy">
                  <p className="font-semibold">Booking summary</p>
                  <p className="mt-1 text-muted-foreground">{PRICING.find((p) => p.type === selectedPricing)?.label} · ₹{getPrice()}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Payment integration coming soon.</p>
                </div>
                <button type="button" onClick={() => setBookingStep("done")}
                  className="w-full rounded-full bg-gold py-4 font-display text-sm font-bold text-navy transition hover:-translate-y-0.5">
                  Confirm Booking
                </button>
                <button type="button" onClick={() => setBookingStep("select")}
                  className="w-full rounded-full border border-steel py-3 text-sm text-navy transition hover:bg-steel">
                  Go back
                </button>
              </div>
            )}

            {bookingStep === "done" && (
              <div className="rounded-3xl border border-gold bg-gold/10 p-6 text-center">
                <p className="font-display text-base font-bold text-navy">Booking confirmed! 🎉</p>
                <p className="mt-2 text-sm text-muted-foreground">You'll receive a confirmation with the meeting link shortly.</p>
                <Link to="/student/dashboard"
                  className="mt-4 inline-block rounded-full bg-navy px-6 py-2.5 font-display text-sm font-bold text-white transition hover:-translate-y-0.5">
                  Go to dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
