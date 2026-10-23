import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({ meta: [{ title: "Privacy Policy — MINDFULCAREER" }] }),
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav />
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-3 text-sm text-white/60">Last updated: 1 July 2025</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
          {[
            { h: "1. Information We Collect", b: "We collect information you provide directly (name, email, phone, career answers), information collected automatically (usage data, device info), and information from third parties (payment processors)." },
            { h: "2. How We Use Your Information", b: "We use your information to provide and improve our services, personalise your career guidance, process payments, send session reminders, and communicate with you about your account." },
            { h: "3. Data Sharing", b: "We share your information with counsellors you book sessions with (limited to session-relevant data), payment processors (Razorpay), and company partners only with your explicit consent. We do not sell your data." },
            { h: "4. Data Security", b: "We use industry-standard encryption and Supabase Row Level Security to protect your data. Access is strictly controlled by role-based permissions." },
            { h: "5. Data Retention", b: "We retain your data for as long as your account is active. You may request deletion of your account and all associated data at any time." },
            { h: "6. Minors", b: "Users under 18 must provide parental consent. We collect parent/guardian contact information for minor users and require explicit consent before processing their data." },
            { h: "7. Your Rights", b: "You have the right to access, correct, or delete your personal data. Contact us at privacy@mindfulcareer.in to exercise these rights." },
            { h: "8. Cookies", b: "We use essential cookies for authentication and session management. We do not use tracking or advertising cookies." },
            { h: "9. Contact", b: "For privacy-related queries, contact our Data Protection Officer at privacy@mindfulcareer.in." },
          ].map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-lg font-bold text-navy">{s.h}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.b}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
