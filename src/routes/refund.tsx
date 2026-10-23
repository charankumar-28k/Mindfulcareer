import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/refund")({
  component: RefundPage,
  head: () => ({ meta: [{ title: "Refund & Cancellation Policy — MINDFULCAREER" }] }),
});

function RefundPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav />
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-4xl font-bold text-white">Refund & Cancellation Policy</h1>
          <p className="mt-3 text-sm text-white/60">Last updated: 1 July 2025</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
          <div className="rounded-3xl border border-gold bg-gold/10 p-6">
            <h2 className="font-display text-base font-bold text-navy">Summary</h2>
            <ul className="mt-3 space-y-2 text-sm text-navy">
              <li>✓ Free cancellation up to 24 hours before the session</li>
              <li>✗ No refund for cancellations within 24 hours of the session</li>
              <li>✓ Full refund if the counsellor cancels</li>
              <li>✓ Admin can issue refunds in exceptional cases</li>
            </ul>
          </div>
          {[
            { h: "Cancellation by Student", b: "You may cancel a booked session free of charge up to 24 hours before the scheduled start time. Cancellations made within 24 hours of the session are non-refundable. To cancel, go to your Student Dashboard and click 'Cancel session'." },
            { h: "Cancellation by Counsellor", b: "If a counsellor cancels a confirmed session, you will receive a full refund within 5–7 business days. You will also be offered priority rebooking with the same or another counsellor." },
            { h: "Refund Process", b: "Approved refunds are processed to the original payment method within 5–7 business days. Razorpay processing times may vary. You will receive an email confirmation when the refund is initiated." },
            { h: "Exceptional Circumstances", b: "In cases of technical failure, medical emergency, or other exceptional circumstances, please contact us at support@mindfulcareer.in. Our admin team reviews such requests on a case-by-case basis." },
            { h: "No-Show Policy", b: "If you do not attend a session without prior cancellation, the session fee is forfeited. The counsellor's time is reserved exclusively for you." },
            { h: "Contact", b: "For refund queries, email support@mindfulcareer.in with your booking ID and reason." },
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
