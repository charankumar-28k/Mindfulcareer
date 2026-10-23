import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({ meta: [{ title: "Contact Us — MINDFULCAREER" }] }),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from("notifications").insert({ type: "contact", payload: form });
    setLoading(false);
    setSent(true);
  };

  const inputClass = "w-full rounded-2xl border border-steel bg-steel/40 px-5 py-3.5 text-sm text-navy outline-none transition placeholder:text-muted-foreground focus:border-gold focus:bg-white focus:ring-2 focus:ring-gold/30";

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav />
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-4xl font-bold text-white">Contact Us</h1>
          <p className="mt-3 text-sm text-white/60">We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-6">
            {[
              { icon: "📍", label: "Address", value: "India (Pan-India service)" },
              { icon: "📞", label: "Phone", value: "+91 98765 43210" },
              { icon: "✉️", label: "Email", value: "hello@mindfulcareer.in" },
              { icon: "🕐", label: "Hours", value: "Mon–Sat, 9am–6pm IST" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-steel bg-white p-5 shadow-[0_4px_20px_-8px_rgba(20,33,61,0.12)]">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-display text-sm font-bold text-navy">{item.label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-steel bg-white p-8 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="text-5xl">✅</span>
                <h2 className="mt-4 font-display text-xl font-bold text-navy">Message sent!</h2>
                <p className="mt-2 text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="sr-only">Name</label>
                    <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name*" className={inputClass} />
                  </div>
                  <div>
                    <label className="sr-only">Email</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email address*" className={inputClass} />
                  </div>
                </div>
                <input required value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="Subject*" className={inputClass} />
                <textarea rows={5} required value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Your message*" className={`${inputClass} resize-y`} />
                <button type="submit" disabled={loading}
                  className="w-full rounded-full bg-gold py-3.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-navy transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(252,163,17,0.7)] disabled:opacity-50">
                  {loading ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
