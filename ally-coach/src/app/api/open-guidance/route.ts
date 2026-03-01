import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userExperience } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || !userExperience) {
      throw new Error("Missing required fields");
    }

    const prompt = `You are an empathetic allyship guide. A user is sharing their real experience with bias or discrimination.

User shared: "${userExperience}"

Respond with:
1. Acknowledge what they did and how they felt (1-2 sentences)
2. Validate their actions or feelings (1 sentence)
3. Offer specific guidance on what they could do differently or continue doing (2-3 sentences)

Keep it warm, supportive, and actionable. Focus on their experience and provide personalized guidance.`;

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
    
    const guidance = data.candidates?.[0]?.content?.parts?.[0]?.text || "Thank you for sharing. That takes courage.";

    return NextResponse.json({ guidance });
  } catch (error: any) {
    console.error("Guidance error:", error.message);
    return NextResponse.json(
      { guidance: "Thank you for sharing your experience." },
      { status: 500 }
    );
  }
}
