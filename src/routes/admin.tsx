import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
  head: () => ({ meta: [{ title: "Admin — MINDFULCAREER" }] }),
});

type Tab = "counsellors" | "companies" | "bookings" | "submissions";

const MOCK_COUNSELLORS = [
  { id: "c1", full_name: "Dr. Ananya Rao",        specialty: "After 12th",  is_approved: true },
  { id: "c2", full_name: "Vikram Nair",            specialty: "Govt Job",    is_approved: true },
  { id: "c3", full_name: "Priya Mehta",            specialty: "Employment",  is_approved: false },
  { id: "c4", full_name: "Arjun Krishnamurthy",    specialty: "Higher Study",is_approved: true },
  { id: "c5", full_name: "Sneha Banerjee",         specialty: "Entrepreneur",is_approved: false },
];

const MOCK_COMPANIES = [
  { id: "cp1", company_name: "TechCorp India",  industry: "Technology",  partnership_type: "Hiring",     status: "approved" },
  { id: "cp2", company_name: "EduFund",         industry: "Education",   partnership_type: "Scholarship", status: "under review" },
  { id: "cp3", company_name: "GovtReady",       industry: "EdTech",      partnership_type: "Workshop",   status: "submitted" },
];

const MOCK_BOOKINGS = [
  { id: "b1", student: "Arjun Sharma",  counsellor: "Dr. Ananya Rao", amount: 799, status: "confirmed" },
  { id: "b2", student: "Priya Mehta",   counsellor: "Vikram Nair",    amount: 599, status: "completed" },
  { id: "b3", student: "Rahul Verma",   counsellor: "Sneha Banerjee", amount: 999, status: "pending" },
];

const MOCK_SUBMISSIONS = [
  { id: "s1", full_name: "Arjun Sharma",  email: "arjun@demo.com",  track: "After 12th",  status: "completed" },
  { id: "s2", full_name: "Divya Nair",    email: "divya@demo.com",  track: "Higher Study", status: "in_progress" },
  { id: "s3", full_name: "Karan Mehta",   email: "karan@demo.com",  track: "Govt Job",    status: "completed" },
];

function AdminPanel() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("counsellors");
  const [counsellors, setCounsellors] = useState(MOCK_COUNSELLORS);
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Admin access only. <a href="/login" className="text-navy underline">Sign in</a></p>
      </div>
    );
  }

  const handleSignOut = () => { signOut(); navigate({ to: "/login" }); };

  const exportCSV = (data: Record<string, unknown>[], filename: string) => {
    if (!data.length) return;
    const keys = Object.keys(data[0]!);
    const csv = [keys.join(","), ...data.map((row) => keys.map((k) => JSON.stringify(row[k] ?? "")).join(","))].join("\n");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: `${filename}.csv` });
    a.click();
  };

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: "counsellors", label: "Counsellors",        count: counsellors.length },
    { id: "companies",   label: "Companies",          count: companies.length },
    { id: "bookings",    label: "Bookings",           count: bookings.length },
    { id: "submissions", label: "Chatbot Submissions",count: MOCK_SUBMISSIONS.length },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        <header className="flex items-center justify-between">
          <div>
            <span className="inline-block rounded-full border border-steel px-5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-navy">ADMIN PANEL</span>
            <h1 className="mt-4 font-display text-3xl font-bold text-navy">Admin Dashboard</h1>
          </div>
          <button type="button" onClick={handleSignOut}
            className="rounded-full border border-steel px-5 py-2 text-sm font-semibold text-navy transition hover:bg-steel">
            Sign out
          </button>
        </header>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[
            { label: "Counsellors", value: counsellors.length },
            { label: "Companies",   value: companies.length },
            { label: "Bookings",    value: bookings.length },
            { label: "Submissions", value: MOCK_SUBMISSIONS.length },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-steel bg-white p-5 shadow-sm">
              <p className="font-display text-2xl font-bold text-navy">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-steel">
          {TABS.map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              className={`rounded-t-xl px-5 py-2.5 font-display text-sm font-semibold transition ${tab === t.id ? "bg-navy text-white" : "text-navy/60 hover:text-navy"}`}>
              {t.label}
              <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${tab === t.id ? "bg-gold text-navy" : "bg-steel text-navy"}`}>{t.count}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {/* Counsellors */}
          {tab === "counsellors" && (
            <div className="rounded-3xl border border-steel bg-white p-6 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-navy">Counsellors</h2>
                <button type="button" onClick={() => exportCSV(counsellors as unknown as Record<string, unknown>[], "counsellors")}
                  className="rounded-full border border-steel px-4 py-2 text-xs font-semibold text-navy transition hover:bg-steel">Export CSV</button>
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-steel text-left text-xs font-semibold text-muted-foreground">
                      <th className="pb-3 pr-4">Name</th><th className="pb-3 pr-4">Specialty</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steel">
                    {counsellors.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3 pr-4 font-semibold text-navy">{c.full_name}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{c.specialty}</td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${c.is_approved ? "bg-gold text-navy" : "bg-steel text-navy"}`}>
                            {c.is_approved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="py-3">
                          <button type="button"
                            onClick={() => setCounsellors((cs) => cs.map((x) => x.id === c.id ? { ...x, is_approved: !x.is_approved } : x))}
                            className={`rounded-full px-4 py-1.5 text-[11px] font-bold transition hover:-translate-y-0.5 ${c.is_approved ? "border border-steel text-navy hover:bg-steel" : "bg-gold text-navy"}`}>
                            {c.is_approved ? "Revoke" : "Approve"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Companies */}
          {tab === "companies" && (
            <div className="rounded-3xl border border-steel bg-white p-6 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-navy">Company Partnerships</h2>
                <button type="button" onClick={() => exportCSV(companies as unknown as Record<string, unknown>[], "companies")}
                  className="rounded-full border border-steel px-4 py-2 text-xs font-semibold text-navy transition hover:bg-steel">Export CSV</button>
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-steel text-left text-xs font-semibold text-muted-foreground">
                      <th className="pb-3 pr-4">Company</th><th className="pb-3 pr-4">Industry</th><th className="pb-3 pr-4">Type</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steel">
                    {companies.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3 pr-4 font-semibold text-navy">{c.company_name}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{c.industry}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{c.partnership_type}</td>
                        <td className="py-3 pr-4">
                          <span className="rounded-full bg-steel px-3 py-0.5 text-[11px] font-bold text-navy capitalize">{c.status}</span>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            {c.status !== "approved" && (
                              <button type="button" onClick={() => setCompanies((cs) => cs.map((x) => x.id === c.id ? { ...x, status: "approved" } : x))}
                                className="rounded-full bg-gold px-4 py-1.5 text-[11px] font-bold text-navy transition hover:-translate-y-0.5">Approve</button>
                            )}
                            {c.status !== "rejected" && (
                              <button type="button" onClick={() => setCompanies((cs) => cs.map((x) => x.id === c.id ? { ...x, status: "rejected" } : x))}
                                className="rounded-full border border-red-200 px-4 py-1.5 text-[11px] font-semibold text-red-600 transition hover:bg-red-50">Reject</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bookings */}
          {tab === "bookings" && (
            <div className="rounded-3xl border border-steel bg-white p-6 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-navy">All Bookings</h2>
                <button type="button" onClick={() => exportCSV(bookings as unknown as Record<string, unknown>[], "bookings")}
                  className="rounded-full border border-steel px-4 py-2 text-xs font-semibold text-navy transition hover:bg-steel">Export CSV</button>
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-steel text-left text-xs font-semibold text-muted-foreground">
                      <th className="pb-3 pr-4">Student</th><th className="pb-3 pr-4">Counsellor</th><th className="pb-3 pr-4">Amount</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steel">
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td className="py-3 pr-4 font-semibold text-navy">{b.student}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{b.counsellor}</td>
                        <td className="py-3 pr-4 text-navy">₹{b.amount}</td>
                        <td className="py-3 pr-4">
                          <span className="rounded-full bg-steel px-3 py-0.5 text-[11px] font-bold text-navy capitalize">{b.status}</span>
                        </td>
                        <td className="py-3">
                          {b.status === "confirmed" && (
                            <button type="button" onClick={() => setBookings((bs) => bs.map((x) => x.id === b.id ? { ...x, status: "refunded" } : x))}
                              className="rounded-full border border-red-200 px-4 py-1.5 text-[11px] font-semibold text-red-600 transition hover:bg-red-50">Issue Refund</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Submissions */}
          {tab === "submissions" && (
            <div className="rounded-3xl border border-steel bg-white p-6 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-navy">Chatbot Submissions</h2>
                <button type="button" onClick={() => exportCSV(MOCK_SUBMISSIONS as unknown as Record<string, unknown>[], "submissions")}
                  className="rounded-full border border-steel px-4 py-2 text-xs font-semibold text-navy transition hover:bg-steel">Export CSV</button>
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-steel text-left text-xs font-semibold text-muted-foreground">
                      <th className="pb-3 pr-4">Name</th><th className="pb-3 pr-4">Email</th><th className="pb-3 pr-4">Track</th><th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steel">
                    {MOCK_SUBMISSIONS.map((s) => (
                      <tr key={s.id}>
                        <td className="py-3 pr-4 font-semibold text-navy">{s.full_name}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{s.email}</td>
                        <td className="py-3 pr-4 text-muted-foreground capitalize">{s.track}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${s.status === "completed" ? "bg-gold text-navy" : "bg-steel text-navy"}`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
