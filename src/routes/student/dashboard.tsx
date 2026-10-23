import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/student/dashboard")({
  component: StudentDashboard,
  head: () => ({ meta: [{ title: "Student Dashboard — MINDFULCAREER" }] }),
});

const MOCK_BOOKINGS = [
  { id: "b1", counsellor: "Dr. Ananya Rao", specialty: "After 12th", session_type: "Video Call", date: "2025-08-10T10:00:00", status: "confirmed", meeting_link: "https://meet.google.com/demo" },
  { id: "b2", counsellor: "Vikram Nair",    specialty: "Govt Job",   session_type: "Phone Call", date: "2025-07-20T14:00:00", status: "completed", meeting_link: null },
];

const MOCK_OPPORTUNITIES = [
  { id: "o1", title: "Software Engineer Intern", company: "TechCorp India",  type: "Internship", location: "Bangalore" },
  { id: "o2", title: "UPSC Mentorship Program",  company: "GovtReady",       type: "Workshop",   location: "Online" },
  { id: "o3", title: "MBA Scholarship 2025",     company: "EduFund",         type: "Scholarship", location: "Pan India" },
];

function StudentDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState<string[]>([]);

  if (!user || user.role !== "student") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Link to="/login" className="text-navy underline">Sign in as Student</Link>
      </div>
    );
  }

  const firstName = user.full_name.split(" ")[0];

  const handleSignOut = () => { signOut(); navigate({ to: "/login" }); };

  const submitReview = () => {
    if (reviewId) setSubmitted((s) => [...s, reviewId]);
    setReviewId(null);
    setComment("");
    setRating(5);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <header className="flex items-start justify-between">
          <div>
            <span className="inline-block rounded-full border border-steel px-5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-navy">STUDENT DASHBOARD</span>
            <h1 className="mt-4 font-display text-3xl font-bold text-navy md:text-4xl">Welcome back, {firstName}!</h1>
            <p className="mt-2 text-sm text-muted-foreground">Your career path: <span className="font-semibold text-navy">After 12th</span></p>
          </div>
          <button type="button" onClick={handleSignOut}
            className="mt-2 rounded-full border border-steel px-5 py-2 text-sm font-semibold text-navy transition hover:bg-steel">
            Sign out
          </button>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.6fr]">
          {/* Profile + report */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-steel bg-white p-7 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-navy font-display text-xl font-bold text-gold">
                  {user.full_name[0]?.toUpperCase()}
                </span>
                <div>
                  <p className="font-display text-base font-bold text-navy">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <span className="mt-1 inline-block rounded-full bg-gold px-3 py-0.5 text-[11px] font-bold text-navy">Student</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-steel bg-white p-7 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
              <h2 className="font-display text-base font-bold text-navy">Your Career Report</h2>
              <p className="mt-2 text-sm text-muted-foreground">Complete the guidance chatbot to generate your personalised PDF report.</p>
              <Link to="/guidance"
                className="mt-4 block rounded-full bg-gold py-3 text-center font-display text-sm font-bold text-navy transition hover:-translate-y-0.5">
                Start free guidance →
              </Link>
            </div>
          </div>

          {/* Sessions + Opportunities */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-steel bg-white p-7 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
              <h2 className="font-display text-lg font-bold text-navy">My Sessions</h2>
              <ul className="mt-5 divide-y divide-steel">
                {MOCK_BOOKINGS.map((b) => {
                  const dt = new Date(b.date);
                  return (
                    <li key={b.id} className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-display text-sm font-bold text-navy">{b.counsellor}</p>
                          <p className="text-xs text-muted-foreground">{b.specialty} · {b.session_type}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} at {dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${b.status === "confirmed" ? "bg-gold text-navy" : "bg-navy text-white"}`}>
                            {b.status}
                          </span>
                          {b.meeting_link && b.status === "confirmed" && (
                            <a href={b.meeting_link} target="_blank" rel="noreferrer"
                              className="rounded-full bg-navy px-4 py-1.5 text-[11px] font-bold text-white transition hover:bg-navy/80">
                              Join session
                            </a>
                          )}
                          {b.status === "completed" && !submitted.includes(b.id) && (
                            <button type="button" onClick={() => setReviewId(b.id)}
                              className="rounded-full border border-gold px-4 py-1.5 text-[11px] font-bold text-navy transition hover:bg-gold">
                              Leave review
                            </button>
                          )}
                          {submitted.includes(b.id) && (
                            <span className="text-[11px] text-green-600 font-semibold">✓ Reviewed</span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-3xl border border-steel bg-white p-7 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
              <h2 className="font-display text-lg font-bold text-navy">Opportunities for you</h2>
              <ul className="mt-5 divide-y divide-steel">
                {MOCK_OPPORTUNITIES.map((o) => (
                  <li key={o.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="font-display text-sm font-bold text-navy">{o.title}</p>
                      <p className="text-xs text-muted-foreground">{o.company} · {o.location}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-gold px-3 py-0.5 text-[11px] font-bold text-navy">{o.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Review modal */}
      {reviewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="font-display text-xl font-bold text-navy">Leave a review</h2>
            <div className="mt-5 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)}
                  className={`text-2xl transition ${star <= rating ? "text-gold" : "text-steel"}`}>★</button>
              ))}
            </div>
            <textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience…"
              className="mt-4 w-full resize-none rounded-2xl border border-steel bg-steel/40 px-5 py-3 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" />
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={submitReview}
                className="flex-1 rounded-full bg-gold py-3 font-display text-sm font-bold text-navy transition hover:-translate-y-0.5">
                Submit review
              </button>
              <button type="button" onClick={() => setReviewId(null)}
                className="flex-1 rounded-full border border-steel py-3 text-sm text-navy transition hover:bg-steel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
