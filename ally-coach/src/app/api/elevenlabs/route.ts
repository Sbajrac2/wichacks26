import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.ELEVENLABS_API_KEY;

    console.log("ElevenLabs API key:", apiKey ? "Found" : "Missing");

    if (!apiKey || !text) {
      throw new Error("Missing required fields");
    }

    const voiceId = "21m00Tcm4TlvDq8ikWAM";

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => null);
      console.error("ElevenLabs API response:", response.status, errorText);
      return NextResponse.json(
        { error: "ElevenLabs API error", details: errorText },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg"
      }
    });
  } catch (error: any) {
    console.error("ElevenLabs error:", error?.message ?? error);
    return NextResponse.json(
      { error: error?.message ?? "Speech generation failed" },
      { status: 500 }
    );
  }
}
