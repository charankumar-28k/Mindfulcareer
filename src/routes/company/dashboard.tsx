import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/company/dashboard")({
  component: CompanyDashboard,
  head: () => ({ meta: [{ title: "Company Dashboard — MINDFULCAREER" }] }),
});

interface Opportunity {
  id: string;
  title: string;
  type: string;
  track: string;
  location: string;
  is_active: boolean;
}

const OPP_TYPES = ["Job", "Internship", "Scholarship", "Workshop", "Incubation"];
const TRACKS = ["After 12th", "Higher Study", "Govt Job", "Employment", "Entrepreneur"];

const MOCK_OPPORTUNITIES: Opportunity[] = [
  { id: "o1", title: "Software Engineer Intern", type: "Internship", track: "Employment",  location: "Bangalore", is_active: true },
  { id: "o2", title: "Data Analyst – Fresher",   type: "Job",        track: "Higher Study", location: "Remote",    is_active: true },
];

function CompanyDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "Job", track: "Employment", location: "" });

  if (!user || user.role !== "company") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Link to="/login" className="text-navy underline">Sign in as Company</Link>
      </div>
    );
  }

  const handleSignOut = () => { signOut(); navigate({ to: "/login" }); };

  const postOpportunity = () => {
    if (!form.title.trim()) return;
    const newOpp: Opportunity = { id: `o${Date.now()}`, ...form, is_active: true };
    setOpportunities((ops) => [newOpp, ...ops]);
    setForm({ title: "", type: "Job", track: "Employment", location: "" });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <header className="flex items-start justify-between">
          <div>
            <span className="inline-block rounded-full border border-steel px-5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-navy">COMPANY DASHBOARD</span>
            <h1 className="mt-4 font-display text-3xl font-bold text-navy md:text-4xl">{user.full_name}</h1>
          </div>
          <button type="button" onClick={handleSignOut}
            className="mt-2 rounded-full border border-steel px-5 py-2 text-sm font-semibold text-navy transition hover:bg-steel">
            Sign out
          </button>
        </header>

        {/* Status */}
        <div className="mt-8 rounded-3xl border border-steel bg-white p-7 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-navy">Partnership Status</h2>
              <p className="mt-1 text-sm text-muted-foreground">Your partnership is active! You can post opportunities.</p>
            </div>
            <span className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-bold text-green-800">Active</span>
          </div>
        </div>

        {/* Opportunities */}
        <div className="mt-8 rounded-3xl border border-steel bg-white p-7 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-navy">Posted Opportunities</h2>
            <button type="button" onClick={() => setShowForm((v) => !v)}
              className="rounded-full bg-gold px-5 py-2 font-display text-sm font-bold text-navy transition hover:-translate-y-0.5">
              + Post opportunity
            </button>
          </div>

          {showForm && (
            <div className="mt-6 grid gap-4 rounded-2xl bg-steel/30 p-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy">Title *</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Software Engineer Intern"
                  className="w-full rounded-xl border border-steel bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy">Type</label>
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full rounded-xl border border-steel bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30">
                  {OPP_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy">Career Track</label>
                <select value={form.track} onChange={(e) => setForm((f) => ({ ...f, track: e.target.value }))}
                  className="w-full rounded-xl border border-steel bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30">
                  {TRACKS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy">Location</label>
                <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Bangalore, Remote"
                  className="w-full rounded-xl border border-steel bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="button" onClick={postOpportunity}
                  className="rounded-full bg-gold px-7 py-2.5 font-display text-sm font-bold text-navy transition hover:-translate-y-0.5">Post</button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-full border border-steel px-7 py-2.5 text-sm text-navy transition hover:bg-steel">Cancel</button>
              </div>
            </div>
          )}

          <ul className="mt-5 divide-y divide-steel">
            {opportunities.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-display text-sm font-bold text-navy">{o.title}</p>
                  <p className="text-xs text-muted-foreground">{o.type} · {o.track} · {o.location}</p>
                </div>
                <span className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${o.is_active ? "bg-gold text-navy" : "bg-steel text-navy"}`}>
                  {o.is_active ? "Active" : "Inactive"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
