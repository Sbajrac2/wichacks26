import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const key = process.env.GEMINI_API_KEY;
    console.log("GEMINI KEY prefix:", key?.slice(0, 6), "len:", key?.length);
    if (!key) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as {
      scenario: string;
      lessonTitle: string;
      lessonSummary: string;
      message: string;
    };

    const system = `
You are a helpful coaching assistant for workplace communication.
You teach respectful, professional ways to respond to bias and mistakes.
You do not produce slurs or hateful content.
You keep answers practical, short, and usable.
`;

    const prompt = `
Lesson title: ${body.lessonTitle}
Scenario: ${body.scenario}

Lesson notes:
${body.lessonSummary}

User question:
${body.message}

Respond with:
1) A short explanation (2-4 sentences)
2) 2-3 ready-to-say response options
3) One tip to keep it calm and professional
`;

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(
        key
      )}`;

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: system + "\n" + prompt }] }],
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json(
        { error: `Gemini error: ${errText}` },
        { status: 500 }
      );
    }

    const data = await geminiRes.json();

    const reply: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No reply returned.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "Server error calling Gemini." },
      { status: 500 }
    );
  }
}