"use client";

import { useEffect, useState } from "react";
import ScenarioCard from "./components/ScenarioCard";
import StreakButton from "./components/StreakButton";
import { getCompletedCount } from "./lib/progress";
import { markStreakOncePerDay } from "./components/StreakButton";

export default function Home() {
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    setBadgeCount(getCompletedCount());
    markStreakOncePerDay();
  }, []);

  const scenarios = [
    {
      id: "gender-bias",
      title: "Gender Bias",
      brief: "Practice 5 situations: credit stealing, being talked over, expertise dismissed, exclusion from networking, and more.",
      goal: "Back them up without escalating the room.",
    },
    {
      id: "racial-microaggressions",
      title: "Racial Microaggressions",
      brief: "Practice 5 situations: ethnic jokes, 'where are you from' questions, hair touching, stereotyping, and more.",
      goal: "Address it professionally, keep dignity centered.",
    },
    {
      id: "misgendering",
      title: "Misgendering",
      brief: "Practice 4 situations: wrong pronouns, dismissing corrections, pronoun jokes, deadnaming, and more.",
      goal: "Correct politely and support the impacted person.",
    },
  ] as const;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <header className="flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight">AllyCo</div>
          <nav className="flex items-center gap-6 text-sm text-slate-300">
            <StreakButton />
            <a className="hover:text-white" href="#how">
              How it works
            </a>
            <span className="text-slate-700">|</span>
            <a className="hover:text-white" href="#scenarios">
              Scenarios
            </a>
            <span className="text-slate-700">|</span>
            <a className="hover:text-white flex items-center gap-2" href="/badges">
              <span>🏆</span>
              <span>Badges ({badgeCount}/3)</span>
            </a>
          </nav>
        </header>

        <section className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              For when you wanted to say something but couldn't.
            </h1>
            <p className="mt-5 text-lg text-slate-300">
              Practice speaking up before the moment happens. Voice-first roleplay training to help you stand up for someone you care about, so next time, you'll be ready.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#scenarios"
                className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
              >
                Pick a scenario
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs text-slate-400">
              <span className="rounded-full border border-slate-800 px-3 py-1">
                Gemini
              </span>
              <span className="rounded-full border border-slate-800 px-3 py-1">
                ElevenLabs
              </span>
              <span className="rounded-full border border-slate-800 px-3 py-1">
                Next.js
              </span>
              <span className="rounded-full border border-slate-800 px-3 py-1">
                Real-time feedback
              </span>
            </div>
          </div>

          <a href="/open-chat" className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm hover:border-slate-600 cursor-pointer block">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-100">
                Open Voice Chat
              </div>
              <div className="text-xs text-slate-400">Talk about your experience</div>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <div className="relative">
                <div className="h-40 w-40 animate-pulse rounded-full bg-indigo-500/25 blur-xl" />
                <div className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-indigo-500/40" />
                <div className="absolute inset-0 m-auto h-10 w-10 rounded-full bg-indigo-300/70" />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
              <span>Elevate</span>
              <span>•</span>
              <span>Ensemble</span>
              <span>•</span>
              <span>Empower</span>
            </div>

            <div className="mt-6 text-xs text-slate-400">
              Share your real experience and get personalized guidance.
            </div>
          </a>
        </section>

        <section id="scenarios" className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Pick a scenario</h2>
          <p className="mt-2 text-slate-300">
            Each mission gives you a goal, a realistic roleplay, and coaching.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((s) => (
              <ScenarioCard key={s.id} scenario={s} />
            ))}
          </div>
        </section>

        <section id="how" className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/30 p-8">
          <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div>
              <div className="text-sm font-semibold">1) Choose a challenge</div>
              <div className="mt-2 text-sm text-slate-300">
                Pick a scenario you want to practice.
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold">2) Talk it out</div>
              <div className="mt-2 text-sm text-slate-300">
                Voice roleplay with a realistic character.
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold">3) Get coached</div>
              <div className="mt-2 text-sm text-slate-300">
                Feedback focused on Elevate, Ensemble, and Empower.
              </div>
            </div>
          </div>

          <div className="mt-8">
            <a
              href="#scenarios"
              className="inline-flex rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              Go to scenarios
            </a>
          </div>
        </section>

        <footer className="mt-14 text-xs text-slate-500">
          Don't let the right words escape you. This app helps you prepare, speak up, and support those who need it.
        </footer>
      </div>
    </main>
  );
}
