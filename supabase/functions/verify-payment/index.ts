// Supabase Edge Function: verify-payment
//
// SECRETS TO ADD:
//   RAZORPAY_WEBHOOK_SECRET — set this in Razorpay Dashboard → Webhooks → Secret
//
// In Razorpay Dashboard, add a webhook pointing to:
//   https://<your-project-ref>.supabase.co/functions/v1/verify-payment
// Events to subscribe: payment.captured, payment.failed

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET")!;

  // Verify signature
  const expectedSig = createHmac("sha256", webhookSecret).update(body).digest("hex");
  if (expectedSig !== signature) {
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const event = JSON.parse(body) as {
    event: string;
    payload: { payment: { entity: { order_id: string; id: string; status: string } } };
  };

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const orderId = event.payload.payment.entity.order_id;
  const paymentId = event.payload.payment.entity.id;

  if (event.event === "payment.captured") {
    // Find payment record
    const { data: payment } = await supabase
      .from("payments")
      .select("booking_id")
      .eq("razorpay_order_id", orderId)
      .single();

    if (payment?.booking_id) {
      // Confirm booking
      await supabase.from("bookings").update({ status: "confirmed" }).eq("id", payment.booking_id);
      // Update payment record
      await supabase.from("payments").update({ razorpay_payment_id: paymentId, status: "paid" })
        .eq("razorpay_order_id", orderId);
      // Send confirmation email (non-blocking)
      supabase.functions.invoke("send-email", {
        body: { type: "booking_confirmed", booking_id: payment.booking_id },
      }).catch(() => {});
    }
  }

  if (event.event === "payment.failed") {
    const { data: payment } = await supabase
      .from("payments")
      .select("booking_id")
      .eq("razorpay_order_id", orderId)
      .single();

    if (payment?.booking_id) {
      // Release the slot and cancel booking
      const { data: booking } = await supabase
        .from("bookings")
        .select("slot_id")
        .eq("id", payment.booking_id)
        .single();

      await supabase.from("bookings").update({ status: "cancelled" }).eq("id", payment.booking_id);
      await supabase.from("payments").update({ status: "failed" }).eq("razorpay_order_id", orderId);
      if (booking?.slot_id) {
        await supabase.from("availability_slots").update({ is_booked: false }).eq("id", booking.slot_id);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
