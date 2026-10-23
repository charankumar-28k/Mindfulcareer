// Supabase Edge Function: generate-ai-summary
//
// SECRETS TO ADD in Supabase Dashboard → Project Settings → Edge Functions → Secrets:
//   ANTHROPIC_API_KEY  — your Claude API key from console.anthropic.com
//
// This function is called after the chatbot completes.
// It sends the student's answers to Claude and saves a short summary + 5 next steps.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { student_profile_id } = await req.json() as { student_profile_id: string };

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: profile, error } = await supabase
      .from("student_profiles")
      .select("full_name, age, city, track, answers")
      .eq("id", student_profile_id)
      .single();

    if (error || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const answers = profile.answers as Record<string, string>;
    const prompt = `You are a compassionate career counsellor in India. Based on the following student profile, write:
1. A short personalised summary (2-3 sentences) of their career situation and strengths.
2. Exactly 5 concrete next steps they should take in the next 30 days.

Student profile:
- Name: ${profile.full_name}
- Age: ${profile.age}, City: ${profile.city}
- Career path chosen: ${profile.track}
- Their answers: ${JSON.stringify(answers, null, 2)}

Format your response as JSON: { "summary": "...", "next_steps": ["step1", "step2", "step3", "step4", "step5"] }
Keep the tone warm, encouraging and practical. Do not promise specific outcomes or admissions.`;

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const claudeData = await claudeRes.json() as {
      content: { type: string; text: string }[];
    };

    const rawText = claudeData.content?.[0]?.text ?? "";
    // Extract JSON from the response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) as { summary: string; next_steps: string[] } : null;

    const aiSummary = parsed
      ? `${parsed.summary}\n\nNext steps:\n${parsed.next_steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`
      : rawText;

    await supabase
      .from("student_profiles")
      .update({ ai_summary: aiSummary })
      .eq("id", student_profile_id);

    return new Response(
      JSON.stringify({ summary: aiSummary, next_steps: parsed?.next_steps ?? [] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
