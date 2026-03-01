import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { scenario, userResponse, conversationHistory } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || !scenario || !userResponse) {
      throw new Error("Missing required fields");
    }

    const scenarioContext: Record<string, string> = {
      "gender-bias": "You're coaching someone on how to address gender bias in meetings where women's ideas are interrupted or taken credit for.",
      "racial-microaggressions": "You're coaching someone on how to address racial microaggressions and inappropriate jokes in the workplace.",
      "misgendering": "You're coaching someone on how to correct misgendering and support colleagues' pronouns."
    };

    const prompt = `You are an allyship coach providing real-time feedback during a roleplay scenario.

Scenario: ${scenarioContext[scenario]}

User's response: "${userResponse}"

Provide brief, actionable feedback (2-3 sentences):
1. What they did well
2. One specific improvement
3. Next step or follow-up question to continue the roleplay

Keep it conversational and encouraging.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => null);
      console.error("Gemini API response error:", response.status, errText);
      return NextResponse.json({ error: "Upstream Gemini error", details: errText }, { status: response.status });
    }

    const data = await response.json();

    if (data.error) {
      console.error("Gemini returned error object:", data.error);
      throw new Error(data.error.message || "Gemini error");
    }

    const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text || "Good effort! Keep practicing.";

    // For now, the route returns feedback and an explicit situationComplete flag (false by default).
    return NextResponse.json({ feedback, situationComplete: false });
  } catch (error: any) {
    console.error("Feedback error:", error.message);
    return NextResponse.json(
      { feedback: "I'm having trouble providing feedback right now." },
      { status: 500 }
    );
  }
}
