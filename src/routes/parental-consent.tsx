import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/parental-consent")({
  component: ParentalConsentPage,
  head: () => ({ meta: [{ title: "Parental Consent — MINDFULCAREER" }] }),
});

function ParentalConsentPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav />
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-4xl font-bold text-white">Parental Consent Policy</h1>
          <p className="mt-3 text-sm text-white/60">Last updated: 1 July 2025</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
          {[
            { h: "Who This Applies To", b: "This policy applies to all users under the age of 18 (minors) who use the MINDFULCAREER platform, including the career guidance chatbot, counselling booking, and any other services." },
            { h: "Parental Consent Requirement", b: "Minors must obtain explicit consent from a parent or legal guardian before using MINDFULCAREER. During the chatbot flow, minors are required to provide their parent/guardian's name and phone number, and check a consent checkbox confirming that their parent/guardian has agreed to their use of the platform." },
            { h: "What Parents/Guardians Consent To", b: "By providing consent, parents/guardians agree to: (1) their child using the MINDFULCAREER career guidance chatbot; (2) collection of their child's personal information as described in our Privacy Policy; (3) their child booking paid counselling sessions (payment must be made by the parent/guardian)." },
            { h: "Parent/Guardian Contact", b: "We may contact the parent/guardian's phone number provided during registration to verify consent or for important communications related to the minor's account." },
            { h: "Data Protection for Minors", b: "We take extra care to protect the data of minor users. Minor user data is never shared with third parties without explicit parental consent. Parents/guardians may request access to, correction of, or deletion of their child's data at any time." },
            { h: "Withdrawing Consent", b: "Parents/guardians may withdraw consent at any time by contacting us at privacy@mindfulcareer.in. Upon withdrawal, the minor's account will be deactivated and their data deleted within 30 days." },
            { h: "Contact", b: "For questions about our parental consent policy, contact us at privacy@mindfulcareer.in or call +91 98765 43210." },
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
