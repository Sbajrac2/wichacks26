"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function SessionPage() {
  const searchParams = useSearchParams();
  const scenario = searchParams.get("scenario") || "gender-bias";
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [conversation, setConversation] = useState<{ role: string; text: string }[]>([]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  const scenarioPrompts: Record<string, string> = {
    "gender-bias": "You're in a team meeting. A female colleague just shared an idea, but a male coworker interrupts and takes credit for it. What do you say?",
    "racial-microaggressions": "During lunch, a coworker makes a 'joke' about someone's ethnicity. Everyone laughs uncomfortably. How do you respond?",
    "misgendering": "In a meeting, someone repeatedly uses the wrong pronouns for your colleague. What do you do?"
  };

  async function startSession() {
    setSessionStarted(true);
    const prompt = scenarioPrompts[scenario];
    setConversation([{ role: "ai", text: prompt }]);
    await speakText(prompt);
  }

  async function speakText(text: string) {
    setIsAISpeaking(true);
    try {
      const res = await fetch("/api/elevenlabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (!res.ok) throw new Error("Speech failed");

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => setIsAISpeaking(false);
      await audio.play();
    } catch (error) {
      console.error("Speech error:", error);
      setIsAISpeaking(false);
    }
  }

  async function startRecording() {
    console.log("🎤 Starting recording...");
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert("Speech recognition not supported. Use Chrome.");
        return;
      }
      
      console.log("✅ SpeechRecognition available");
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        console.log("🟢 Recognition started");
      };
      
      recognition.onresult = (event: any) => {
        console.log("📝 Got result:", event.results);
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        const text = finalTranscript || interimTranscript;
        console.log("💬 Transcript:", text);
        setTranscript(text);
      };
      
      recognition.onerror = (event: any) => {
        console.error("❌ Recognition error:", event.error);
        if (event.error === 'not-allowed') {
          alert("Microphone permission denied.");
        } else if (event.error === 'audio-capture') {
          alert("No microphone found. Please connect a microphone.");
        }
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        console.log("🔴 Recognition ended");
        if (isRecording) {
          setIsRecording(false);
        }
      };
      
      recognition.start();
      setIsRecording(true);
      console.log("🎙️ Recognition.start() called");
    } catch (error) {
      console.error("Recording error:", error);
      alert("Could not start recording.");
    }
  }

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      
      if (transcript) {
        setConversation(prev => [...prev, { role: "user", text: transcript }]);
        getAIFeedback(transcript);
        setTranscript("");
      }
    }
  }

  async function getAIFeedback(userResponse: string) {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          scenario, 
          userResponse,
          conversationHistory: conversation 
        })
      });

      const data = await res.json();
      const feedback = data.feedback;
      
      setConversation(prev => [...prev, { role: "ai", text: feedback }]);
      await speakText(feedback);
    } catch (error) {
      console.error("Feedback error:", error);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-sm text-slate-400 hover:text-slate-300 mb-6 inline-block">
          ← Back to home
        </a>

        <h1 className="text-3xl font-bold capitalize">{scenario.replace(/-/g, " ")} Practice</h1>
        <p className="mt-2 text-slate-400">Voice roleplay session</p>

        {!sessionStarted ? (
          <div className="mt-12 text-center">
            <button
              onClick={startSession}
              className="rounded-xl bg-indigo-500 px-8 py-4 text-lg font-semibold hover:bg-indigo-400"
            >
              Start Session
            </button>
          </div>
        ) : (
          <>
            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/40 p-6 h-96 overflow-y-auto">
              {conversation.map((msg, i) => (
                <div key={i} className={`mb-4 ${msg.role === "user" ? "text-right" : ""}`}>
                  <div className={`inline-block rounded-lg p-4 ${msg.role === "user" ? "bg-indigo-500/20" : "bg-slate-800"}`}>
                    <div className="text-xs text-slate-400 mb-1">
                      {msg.role === "user" ? "You" : "AI Coach"}
                    </div>
                    <div>{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col items-center gap-4">
              {transcript && (
                <div className="text-sm text-slate-300 bg-slate-800 px-4 py-2 rounded-lg">
                  {transcript}
                </div>
              )}
              
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={isAISpeaking}
                  className="rounded-full bg-red-500 p-8 hover:bg-red-400 disabled:opacity-50"
                >
                  🎤 Start Speaking
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="rounded-full bg-green-500 p-8 hover:bg-green-400 animate-pulse"
                >
                  ✓ Done Speaking
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
