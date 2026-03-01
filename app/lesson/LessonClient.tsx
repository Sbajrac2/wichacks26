"use client";

import Link from "next/link";
import { useMemo, useState } from "react";


type Msg = { role: "user" | "assistant"; text: string };

function lessonContent(scenario: string) {
  if (scenario === "misgendering") {
    return {
      title: "Lesson: Misgendering (Quick, Calm, Clear)",
      sections: [
        {
          h: "What is it?",
          p: "Misgendering is using the wrong pronouns or gendered language for someone. It can be accidental, but the impact still matters.",
        },
        {
          h: "Your goal",
          p: "Correct it briefly, keep the moment respectful, and make it easy to move forward.",
        },
        {
          h: "Do this script",
          p: "1) Quick correction: “Just a quick note, Alex uses they/them.”\n2) Continue: “Anyway, as Alex was saying…”",
        },
        {
          h: "Avoid this",
          p: "Do not make it a lecture. Do not force the person to explain themselves. Do not turn it into a debate.",
        },
        {
          h: "Power move",
          p: "Model it naturally: repeat the correct pronoun once in your next sentence so it sticks without drama.",
        },
      ],
    };
  }

  if (scenario === "racial-microaggressions") {
    return {
      title: "Lesson: Racial Microaggressions (Professional Pushback)",
      sections: [
        {
          h: "What is it?",
          p: "A microaggression is a subtle comment or “joke” that stereotypes or dismisses someone’s identity. It can be framed as harmless, but it still lands as disrespect.",
        },
        {
          h: "Your goal",
          p: "Interrupt the moment, set a boundary, and redirect to respectful behavior without starting a public war.",
        },
        {
          h: "Simple scripts you can use",
          p: "Option A (curious): “What do you mean by that?”\nOption B (boundary): “I do not think that’s appropriate.”\nOption C (impact): “That can come off as stereotyping. Let’s avoid that.”",
        },
        {
          h: "If they get defensive",
          p: "Stay calm: “I’m not saying you meant harm. I’m saying the impact can be harmful.”\nThen redirect: “Let’s get back to the topic.”",
        },
        {
          h: "Power move",
          p: "Name the standard: “We’re trying to keep this space respectful and professional.” Standards beat arguments.",
        },
      ],
    };
  }

  return {
    title: "Lesson: Gender Bias (Back Someone Up Without Chaos)",
    sections: [
      {
        h: "What is it?",
        p: "Gender bias in meetings often looks like interruptions, credit-stealing, or treating someone as less technical or less leadership-ready.",
      },
      {
        h: "Your goal",
        p: "Support the person being undermined and reset the meeting norms without making them do all the emotional labor.",
      },
      {
        h: "Useful scripts",
        p: "Credit: “I want to highlight that Maya suggested this earlier. Maya, want to expand?”\nInterruptions: “Hold on, I want to hear Maya finish.”\nDismissal: “Let’s evaluate the idea on the merits.”",
      },
      {
        h: "Avoid this",
        p: "Do not speak over them to “save” them. Do not make it about your hero moment.",
      },
      {
        h: "Power move",
        p: "Circle back intentionally: “Before we move on, we should answer Maya’s question.”",
      },
    ],
  };
}

export default function LessonClient({ scenario }: { scenario: string }) {
  const lesson = useMemo(() => lessonContent(scenario), [scenario]);

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Ask me anything about this lesson. I can help you craft a response that sounds professional and human.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next: Msg[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario,
          lessonTitle: lesson.title,
          lessonSummary: lesson.sections.map((s) => `${s.h}: ${s.p}`).join("\n"),
          message: text,
        }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };
      const reply =
        data.reply ??
        data.error ??
        "No response. Either Gemini is sleepy or your key is missing.";

      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Network error. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 pb-40">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/" className="text-sm text-slate-300 hover:text-white">
        ← Back
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight">{lesson.title}</h1>

        <div className="mt-8 space-y-6">
          {lesson.sections.map((s, i) => (
            <section
              key={i}
              className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6"
            >
              <h2 className="text-lg font-semibold">{s.h}</h2>
              <p className="mt-3 whitespace-pre-line text-slate-200">{s.p}</p>
            </section>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/95">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="text-sm font-semibold">Lesson Q&A (Gemini)</div>

          <div className="mt-3 max-h-44 overflow-auto rounded-xl border border-slate-800 bg-slate-900/30 p-3">
            {messages.map((m, idx) => (
              <div key={idx} className="mb-3">
                <div className="text-xs text-slate-400">
                  {m.role === "user" ? "You" : "Coach"}
                </div>
                <div className="mt-1 whitespace-pre-wrap text-sm text-slate-100">
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-sm text-slate-400">Thinking...</div>}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="Ask a question about what to say."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-3 text-sm text-slate-100 outline-none focus:border-slate-600"
            />
            <button
              onClick={send}
              disabled={loading}
              className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
