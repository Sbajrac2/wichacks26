import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { input, scenario } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || !input || !scenario) {
      throw new Error("Missing required fields");
    }

    const prompt = `You are an allyship lesson coach helping someone learn about workplace scenarios.
The lesson topic is: ${scenario.replace(/-/g, " ")}.
Answer the user's question clearly, educationally, and concisely. Focus on practical advice.
Question: ${input}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Gemini API error:", error.message);
    return NextResponse.json(
      { reply: "I'm having trouble connecting right now. Please try again." },
      { status: 500 }
    );
  }
}
