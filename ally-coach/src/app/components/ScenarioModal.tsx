"use client";

interface Props {
  scenario: string;
  onClose: () => void;
}

export default function ScenarioModal({ scenario, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="w-96 rounded-2xl bg-slate-900 p-6 border border-slate-800" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold">Choose Mode</h3>
        <p className="mt-2 text-sm text-slate-400">How would you like to practice?</p>

        <div className="mt-6 flex flex-col gap-4">
          <a
            href={`/lesson/${scenario}`}
            className="rounded-xl bg-indigo-500 px-4 py-3 text-center font-semibold hover:bg-indigo-400"
          >
            📚 Take Lesson
          </a>

          <a
            href={`/session?scenario=${scenario}`}
            className="rounded-xl border border-slate-700 px-4 py-3 text-center hover:border-slate-500"
          >
            🎤 Live Roleplay
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full text-sm text-slate-400 hover:text-slate-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
