"use client";

import { useEffect, useState } from "react";
import { getProgress, getCompletedCount } from "../lib/progress";

export default function BadgesPage() {
  const [completedCount, setCompletedCount] = useState(0);
  const [progress, setProgress] = useState<any[]>([]);

  useEffect(() => {
    setCompletedCount(getCompletedCount());
    setProgress(getProgress());
  }, []);

  const badges = [
    { id: "gender-bias", name: "Gender Bias Champion", emoji: "🛡️" },
    { id: "racial-microaggressions", name: "Dignity Defender", emoji: "✊" },
    { id: "misgendering", name: "Respect Advocate", emoji: "🏳️‍🌈" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-sm text-slate-400 hover:text-slate-300 mb-6 inline-block">
          ← Back to home
        </a>

        <h1 className="text-3xl font-bold">Your Badges</h1>
        <p className="mt-2 text-slate-400">
          {completedCount} of {badges.length} scenarios completed
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => {
            const scenarioProgress = progress.find(p => p.scenarioId === badge.id);
            const isEarned = scenarioProgress?.completed || false;

            return (
              <div
                key={badge.id}
                className={`rounded-xl border p-6 ${
                  isEarned
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-800 bg-slate-900/40 opacity-50"
                }`}
              >
                <div className="text-5xl mb-4">{badge.emoji}</div>
                <h3 className="text-lg font-semibold">{badge.name}</h3>
                {isEarned && scenarioProgress && (
                  <div className="mt-2 text-xs text-slate-400">
                    Completed {scenarioProgress.conversationCount} time(s)
                  </div>
                )}
                {!isEarned && (
                  <div className="mt-2 text-xs text-slate-500">
                    Complete this scenario to unlock
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
