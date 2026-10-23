import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { RobotIcon } from "@/components/site-nav";

export const Route = createFileRoute("/guidance")({
  component: GuidancePage,
  head: () => ({
    meta: [
      { title: "Free Career Guidance — MINDFULCAREER" },
      { name: "description", content: "Answer a few questions and get a personalised career guidance report — completely free." },
    ],
  }),
});

type Path = "after12" | "higher" | "govt" | "employment" | "entrepreneur" | "notsure";

interface Message {
  id: string;
  from: "bot" | "user";
  text: string;
}

interface Answers {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  age?: string;
  parent_name?: string;
  parent_phone?: string;
  consent?: boolean;
  path?: Path;
  interest1?: string;
  interest2?: string;
  interest3?: string;
  [key: string]: string | boolean | undefined;
}

const HELPLINE_KEYWORDS = ["hopeless", "suicide", "end my life", "can't go on", "severe stress", "no point", "give up"];

const PATH_QUESTIONS: Record<string, { key: string; q: string; options?: string[] }[]> = {
  after12: [
    { key: "stream", q: "Which stream are you in — Science, Commerce, Arts, or Vocational?", options: ["Science", "Commerce", "Arts", "Vocational"] },
    { key: "marks", q: "What percentage are you expecting or did you score in Class 12?" },
    { key: "exams", q: "Which entrance exams are you considering? (e.g. JEE, NEET, CUET, CLAT)" },
    { key: "budget", q: "What is your approximate annual family budget for education?", options: ["Under ₹1L", "₹1L–3L", "₹3L–10L", "Above ₹10L"] },
    { key: "relocation", q: "Are you open to relocating to another city or state?", options: ["Yes, anywhere", "Same state only", "No, staying local"] },
  ],
  higher: [
    { key: "degree", q: "What is your current degree and year?" },
    { key: "target_field", q: "Which field do you want to pursue for higher studies?" },
    { key: "goal", q: "What is your goal?", options: ["Masters (India)", "MBA", "PhD", "Study Abroad"] },
    { key: "exams_higher", q: "Which exams are you preparing for? (e.g. CAT, GATE, GRE, IELTS)" },
    { key: "funding", q: "How do you plan to fund your higher studies?", options: ["Self-funded", "Education loan", "Scholarship", "Employer sponsorship"] },
  ],
  govt: [
    { key: "qualification", q: "What is your highest qualification?" },
    { key: "exam_family", q: "Which exam family interests you?", options: ["UPSC Civil Services", "SSC", "Banking (IBPS/SBI)", "Railways", "State PSC", "Defence"] },
    { key: "age_govt", q: "What is your current age?" },
    { key: "attempts", q: "How many attempts have you already made?" },
    { key: "study_hours", q: "How many hours per day can you dedicate to preparation?", options: ["1–2 hrs", "3–4 hrs", "5–6 hrs", "7+ hrs"] },
  ],
  employment: [
    { key: "education", q: "What is your highest education level?" },
    { key: "skills", q: "List your top 3 skills (e.g. Python, Sales, Design)" },
    { key: "experience", q: "How many years of work experience do you have?", options: ["Fresher", "0–1 year", "1–3 years", "3–5 years", "5+ years"] },
    { key: "target_role", q: "What kind of role are you targeting?" },
    { key: "location", q: "Which city or region are you targeting for work?" },
  ],
  entrepreneur: [
    { key: "idea", q: "Describe your business idea in one sentence." },
    { key: "stage", q: "What stage is your idea at?", options: ["Just an idea", "Validated concept", "MVP built", "Revenue generating"] },
    { key: "capital", q: "How much capital do you have or can access?", options: ["Under ₹1L", "₹1L–5L", "₹5L–25L", "Above ₹25L"] },
    { key: "team", q: "Do you have a co-founder or team?", options: ["Solo", "Co-founder only", "Small team (2–5)", "Team of 5+"] },
    { key: "biggest_need", q: "What is your biggest need right now?", options: ["Mentorship", "Funding", "Technical help", "Market validation", "Legal/compliance"] },
  ],
  notsure: [
    { key: "interest1", q: "What subject or activity do you enjoy the most?" },
    { key: "interest2", q: "Do you prefer working with people, data, or things?", options: ["People", "Data/Numbers", "Things/Machines", "Ideas/Creativity"] },
    { key: "interest3", q: "What does success look like to you in 5 years?", options: ["Stable government job", "High-paying corporate role", "Own business", "Academic/research career", "Creative career"] },
  ],
};

const PATH_LABELS: Record<Path, string> = {
  after12: "After 12th",
  higher: "Higher Study",
  govt: "Government Job",
  employment: "Employment",
  entrepreneur: "Entrepreneur",
  notsure: "Not Sure",
};

function uid() {
  return Math.random().toString(36).slice(2);
}

const stageAQuestions = [
    { key: "name", q: "Hi! I'm your MINDFULCAREER guide 👋 What's your full name?", validate: (v: string) => v.trim().length >= 2 || "Please enter your full name." },
    { key: "email", q: "Great! What's your email address?", validate: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Please enter a valid email." },
    { key: "phone", q: "What's your 10-digit mobile number?", validate: (v: string) => /^\d{10}$/.test(v.replace(/\s/g, "")) || "Please enter a valid 10-digit number." },
    { key: "city", q: "Which city are you from?", validate: (v: string) => v.trim().length >= 2 || "Please enter your city." },
    { key: "age", q: "How old are you?", validate: (v: string) => /^\d+$/.test(v) && +v >= 10 && +v <= 60 || "Please enter a valid age (10–60)." },
  ];

const minorQuestions = [
    { key: "parent_name", q: "Since you're under 18, we need a parent/guardian's name for consent. What is their full name?" },
    { key: "parent_phone", q: "What is your parent/guardian's 10-digit mobile number?", validate: (v: string) => /^\d{10}$/.test(v.replace(/\s/g, "")) || "Please enter a valid 10-digit number." },
  ];

const stageDQuestions = [
    { key: "interests", q: "What are your top interests or hobbies? (e.g. coding, music, sports)" },
    { key: "worry", q: "What is your biggest worry about your career right now?" },
    { key: "goal_words", q: "In your own words, what is your career goal?" },
  ];

function GuidancePage() {
  const [messages, setMessages] = useState<Message[]>([{ id: "init", from: "bot", text: stageAQuestions[0]!.q }]);
  const [answers, setAnswers] = useState<Answers>({});
  const [stage, setStage] = useState<"A" | "B" | "C" | "D" | "done">("A");
  const [stepIndex, setStepIndex] = useState(0);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [completed, setCompleted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalSteps = stageAQuestions.length + 1 + (PATH_QUESTIONS[answers.path ?? "after12"]?.length ?? 5) + stageDQuestions.length;
  const currentStep =
    stage === "A" ? stepIndex
    : stage === "B" ? stageAQuestions.length
    : stage === "C" ? stageAQuestions.length + 1 + stepIndex
    : stage === "D" ? stageAQuestions.length + 1 + (PATH_QUESTIONS[answers.path ?? "after12"]?.length ?? 5) + stepIndex
    : totalSteps;

  const progress = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  function addBot(text: string) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: uid(), from: "bot", text }]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }, 900);
  }

  function addUser(text: string) {
    setMessages((m) => [...m, { id: uid(), from: "user", text }]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }



  function saveProgress(_answers: Answers, _status: string) {
    // Frontend-only: no DB
  }

  function checkHelpline(text: string) {
    return HELPLINE_KEYWORDS.some((kw) => text.toLowerCase().includes(kw));
  }

  async function handleAnswer(value: string) {
    if (!value.trim()) return;
    addUser(value);
    setInput("");

    if (checkHelpline(value)) {
      addBot("I hear you, and I want you to know you're not alone 💙 Please reach out to iCall (9152987821) or Vandrevala Foundation (1860-2662-345) — they're available 24/7. Would you still like to continue with guidance, or would you prefer to speak with a counsellor?");
      return;
    }

    const updatedAnswers = { ...answers };

    if (stage === "A" && stepIndex < stageAQuestions.length) {
      const q = stageAQuestions[stepIndex]!;
      const validation = q.validate?.(value);
      if (typeof validation === "string") {
        addBot(`⚠️ ${validation} Please try again.`);
        return;
      }
      updatedAnswers[q.key] = value;
      setAnswers(updatedAnswers);

      const isMinor = q.key === "age" && parseInt(value) < 18;

      if (q.key === "age" && isMinor) {
        saveProgress(updatedAnswers, "in_progress");
        setStepIndex(stageAQuestions.length);
        addBot(minorQuestions[0]!.q);
        return;
      }

      if (stepIndex < stageAQuestions.length - 1) {
        saveProgress(updatedAnswers, "in_progress");
        setStepIndex(stepIndex + 1);
        addBot(stageAQuestions[stepIndex + 1]!.q);
      } else {
        saveProgress(updatedAnswers, "in_progress");
        setStage("B");
        setStepIndex(0);
        addBot(`Thanks ${String(updatedAnswers.name ?? "").split(" ")[0]}! 🎉 Now, which career path best describes where you are?\n\n• After 12th\n• Higher Study\n• Govt Job\n• Employment\n• Entrepreneur\n• Not Sure`);
      }
    } else if (stage === "A" && stepIndex >= stageAQuestions.length) {
      // minor questions
      const mqIndex = stepIndex - stageAQuestions.length;
      const mq = minorQuestions[mqIndex]!;
      const validation = (mq as { validate?: (v: string) => string | boolean }).validate?.(value);
      if (typeof validation === "string") {
        addBot(`⚠️ ${validation} Please try again.`);
        return;
      }
      updatedAnswers[mq.key] = value;
      setAnswers(updatedAnswers);

      if (mqIndex < minorQuestions.length - 1) {
        setStepIndex(stepIndex + 1);
        addBot(minorQuestions[mqIndex + 1]!.q);
      } else {
        saveProgress(updatedAnswers, "in_progress");
        setStage("B");
        setStepIndex(0);
        addBot(`Thanks! Now, which career path best describes where you are?\n\n• After 12th\n• Higher Study\n• Govt Job\n• Employment\n• Entrepreneur\n• Not Sure`);
      }
    } else if (stage === "B") {
      const pathMap: Record<string, Path> = {
        "after 12th": "after12", "after12": "after12",
        "higher study": "higher", "higher": "higher",
        "govt job": "govt", "govt": "govt", "government": "govt",
        "employment": "employment",
        "entrepreneur": "entrepreneur",
        "not sure": "notsure", "notsure": "notsure",
      };
      const chosen = pathMap[value.toLowerCase().trim()];
      if (!chosen) {
        addBot("Please choose one of: After 12th, Higher Study, Govt Job, Employment, Entrepreneur, or Not Sure.");
        return;
      }
      updatedAnswers.path = chosen;
      setAnswers(updatedAnswers);
      saveProgress(updatedAnswers, "in_progress");
      setStage("C");
      setStepIndex(0);
      const firstQ = PATH_QUESTIONS[chosen][0];
      addBot(`Great choice — ${PATH_LABELS[chosen]}! Let me ask you a few more questions.\n\n${firstQ.q}`);
    } else if (stage === "C") {
      const pathQs = PATH_QUESTIONS[answers.path ?? "after12"] ?? [];
      const q = pathQs[stepIndex];
      if (!q) return;
      updatedAnswers[q.key] = value;
      setAnswers(updatedAnswers);
      saveProgress(updatedAnswers, "in_progress");

      if (stepIndex < pathQs.length - 1) {
        setStepIndex(stepIndex + 1);
        addBot(pathQs[stepIndex + 1]!.q);
      } else {
        setStage("D");
        setStepIndex(0);
        addBot(stageDQuestions[0]!.q);
      }
    } else if (stage === "D") {
      const q = stageDQuestions[stepIndex];
      if (!q) return;
      updatedAnswers[q.key] = value;
      setAnswers(updatedAnswers);

      if (stepIndex < stageDQuestions.length - 1) {
        setStepIndex(stepIndex + 1);
        addBot(stageDQuestions[stepIndex + 1]!.q);
      } else {
        saveProgress(updatedAnswers, "in_progress");
        setStage("done");
        const summary = `Here's a summary of your profile:\n\n👤 ${String(updatedAnswers.name ?? "")} | ${String(updatedAnswers.city ?? "")} | Age ${String(updatedAnswers.age ?? "")}\n📧 ${String(updatedAnswers.email ?? "")}\n🎯 Path: ${PATH_LABELS[updatedAnswers.path as Path] ?? ""}\n💭 Goal: ${String(updatedAnswers["goal_words"] ?? "")}\n\nDoes this look correct? Reply "Yes" to generate your report or "No" to make corrections.`;
        addBot(summary);
      }
    } else if (stage === "done") {
      if (value.toLowerCase().startsWith("y")) {
        saveProgress(answers, "completed");
        setCompleted(true);
        addBot("🎉 Your guidance is complete! Sign up to access your full personalised report on your dashboard.");
      } else {
        setStage("A");
        setStepIndex(0);
        setAnswers({});
        addBot("No problem! Let's start over. What's your full name?");
      }
    }
  }

  function handleOptionClick(option: string) {
    handleAnswer(option);
  }

  function getCurrentOptions(): string[] | undefined {
    if (stage === "B") return ["After 12th", "Higher Study", "Govt Job", "Employment", "Entrepreneur", "Not Sure"];
    if (stage === "C") {
      const pathQs = PATH_QUESTIONS[answers.path ?? "after12"] ?? [];
      return pathQs[stepIndex]?.options;
    }
    if (stage === "done") return ["Yes, looks correct", "No, let me correct"];
    return undefined;
  }

  const options = getCurrentOptions();

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <SiteNav />

      <main className="flex flex-1 flex-col">
        {/* Progress bar */}
        <div className="sticky top-[57px] z-40 bg-white shadow-sm">
          <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Career Guidance</span>
              <span>{progress}% complete</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-steel">
              <div
                className="h-full rounded-full bg-gold transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                {msg.from === "bot" && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy">
                    <RobotIcon />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-3xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.from === "bot"
                      ? "rounded-tl-sm bg-steel text-navy"
                      : "rounded-tr-sm bg-navy text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy">
                  <RobotIcon />
                </div>
                <div className="flex items-center gap-1.5 rounded-3xl rounded-tl-sm bg-steel px-5 py-4">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-navy/40"
                      style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Option buttons */}
            {!typing && options && !completed && (
              <div className="flex flex-wrap gap-2 pl-14">
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleOptionClick(opt)}
                    className="rounded-full border-2 border-navy px-5 py-2 font-display text-sm font-semibold text-navy transition hover:bg-navy hover:text-white"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {completed && (
              <div className="rounded-3xl border border-steel bg-white p-8 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]">
                <h2 className="font-display text-xl font-bold text-navy">Your guidance is complete! 🎉</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sign up to get your personalised career report and save it to your dashboard.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/signup"
                    className="rounded-full bg-gold px-7 py-3 font-display text-sm font-bold text-navy transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(252,163,17,0.7)]">
                    Create free account
                  </Link>
                  <Link to="/counsellors"
                    className="rounded-full border-2 border-navy px-7 py-3 font-display text-sm font-bold text-navy transition hover:bg-navy hover:text-white">
                    Book a counsellor
                  </Link>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  <Link to="/signup" className="font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4">
                    Create a free account
                  </Link>{" "}
                  to save your report and access it anytime.
                </p>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input area */}
        {!completed && (
          <div className="sticky bottom-0 border-t border-steel bg-white px-4 py-4 sm:px-6">
            <div className="mx-auto flex max-w-3xl gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnswer(input)}
                placeholder="Type your answer…"
                className="flex-1 rounded-full border border-steel bg-steel/40 px-5 py-3 text-sm text-navy outline-none transition placeholder:text-muted-foreground focus:border-gold focus:bg-white focus:ring-2 focus:ring-gold/30"
              />
              <button
                type="button"
                onClick={() => handleAnswer(input)}
                disabled={!input.trim() || typing}
                className="rounded-full bg-gold px-6 py-3 font-display text-sm font-bold text-navy transition hover:-translate-y-0.5 disabled:opacity-40"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Your answers are saved securely. You can resume anytime.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
