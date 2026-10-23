// Supabase Edge Function: create-payment-order
//
// SECRETS TO ADD in Supabase Dashboard → Project Settings → Edge Functions → Secrets:
//   RAZORPAY_KEY_ID      — your Razorpay Key ID (starts with rzp_live_ or rzp_test_)
//   RAZORPAY_KEY_SECRET  — your Razorpay Key Secret
//
// The secret key NEVER appears in frontend code.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { booking_id } = await req.json() as { booking_id: string };

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: booking, error } = await supabase
      .from("bookings")
      .select("id, amount, student_id")
      .eq("id", booking_id)
      .eq("status", "pending")
      .single();

    if (error || !booking) {
      return new Response(JSON.stringify({ error: "Booking not found or already paid" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const keyId = Deno.env.get("RAZORPAY_KEY_ID")!;
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
    const credentials = btoa(`${keyId}:${keySecret}`);

    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: (booking.amount as number) * 100, // paise
        currency: "INR",
        receipt: booking_id,
        notes: { booking_id },
      }),
    });

    const order = await orderRes.json() as { id: string };

    await supabase.from("payments").insert({
      booking_id,
      razorpay_order_id: order.id,
      amount: booking.amount,
      status: "created",
    });

    return new Response(
      JSON.stringify({ order_id: order.id, amount: (booking.amount as number) * 100, key_id: keyId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch {
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
