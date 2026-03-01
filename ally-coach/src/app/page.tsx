import ScenarioCard from "./components/ScenarioCard";

export default function Home() {
  const scenarios = [
    {
      id: "gender-bias",
      title: "Gender Bias",
      brief: "A colleague gets subtly undermined in a meeting.",
      goal: "Back them up without escalating the room.",
      difficulty: "Medium",
    },
    {
      id: "racial-microaggressions",
      title: "Racial Microaggressions",
      brief: "A “joke” crosses a line in a group setting.",
      goal: "Address it professionally, keep dignity centered.",
      difficulty: "Hard",
    },
    {
      id: "misgendering",
      title: "Misgendering",
      brief: "Someone uses the wrong pronouns and moves on.",
      goal: "Correct politely and support the impacted person.",
      difficulty: "Easy",
    },
  ] as const;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <header className="flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight">Ally Coach</div>
          <nav className="text-sm text-slate-300">
            <a className="hover:text-white" href="#how">
              How it works
            </a>
            <span className="mx-3 text-slate-700">|</span>
            <a className="hover:text-white" href="#scenarios">
              Scenarios
            </a>
          </nav>
        </header>

        <section className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Practice hard conversations before they happen.
            </h1>
            <p className="mt-5 text-lg text-slate-300">
              Voice-first roleplay training for real workplace moments. Pick a
              scenario, respond out loud, and get coaching with a score for{" "}
              <span className="text-slate-100">Courage</span>,{" "}
              <span className="text-slate-100">Empathy</span>, and{" "}
              <span className="text-slate-100">Professionalism</span>.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/session?scenario=racial-microaggressions"
                className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
              >
                Start demo
              </a>
              <a
                href="#scenarios"
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 hover:border-slate-500"
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

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-100">
                Live session preview
              </div>
              <div className="text-xs text-slate-400">Voice visualization</div>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <div className="relative">
                <div className="h-40 w-40 animate-pulse rounded-full bg-indigo-500/25 blur-xl" />
                <div className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-indigo-500/40" />
                <div className="absolute inset-0 m-auto h-10 w-10 rounded-full bg-indigo-300/70" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="text-xs text-slate-400">Courage</div>
                <div className="mt-1 text-lg font-semibold">84</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="text-xs text-slate-400">Empathy</div>
                <div className="mt-1 text-lg font-semibold">92</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="text-xs text-slate-400">Professionalism</div>
                <div className="mt-1 text-lg font-semibold">88</div>
              </div>
            </div>

            <div className="mt-6 text-xs text-slate-400">
              End a session to get two wins and one “power move” for next time.
            </div>
          </div>
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
                Score + two wins + one power move to try next time.
              </div>
            </div>
          </div>

          <div className="mt-8">
            <a
              href="/session?scenario=racial-microaggressions"
              className="inline-flex rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              Start demo
            </a>
          </div>
        </section>

        <footer className="mt-14 text-xs text-slate-500">
          Built for hackathons and humans who want to respond better under pressure.
        </footer>
      </div>
    </main>
  );
}
