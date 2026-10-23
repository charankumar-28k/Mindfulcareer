import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({ meta: [{ title: "Terms of Service — MINDFULCAREER" }] }),
});

function TermsPage() {
  return <LegalPage title="Terms of Service" updated="1 July 2025" sections={TERMS_SECTIONS} />;
}

function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { heading: string; body: string }[] }) {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav />
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-4xl font-bold text-white">{title}</h1>
          <p className="mt-3 text-sm text-white/60">Last updated: {updated}</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-display text-lg font-bold text-navy">{s.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

const TERMS_SECTIONS = [
  { heading: "1. Acceptance of Terms", body: "By accessing or using MINDFULCAREER, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform." },
  { heading: "2. Services", body: "MINDFULCAREER provides career guidance tools, paid counselling sessions, and company partnership services. The chatbot guidance is informational only and does not constitute professional advice." },
  { heading: "3. User Accounts", body: "You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration. We reserve the right to suspend accounts that violate these terms." },
  { heading: "4. Payments", body: "All payments are processed securely via Razorpay. Prices are in Indian Rupees (INR) and inclusive of applicable taxes. Bookings are confirmed only after successful payment." },
  { heading: "5. Cancellation & Refunds", body: "Sessions may be cancelled free of charge up to 24 hours before the scheduled time. Cancellations within 24 hours are non-refundable. Refunds are processed within 5–7 business days." },
  { heading: "6. Disclaimer", body: "MINDFULCAREER does not guarantee admission to any institution, employment, or specific career outcomes. All guidance is informational and based on the information provided by the user." },
  { heading: "7. Privacy", body: "Your use of MINDFULCAREER is also governed by our Privacy Policy. We collect and process data as described therein." },
  { heading: "8. Changes", body: "We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms." },
  { heading: "9. Contact", body: "For questions about these terms, contact us at legal@mindfulcareer.in." },
];
