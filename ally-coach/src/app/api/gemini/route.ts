import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("🔥 Gemini API hit at:", new Date().toISOString());
  try {
    const { input, scenario } = await req.json();
    console.log("📥 Request:", { input, scenario });
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || !input || !scenario) {
      throw new Error("Missing required fields");
    }

    const prompt = `You are an allyship lesson coach helping someone learn about workplace scenarios.
The lesson topic is: ${scenario.replace(/-/g, " ")}.
Answer the user's question clearly, educationally, and concisely. Focus on practical advice.
Question: ${input}`;

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

    const data = await response.json();
    console.log("📤 Gemini response:", JSON.stringify(data, null, 2));
    
    if (data.error) {
      console.error("Gemini API error:", data.error);
      return NextResponse.json(
        { reply: "API quota exceeded. Please try again later or use a different API key." },
        { status: 429 }
      );
    }
    
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
console.log("API KEY BEING USED:", process.env.GEMINI_API_KEY);