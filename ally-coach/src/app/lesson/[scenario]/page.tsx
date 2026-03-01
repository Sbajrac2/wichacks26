import LessonChatbot from "@/app/components/LessonChatbot";

const lessonContent: Record<string, { title: string; points: string[]; tips: string[] }> = {
  "gender-bias": {
    title: "Gender Bias",
    points: [
      "Why this matters: Subtle undermining erodes confidence and career growth",
      "Common mistakes: Staying silent, over-explaining, or being confrontational",
      "Strong ally responses: Redirect credit, amplify their voice, follow up privately",
      "Psychological safety: Create space for them to lead the conversation"
    ],
    tips: [
      "Use 'I noticed...' statements to avoid accusatory tone",
      "Redirect attention back to the person who was interrupted",
      "Follow up with the impacted person after the meeting"
    ]
  },
  "racial-microaggressions": {
    title: "Racial Microaggressions",
    points: [
      "Why this matters: 'Jokes' normalize harm and create hostile environments",
      "Common mistakes: Laughing along, ignoring it, or making it about yourself",
      "Strong ally responses: Name it clearly, center dignity, don't debate",
      "Psychological safety: Make it clear this behavior isn't acceptable"
    ],
    tips: [
      "Say 'That's not okay' or 'We don't do that here' firmly",
      "Don't ask the impacted person to explain why it's harmful",
      "Check in privately with the person who was targeted"
    ]
  },
  "misgendering": {
    title: "Misgendering",
    points: [
      "Why this matters: Using wrong pronouns denies someone's identity",
      "Common mistakes: Ignoring it, making a big deal, or asking them to correct it",
      "Strong ally responses: Correct quickly, model correct usage, move on",
      "Psychological safety: Show that respect is the default, not optional"
    ],
    tips: [
      "Correct immediately: 'Actually, [name] uses they/them pronouns'",
      "Don't make the person correct their own pronouns",
      "Practice using correct pronouns in your own speech"
    ]
  }
};

export default function LessonPage({ params }: { params: { scenario: string } }) {
  const { scenario } = params;
  const content = lessonContent[scenario] || lessonContent["gender-bias"];

  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <a href="/" className="text-sm text-slate-400 hover:text-slate-300 mb-6 inline-block">
          ← Back to scenarios
        </a>

        <h1 className="text-3xl font-bold">{content.title} Lesson</h1>
        <p className="mt-2 text-slate-400">Learn the fundamentals before practicing live</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Lesson Content */}
          <div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <h2 className="text-xl font-semibold">What You'll Learn</h2>
              <ul className="mt-4 space-y-3 text-slate-300">
                {content.points.map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-indigo-400 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <h2 className="text-xl font-semibold">💡 Pro Tips</h2>
              <ul className="mt-4 space-y-3 text-slate-300">
                {content.tips.map((tip, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={`/session?scenario=${scenario}`}
              className="mt-6 inline-block rounded-xl bg-indigo-500 px-6 py-3 font-semibold hover:bg-indigo-400"
            >
              Ready? Try Live Practice →
            </a>
          </div>

          {/* Gemini Chatbot */}
          <LessonChatbot scenario={scenario} />
        </div>
      </div>
    </main>
  );
}
