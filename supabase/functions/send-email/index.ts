// Supabase Edge Function: send-email
//
// SECRETS TO ADD in Supabase Dashboard → Project Settings → Edge Functions → Secrets:
//   RESEND_API_KEY     — your Resend API key from resend.com (free tier: 3000 emails/month)
//   FROM_EMAIL         — e.g. noreply@mindfulcarer.in (must be a verified domain in Resend)
//
// This function handles:
//   type = "booking_confirmed"  → email student + counsellor with meeting link
//   type = "booking_reminder"   → 1-hour-before reminder (call from a cron job or pg_cron)
//   type = "refund_issued"      → notify student of refund

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: Deno.env.get("FROM_EMAIL") ?? "noreply@mindfulcarer.in",
      to,
      subject,
      html,
    }),
  });
  return res.ok;
}

function bookingConfirmedHtml(studentName: string, counsellorName: string, dateStr: string, meetingLink: string) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
      <div style="background:#14213D;border-radius:16px;padding:32px;text-align:center">
        <h1 style="color:#FCA311;font-size:24px;margin:0">MINDFULCARER</h1>
        <p style="color:#fff;margin:8px 0 0">Booking Confirmed 🎉</p>
      </div>
      <div style="padding:32px 0">
        <p style="color:#14213D;font-size:16px">Hi <strong>${studentName}</strong>,</p>
        <p style="color:#555">Your session with <strong>${counsellorName}</strong> is confirmed.</p>
        <p style="color:#555"><strong>Date & Time:</strong> ${dateStr}</p>
        ${meetingLink ? `<p style="color:#555"><strong>Meeting Link:</strong> <a href="${meetingLink}" style="color:#FCA311">${meetingLink}</a></p>` : ""}
        <a href="${meetingLink || "#"}" style="display:inline-block;margin-top:16px;background:#FCA311;color:#14213D;font-weight:700;padding:12px 28px;border-radius:999px;text-decoration:none">
          Join Session
        </a>
        <hr style="border:none;border-top:1px solid #E5E5E5;margin:32px 0">
        <p style="color:#999;font-size:12px">
          Free cancellation up to 24 hours before the session. No refund for cancellations within 24 hours.<br>
          MINDFULCARER does not guarantee specific career outcomes. All guidance is informational.
        </p>
      </div>
    </div>`;
}

function reminderHtml(name: string, counsellorName: string, meetingLink: string) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
      <div style="background:#14213D;border-radius:16px;padding:32px;text-align:center">
        <h1 style="color:#FCA311;font-size:24px;margin:0">MINDFULCARER</h1>
        <p style="color:#fff;margin:8px 0 0">Session in 1 hour ⏰</p>
      </div>
      <div style="padding:32px 0">
        <p style="color:#14213D;font-size:16px">Hi <strong>${name}</strong>,</p>
        <p style="color:#555">Your session with <strong>${counsellorName}</strong> starts in 1 hour.</p>
        ${meetingLink ? `<a href="${meetingLink}" style="display:inline-block;margin-top:16px;background:#FCA311;color:#14213D;font-weight:700;padding:12px 28px;border-radius:999px;text-decoration:none">Join Session Now</a>` : ""}
      </div>
    </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json() as {
      type: "booking_confirmed" | "booking_reminder" | "refund_issued";
      booking_id: string;
    };

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: booking } = await supabase
      .from("bookings")
      .select(`
        id, meeting_link, status,
        availability_slots(start_time),
        student_profiles!inner(full_name, email),
        counsellors!inner(full_name, user_id)
      `)
      .eq("id", body.booking_id)
      .single();

    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get counsellor email from profiles
    const { data: counsellorProfile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", (booking.counsellors as Record<string, unknown>).user_id)
      .single();

    const studentName = (booking.student_profiles as Record<string, unknown>).full_name as string ?? "Student";
    const studentEmail = (booking.student_profiles as Record<string, unknown>).email as string ?? "";
    const counsellorName = (booking.counsellors as Record<string, unknown>).full_name as string ?? "Counsellor";
    const counsellorEmail = counsellorProfile?.email ?? "";
    const meetingLink = booking.meeting_link ?? "";
    const slotTime = (booking.availability_slots as Record<string, unknown>)?.start_time as string ?? "";
    const dateStr = slotTime ? new Date(slotTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "short" }) : "";

    if (body.type === "booking_confirmed") {
      const html = bookingConfirmedHtml(studentName, counsellorName, dateStr, meetingLink);
      await Promise.all([
        studentEmail && sendEmail(studentEmail, "Your session is confirmed — MINDFULCARER", html),
        counsellorEmail && sendEmail(counsellorEmail, `New session booked: ${studentName} — MINDFULCARER`, html),
      ]);
    }

    if (body.type === "booking_reminder") {
      const html = reminderHtml(studentName, counsellorName, meetingLink);
      await Promise.all([
        studentEmail && sendEmail(studentEmail, "Your session starts in 1 hour — MINDFULCARER", html),
        counsellorEmail && sendEmail(counsellorEmail, `Session in 1 hour: ${studentName} — MINDFULCARER`, html),
      ]);
    }

    if (body.type === "refund_issued") {
      const html = `<div style="font-family:sans-serif;padding:32px"><p>Hi ${studentName},</p><p>Your refund for the session with ${counsellorName} has been initiated. It will reflect in 5–7 business days.</p><p style="color:#999;font-size:12px">MINDFULCARER</p></div>`;
      studentEmail && await sendEmail(studentEmail, "Refund initiated — MINDFULCARER", html);
    }

    return new Response(JSON.stringify({ sent: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
