import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/partners/apply")({
  component: PartnerApplyPage,
  head: () => ({
    meta: [{ title: "Apply to Partner — MINDFULCAREER" }],
  }),
});

const FREE_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "rediffmail.com", "ymail.com"];
const PARTNERSHIP_TYPES = ["Hiring & Internships", "Mentorship", "Scholarships & Sponsorship", "Training & Workshops", "Incubation"];
const INDUSTRIES = ["Technology", "Finance & Banking", "Healthcare", "Education", "Manufacturing", "Retail & E-commerce", "Media & Entertainment", "Government & PSU", "NGO / Non-profit", "Other"];

interface FormData {
  company_name: string;
  industry: string;
  contact_person: string;
  work_email: string;
  phone: string;
  website: string;
  registration_number: string;
  partnership_type: string;
  roles_offered: string;
  locations: string;
  notes: string;
}

const EMPTY: FormData = {
  company_name: "", industry: "", contact_person: "", work_email: "",
  phone: "", website: "", registration_number: "", partnership_type: "",
  roles_offered: "", locations: "", notes: "",
};

function PartnerApplyPage() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  function validate(): boolean {
    const errs: Partial<FormData> = {};
    if (!form.company_name.trim()) errs.company_name = "Required";
    if (!form.industry) errs.industry = "Required";
    if (!form.contact_person.trim()) errs.contact_person = "Required";
    if (!form.work_email.trim()) {
      errs.work_email = "Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.work_email)) {
      errs.work_email = "Invalid email";
    } else {
      const domain = form.work_email.split("@")[1]?.toLowerCase();
      if (FREE_DOMAINS.includes(domain ?? "")) errs.work_email = "Please use a company email address (not Gmail, Yahoo, etc.)";
    }
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) errs.phone = "Enter a valid 10-digit number";
    if (!form.registration_number.trim()) errs.registration_number = "Required";
    if (!form.partnership_type) errs.partnership_type = "Required";
    if (!form.roles_offered.trim()) errs.roles_offered = "Required";
    if (!form.locations.trim()) errs.locations = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  }

  const inputClass = (key: keyof FormData) =>
    `w-full rounded-2xl border bg-steel/40 px-5 py-3.5 text-sm text-navy outline-none transition placeholder:text-muted-foreground focus:bg-white focus:ring-2 focus:ring-gold/30 ${errors[key] ? "border-red-400 focus:border-red-400" : "border-steel focus:border-gold"}`;

  if (submitted) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <SiteNav />
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="max-w-md text-center">
            <span className="text-6xl">🎉</span>
            <h1 className="mt-6 font-display text-3xl font-bold text-navy">Application submitted!</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Thank you for applying to partner with MINDFULCAREER. Our team will review your application and get back to you within 3–5 business days.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav />

      <section className="bg-navy py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <span className="inline-block rounded-full bg-gold/20 px-5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-gold">
            PARTNERSHIP APPLICATION
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold text-white md:text-4xl">Apply to partner</h1>
          <p className="mt-3 text-sm text-white/60">All fields marked * are required. Use your company email address.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-steel bg-white p-8 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)] md:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy">Company Name *</label>
                <input value={form.company_name} onChange={set("company_name")} placeholder="Acme Corp" className={inputClass("company_name")} />
                {errors.company_name && <p className="mt-1 text-xs text-red-500">{errors.company_name}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy">Industry *</label>
                <select value={form.industry} onChange={set("industry")} className={inputClass("industry")}>
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </select>
                {errors.industry && <p className="mt-1 text-xs text-red-500">{errors.industry}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy">Contact Person *</label>
                <input value={form.contact_person} onChange={set("contact_person")} placeholder="Full name" className={inputClass("contact_person")} />
                {errors.contact_person && <p className="mt-1 text-xs text-red-500">{errors.contact_person}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy">Work Email * <span className="font-normal text-muted-foreground">(no Gmail/Yahoo)</span></label>
                <input type="email" value={form.work_email} onChange={set("work_email")} placeholder="you@company.com" className={inputClass("work_email")} />
                {errors.work_email && <p className="mt-1 text-xs text-red-500">{errors.work_email}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy">Phone *</label>
                <input value={form.phone} onChange={set("phone")} placeholder="10-digit mobile" className={inputClass("phone")} />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy">Website</label>
                <input value={form.website} onChange={set("website")} placeholder="https://company.com" className={inputClass("website")} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy">Registration / GST Number *</label>
                <input value={form.registration_number} onChange={set("registration_number")} placeholder="CIN or GST number" className={inputClass("registration_number")} />
                {errors.registration_number && <p className="mt-1 text-xs text-red-500">{errors.registration_number}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy">Partnership Type *</label>
                <select value={form.partnership_type} onChange={set("partnership_type")} className={inputClass("partnership_type")}>
                  <option value="">Select type</option>
                  {PARTNERSHIP_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                {errors.partnership_type && <p className="mt-1 text-xs text-red-500">{errors.partnership_type}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy">Roles / Programs Offered *</label>
              <input value={form.roles_offered} onChange={set("roles_offered")} placeholder="e.g. Software Engineer Intern, Data Analyst, MBA Scholarship" className={inputClass("roles_offered")} />
              {errors.roles_offered && <p className="mt-1 text-xs text-red-500">{errors.roles_offered}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy">Locations *</label>
              <input value={form.locations} onChange={set("locations")} placeholder="e.g. Bangalore, Mumbai, Remote" className={inputClass("locations")} />
              {errors.locations && <p className="mt-1 text-xs text-red-500">{errors.locations}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy">Additional Notes</label>
              <textarea rows={4} value={form.notes} onChange={set("notes")} placeholder="Any additional information about your partnership proposal…"
                className={`${inputClass("notes")} resize-y`} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full rounded-full bg-gold py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-navy transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(252,163,17,0.7)] disabled:opacity-50">
              {loading ? "Submitting…" : "Submit Application"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
