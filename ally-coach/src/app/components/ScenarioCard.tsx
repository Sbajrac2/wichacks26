"use client";

import { useState } from "react";
import ScenarioModal from "./ScenarioModal";

interface Scenario {
  id: string;
  title: string;
  brief: string;
  goal: string;
}

export default function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="group rounded-2xl border border-slate-800 bg-slate-900/30 p-5 hover:border-slate-600 text-left w-full"
      >
        <div className="text-base font-semibold">{scenario.title}</div>
        <div className="mt-3 text-sm text-slate-300">{scenario.brief}</div>
        <div className="mt-4 rounded-xl bg-slate-950/50 p-3">
          <div className="text-xs text-slate-400">Mission goal</div>
          <div className="mt-1 text-sm text-slate-100">{scenario.goal}</div>
        </div>
        <div className="mt-4 text-sm font-semibold text-indigo-300 group-hover:text-indigo-200">
          Choose mode →
        </div>
      </button>

      {showModal && (
        <ScenarioModal scenario={scenario.id} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
