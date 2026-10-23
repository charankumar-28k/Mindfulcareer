// lib/pdf.ts — Branded PDF report generator
// Uses jsPDF (already available via CDN-style dynamic import fallback)
// Install: npm i jspdf   (add to package.json if not present)

import { supabase } from "./supabase";

const NAVY = [20, 33, 61] as [number, number, number];
const GOLD = [252, 163, 17] as [number, number, number];
const WHITE = [255, 255, 255] as [number, number, number];
const MUTED = [120, 120, 140] as [number, number, number];

const PATH_LABELS: Record<string, string> = {
  after12: "After 12th",
  higher: "Higher Study",
  govt: "Government Job",
  employment: "Employment",
  entrepreneur: "Entrepreneur",
  notsure: "Not Sure",
};

const PATH_OPTIONS: Record<string, string[]> = {
  after12: ["Explore JEE / NEET / CUET based on your stream", "Research colleges matching your budget and marks", "Apply for scholarships (NSP, state schemes)", "Attend open days and virtual college fairs", "Build a shortlist of 8–10 colleges across tiers"],
  higher: ["Shortlist 5 target programs and their deadlines", "Register for relevant entrance exams (CAT/GATE/GRE)", "Request 2–3 recommendation letters now", "Draft your Statement of Purpose outline", "Research funding: scholarships, loans, assistantships"],
  govt: ["Download the official syllabus for your target exam", "Create a 6-month study schedule with weekly targets", "Join a reputed test series for mock practice", "Revise current affairs daily (30 min minimum)", "Connect with successful candidates for strategy tips"],
  employment: ["Update your resume with a strong summary section", "Optimise your LinkedIn profile with keywords", "Apply to 5 relevant roles every weekday", "Prepare answers for the top 20 interview questions", "Build 2 portfolio projects relevant to your target role"],
  entrepreneur: ["Validate your idea with 10 potential customer interviews", "Register your business (Udyam / LLP / Pvt Ltd)", "Apply to startup incubators (NASSCOM, Atal, T-Hub)", "Build an MVP within 60 days with minimal features", "Identify 3 potential mentors in your domain"],
  notsure: ["Take a free aptitude and interest assessment online", "Shadow a professional in 2 fields that interest you", "Speak with 3 people working in careers you find appealing", "Explore NSDC skill courses to discover hidden strengths", "Book a counsellor session to map your interests to careers"],
};

const DISCLAIMER = "DISCLAIMER: This report is for informational purposes only. MINDFULCAREER does not guarantee admission to any institution, employment, or specific career outcomes. All guidance is based on information provided by the user. Please consult qualified professionals for legal, financial or medical advice.";

type Answers = Record<string, string | boolean | undefined>;

// Wrap text helper
function wrapText(doc: import("jspdf").jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export async function generateAndUploadPDF(answers: Answers, sessionId: string | null): Promise<string> {
  // Dynamic import so it doesn't bloat the initial bundle
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const W = 210;
  const H = 297;
  const margin = 20;
  const contentW = W - margin * 2;

  // ── COVER PAGE ──────────────────────────────────────────────
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, H, "F");

  // Gold accent bar
  doc.setFillColor(...GOLD);
  doc.rect(0, 0, 8, H, "F");

  // Logo text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...GOLD);
  doc.text("MINDFULCAREER", margin + 4, 50);

  doc.setFontSize(13);
  doc.setTextColor(...WHITE);
  doc.text("Career Guidance Report", margin + 4, 62);

  // Divider
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(margin + 4, 68, W - margin, 68);

  // Student name
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text(String(answers.name ?? "Student"), margin + 4, 90);

  // Details
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 220);
  const details = [
    `City: ${answers.city ?? "—"}`,
    `Age: ${answers.age ?? "—"}`,
    `Email: ${answers.email ?? "—"}`,
    `Career Path: ${PATH_LABELS[String(answers.path ?? "")] ?? "—"}`,
    `Generated: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
  ];
  details.forEach((d, i) => doc.text(d, margin + 4, 105 + i * 9));

  // Footer disclaimer on cover
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 140);
  doc.splitTextToSize(DISCLAIMER, contentW).forEach((line: string, i: number) => {
    doc.text(line, margin, H - 18 + i * 4);
  });

  // ── PAGE 2: PROFILE SUMMARY ──────────────────────────────────
  doc.addPage();
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, W, H, "F");

  // Header bar
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 18, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GOLD);
  doc.text("MINDFULCAREER — Career Guidance Report", margin, 12);

  let y = 32;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("Profile Summary", margin, y);
  y += 10;

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + 40, y);
  y += 8;

  const profileFields: [string, string][] = [
    ["Name", String(answers.name ?? "—")],
    ["Email", String(answers.email ?? "—")],
    ["Phone", String(answers.phone ?? "—")],
    ["City", String(answers.city ?? "—")],
    ["Age", String(answers.age ?? "—")],
    ["Career Path", PATH_LABELS[String(answers.path ?? "")] ?? "—"],
  ];

  if (answers.is_minor || (answers.age && parseInt(String(answers.age)) < 18)) {
    profileFields.push(["Parent/Guardian", String(answers.parent_name ?? "—")]);
  }

  doc.setFontSize(10);
  profileFields.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(value, margin + 40, y);
    y += 8;
  });

  // Interests & goal
  y += 4;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("Interests & Goals", margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 80);

  if (answers.interests) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.text("Interests:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 80);
    y = wrapText(doc, String(answers.interests), margin + 28, y, contentW - 28, 6);
    y += 4;
  }
  if (answers.worry) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.text("Biggest worry:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 80);
    y = wrapText(doc, String(answers.worry), margin + 38, y, contentW - 38, 6);
    y += 4;
  }
  if (answers.goal_words) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.text("Career goal:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 80);
    y = wrapText(doc, String(answers.goal_words), margin + 32, y, contentW - 32, 6);
  }

  // Footer
  addFooter(doc, W, H, margin, 2);

  // ── PAGE 3: RECOMMENDED OPTIONS + ACTION PLAN ────────────────
  doc.addPage();
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, W, H, "F");
  addHeader(doc, W, margin);

  y = 32;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("Recommended Options", margin, y);
  y += 8;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + 50, y);
  y += 10;

  const pathKey = String(answers["path"] ?? "notsure");
  const options = PATH_OPTIONS[pathKey] ?? PATH_OPTIONS["notsure"] ?? [];

  doc.setFontSize(10);
  options.forEach((opt) => {
    // Bullet circle
    doc.setFillColor(...GOLD);
    doc.circle(margin + 3, y - 2, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 60);
    y = wrapText(doc, opt, margin + 9, y, contentW - 9, 6);
    y += 4;
  });

  y += 6;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("30-60-90 Day Action Plan", margin, y);
  y += 8;
  doc.setDrawColor(...GOLD);
  doc.line(margin, y, margin + 60, y);
  y += 10;

  const plan = [
    { period: "Days 1–30", tasks: ["Complete your profile on MINDFULCAREER", "Research your top 3 options in depth", "Identify 2 mentors or counsellors to connect with", "Set up a daily 1-hour study/research routine"] },
    { period: "Days 31–60", tasks: ["Take one concrete action toward your top option", "Attend at least one webinar or info session", "Draft your application materials (resume/SOP/form)", "Track your progress weekly in a journal"] },
    { period: "Days 61–90", tasks: ["Submit your first application or registration", "Follow up on all pending actions", "Book a counsellor session to review your progress", "Celebrate small wins and adjust your plan"] },
  ];

  doc.setFontSize(10);
  plan.forEach(({ period, tasks }) => {
    doc.setFillColor(...NAVY);
    doc.roundedRect(margin, y - 4, contentW, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GOLD);
    doc.text(period, margin + 4, y + 1);
    y += 10;
    tasks.forEach((task) => {
      doc.setFillColor(...GOLD);
      doc.circle(margin + 3, y - 2, 1.5, "F");
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 60);
      y = wrapText(doc, task, margin + 8, y, contentW - 8, 6);
      y += 3;
    });
    y += 4;
  });

  addFooter(doc, W, H, margin, 3);

  // ── PAGE 4: RESOURCES + CTA ──────────────────────────────────
  doc.addPage();
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, W, H, "F");
  addHeader(doc, W, margin);

  y = 32;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("Key Resources & Schemes", margin, y);
  y += 8;
  doc.setDrawColor(...GOLD);
  doc.line(margin, y, margin + 55, y);
  y += 10;

  const resources = [
    "National Scholarship Portal (scholarships.gov.in) — central & state scholarships",
    "NSDC Skill India (skillindia.gov.in) — free skill development courses",
    "Startup India (startupindia.gov.in) — registration, funding, mentorship",
    "National Career Service Portal (ncs.gov.in) — jobs, internships, career guidance",
    "UGC / AICTE portals — approved colleges and programs",
    "iCall (9152987821) & Vandrevala Foundation (1860-2662-345) — mental health helplines",
  ];

  doc.setFontSize(10);
  resources.forEach((r) => {
    doc.setFillColor(...GOLD);
    doc.circle(margin + 3, y - 2, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 60);
    y = wrapText(doc, r, margin + 9, y, contentW - 9, 6);
    y += 4;
  });

  // CTA box
  y += 10;
  doc.setFillColor(...NAVY);
  doc.roundedRect(margin, y, contentW, 44, 4, 4, "F");
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GOLD);
  doc.text("Ready for personalised guidance?", margin + 8, y + 14);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 220);
  doc.text("Book a 1-to-1 session with a verified career counsellor matched to your path.", margin + 8, y + 24);
  doc.setFillColor(...GOLD);
  doc.roundedRect(margin + 8, y + 30, 60, 8, 3, 3, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("mindfulcareer.in/counsellors", margin + 12, y + 35.5);

  addFooter(doc, W, H, margin, 4);

  // ── OUTPUT ───────────────────────────────────────────────────
  const pdfBlob = doc.output("blob");

  // Try to upload to Supabase Storage
  if (sessionId) {
    const fileName = `reports/${sessionId}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("reports")
      .upload(fileName, pdfBlob, { contentType: "application/pdf", upsert: true });

    if (!uploadError && uploadData) {
      const { data: urlData } = supabase.storage.from("reports").getPublicUrl(fileName);
      if (urlData?.publicUrl) return urlData.publicUrl;
    }
  }

  // Fallback: return a local object URL
  return URL.createObjectURL(pdfBlob);
}

function addHeader(doc: import("jspdf").jsPDF, W: number, margin: number) {
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 18, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GOLD);
  doc.text("MINDFULCAREER — Career Guidance Report", margin, 12);
}

function addFooter(doc: import("jspdf").jsPDF, W: number, H: number, margin: number, pageNum: number) {
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  const lines = doc.splitTextToSize(DISCLAIMER, W - margin * 2) as string[];
  lines.forEach((line: string, i: number) => doc.text(line, margin, H - 14 + i * 3.5));
  doc.setFontSize(8);
  doc.text(`Page ${pageNum}`, W - margin, H - 6, { align: "right" });
}
