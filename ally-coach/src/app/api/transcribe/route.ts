import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob;

    if (!audioFile) {
      throw new Error("No audio file");
    }

    // Use OpenAI Whisper or Google Speech-to-Text
    // For now, return mock transcription
    // You'll need to implement actual transcription service

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ text: "[Transcription placeholder - add OpenAI API key]" });
    }

    const whisperFormData = new FormData();
    whisperFormData.append("file", audioFile, "audio.webm");
    whisperFormData.append("model", "whisper-1");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      },
      body: whisperFormData
    });

    const data = await response.json();
    
    return NextResponse.json({ text: data.text || "" });
  } catch (error: any) {
    console.error("Transcription error:", error.message);
    return NextResponse.json(
      { text: "Transcription failed" },
      { status: 500 }
    );
  }
}
