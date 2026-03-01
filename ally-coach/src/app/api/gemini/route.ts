import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { input, scenario } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || !input || !scenario) {
      throw new Error("Missing required fields");
    }

   const prompt = `You are an allyship coach who will answer in a way thay is empathetic towards the victim helping someone learn about ${scenario.replace(/-/g, " ")}.

    User question: "${input}"
    
    Respond in a short and precise way.
    
    Rules:
    - Use bullet points.
    - Each bullet must start on a new line.
    - Keep sentences concise.
    - No bold, italics, or special formatting.
    - No jargon.
    - No repetition.
    - No long paragraphs.
    - Only include important, actionable information.
    - Maximum 5 bullet points.
    `;
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
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble right now. Please try again.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Gemini API error:", error.message);
    return NextResponse.json(
      { reply: "I'm having trouble connecting right now. Please try again." },
      { status: 500 }
    );
  }
}
