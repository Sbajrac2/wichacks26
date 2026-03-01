"use client";

import { useState, useEffect } from "react";

type StreakData = {
  streak: number;
  lastCompletedISO: string | null;
};

const KEY = "allyCoachStreak";

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dayDiff(aISO: string, bISO: string) {
  const [ay, am, ad] = aISO.split("-").map(Number);
  const [by, bm, bd] = bISO.split("-").map(Number);
  const a = new Date(ay, am - 1, ad);
  const b = new Date(by, bm - 1, bd);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

function load(): StreakData {
  if (typeof window === "undefined") return { streak: 0, lastCompletedISO: null };

  const raw = localStorage.getItem(KEY);
  if (!raw) return { streak: 0, lastCompletedISO: null };

  try {
    const parsed = JSON.parse(raw) as Partial<StreakData>;
    return {
      streak: typeof parsed.streak === "number" ? parsed.streak : 0,
      lastCompletedISO:
        typeof parsed.lastCompletedISO === "string" ? parsed.lastCompletedISO : null,
    };
  } catch {
    return { streak: 0, lastCompletedISO: null };
  }
}

function save(data: StreakData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function markStreakOncePerDay() {
  const today = toISODate(new Date());
  const data = load();

  if (data.lastCompletedISO === today) return data;

  let nextStreak = 1;

  if (data.lastCompletedISO) {
    const diff = dayDiff(data.lastCompletedISO, today);
    nextStreak = diff === 1 ? data.streak + 1 : 1;
  }

  const next: StreakData = { streak: nextStreak, lastCompletedISO: today };
  save(next);
  return next;
}

export default function StreakButton() {
  const [state, setState] = useState<StreakData>({ streak: 0, lastCompletedISO: null });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = load();

    if (data.lastCompletedISO) {
      const diff = dayDiff(data.lastCompletedISO, toISODate(new Date()));
      if (diff >= 2) {
        setState({ streak: 0, lastCompletedISO: data.lastCompletedISO });
        return;
      }
    }
    setState(data);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <div className="rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1 text-sm text-slate-100">
          🔥 <span className="font-semibold">0</span> day streak
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1 text-sm text-slate-100">
        🔥 <span className="font-semibold">{state.streak}</span> day streak
      </div>
    </div>
  );
}
