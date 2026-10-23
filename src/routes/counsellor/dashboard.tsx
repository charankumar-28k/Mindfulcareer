import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/counsellor/dashboard")({
  component: CounsellorDashboard,
  head: () => ({ meta: [{ title: "Counsellor Dashboard — MINDFULCAREER" }] }),
});

const MOCK_BOOKINGS = [
  { id: "b1", student: "Arjun Sharma",  track: "After 12th", session_type: "Video Call", date: "2025-08-10T10:00:00", status: "confirmed", amount: 799, notes: "" },
  { id: "b2", student: "Priya Mehta",   track: "Higher Study", session_type: "Phone Call", date: "2025-07-20T14:00:00", status: "completed", amount: 799, notes: "Discussed GRE prep plan." },
  { id: "b3", student: "Rahul Verma",   track: "Govt Job",   session_type: "Video Call", date: "2025-08-15T11:00:00", status: "pending",   amount: 599, notes: "" },
];

function CounsellorDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [slots, setSlots] = useState<{ date: string; time: string }[]>([]);
  const [slotForm, setSlotForm] = useState({ date: "", time: "" });
  const [slotAdded, setSlotAdded] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  if (!user || user.role !== "counsellor") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Link to="/login" className="text-navy underline">Sign in as Counsellor</Link>
      </div>
    );
  }

  const handleSignOut = () => { signOut(); navigate({ to: "/login" }); };

  const addSlot = () => {
    if (!slotForm.date || !slotForm.time) return;
    setSlots((s) => [...s, slotForm]);
    setSlotAdded(true);
    setSlotForm({ date: "", time: "" });
    setTimeout(() => setSlotAdded(false), 3000);
  };

  const saveNote = () => {
    setBookings((bs) => bs.map((b) => b.id === noteId ? { ...b, notes: noteText } : b));
    setNoteId(null);
  };

  const totalEarnings = bookings.filter((b) => b.status === "completed").reduce((s, b) => s + b.amount, 0);
  const todayStr = new Date().toDateString();
  const todaySessions = bookings.filter((b) => new Date(b.date).toDateString() === todayStr).length;

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <header className="flex items-start justify-between">
          <div>
            <span className="inline-block rounded-full border border-steel px-5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-navy">COUNSELLOR DASHBOARD</span>
            <h1 className="mt-4 font-display text-3xl font-bold text-navy md:text-4xl">Hello, {user.full_name.split(" ")[1] ?? user.full_name}!</h1>
          </div>
          <button type="button" onClick={handleSignOut}
            className="mt-2 rounded-full border border-steel px-5 py-2 text-sm font-semibold text-navy transition hover:bg-steel">
            Sign out
          </button>
        </header>

        {/* Stats */}
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { label: "Total sessions", value: bookings.filter((b) => b.status === "completed").length },
            { label: "Today's sessions", value: todaySessions },
            { label: "Total earnings", value: `₹${totalEarnings.toLocaleString("en-IN")}` },
          ].map((s) => (
            <div key={s.label} className="rounded-3xl border border-steel bg-white p-6 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)] transition hover:-translate-y-1">
              <p className="font-display text-3xl font-bold text-navy">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Bookings */}
          <div className="rounded-3xl border border-steel bg-white p-7 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
            <h2 className="font-display text-lg font-bold text-navy">All Bookings</h2>
            <ul className="mt-5 divide-y divide-steel">
              {bookings.map((b) => {
                const dt = new Date(b.date);
                return (
                  <li key={b.id} className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-sm font-bold text-navy">{b.student}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.session_type} · {dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} {dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <span className="mt-1 inline-block rounded-full bg-steel px-2.5 py-0.5 text-[10px] font-semibold text-navy">{b.track}</span>
                        {b.notes && <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{b.notes}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${b.status === "confirmed" ? "bg-gold text-navy" : b.status === "completed" ? "bg-navy text-white" : "bg-steel text-navy"}`}>
                          {b.status}
                        </span>
                        <button type="button" onClick={() => { setNoteId(b.id); setNoteText(b.notes); }}
                          className="text-[11px] font-semibold text-muted-foreground underline transition hover:text-navy">
                          {b.notes ? "Edit note" : "Add note"}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Availability */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-steel bg-white p-7 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
              <h2 className="font-display text-lg font-bold text-navy">Add Availability</h2>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-navy">Date</label>
                  <input type="date" value={slotForm.date} onChange={(e) => setSlotForm((f) => ({ ...f, date: e.target.value }))}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-steel bg-steel/40 px-4 py-2.5 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-navy">Time</label>
                  <input type="time" value={slotForm.time} onChange={(e) => setSlotForm((f) => ({ ...f, time: e.target.value }))}
                    className="w-full rounded-xl border border-steel bg-steel/40 px-4 py-2.5 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" />
                </div>
                <button type="button" onClick={addSlot}
                  className="w-full rounded-full bg-gold py-3 font-display text-sm font-bold text-navy transition hover:-translate-y-0.5">
                  Add slot
                </button>
                {slotAdded && <p className="text-center text-sm text-green-600">✓ Slot added!</p>}
              </div>
            </div>

            {slots.length > 0 && (
              <div className="rounded-3xl border border-steel bg-white p-7 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
                <h2 className="font-display text-base font-bold text-navy">Added Slots</h2>
                <ul className="mt-3 space-y-2">
                  {slots.map((s, i) => (
                    <li key={i} className="rounded-xl bg-steel/30 px-4 py-2 text-sm text-navy">
                      {s.date} at {s.time}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Note modal */}
      {noteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="font-display text-xl font-bold text-navy">Session Notes</h2>
            <p className="mt-1 text-xs text-muted-foreground">Private — only visible to you.</p>
            <textarea rows={6} value={noteText} onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add your private session notes…"
              className="mt-4 w-full resize-none rounded-2xl border border-steel bg-steel/40 px-5 py-3 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" />
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={saveNote}
                className="flex-1 rounded-full bg-gold py-3 font-display text-sm font-bold text-navy transition hover:-translate-y-0.5">Save</button>
              <button type="button" onClick={() => setNoteId(null)}
                className="flex-1 rounded-full border border-steel py-3 text-sm text-navy transition hover:bg-steel">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
