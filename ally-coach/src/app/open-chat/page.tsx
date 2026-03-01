"use client";

import { useState, useRef } from "react";

export default function OpenChatPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [conversation, setConversation] = useState<{ role: string; text: string }[]>([]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const finalTranscriptRef = useRef("");

  async function startSession() {
    setSessionStarted(true);
    const greeting = "Hi! Tell me about a workplace situation you experienced or witnessed. Describe what happened, and I'll help you think through how you could respond.";
    setConversation([{ role: "ai", text: greeting }]);
    await speakText(greeting);
  }

  function restartRecording() {
    setTranscript("");
    finalTranscriptRef.current = "";
  }

  async function speakText(text: string) {
    setIsAISpeaking(true);
    try {
      const res = await fetch("/api/elevenlabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => null);
        console.error("TTS endpoint returned non-OK:", res.status, errText);
        throw new Error(`Speech failed: ${res.status} ${errText ?? ""}`);
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsAISpeaking(false);
        audioRef.current = null;
      };
      await audio.play();
    } catch (error) {
      console.error("Speech error:", error);
      setIsAISpeaking(false);
    }
  }

  function skipSpeech() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsAISpeaking(false);
    }
  }

  async function startRecording() {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert("Speech recognition not supported. Use Chrome.");
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      finalTranscriptRef.current = "";
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }
        
        setTranscript(finalTranscriptRef.current + interimTranscript);
      };
      
      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          alert("Microphone permission denied.");
        } else if (event.error === 'audio-capture') {
          alert("No microphone found.");
        }
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        // Don't auto-restart
      };
      
      recognition.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
      alert("Could not start recording.");
    }
  }

  function stopRecording() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log("Recognition already stopped");
      }
      setIsRecording(false);
      
      if (transcript && transcript.trim()) {
        setConversation(prev => [...prev, { role: "user", text: transcript }]);
        getAIGuidance(transcript);
        setTranscript("");
        finalTranscriptRef.current = "";
      } else {
        alert("No speech detected. Please try again and speak clearly.");
      }
    }
  }

  async function getAIGuidance(userResponse: string) {
    try {
      const res = await fetch("/api/open-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userExperience: userResponse,
          conversationHistory: conversation 
        })
      });

      const data = await res.json();
      const guidance = data.guidance;
      
      setConversation(prev => [...prev, { role: "ai", text: guidance }]);
      await speakText(guidance);
    } catch (error) {
      console.error("Guidance error:", error);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-sm text-slate-400 hover:text-slate-300 mb-6 inline-block">
          ← Back to home
        </a>

        <h1 className="text-3xl font-bold">Open Voice Chat</h1>
        <p className="mt-2 text-slate-400">Share your experience and get personalized guidance</p>

        {!sessionStarted ? (
          <div className="mt-12 text-center">
            <button
              onClick={startSession}
              className="rounded-xl bg-indigo-500 px-8 py-4 text-lg font-semibold hover:bg-indigo-400"
            >
              Start Conversation
            </button>
          </div>
        ) : (
          <>
            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/40 p-6 h-96 overflow-y-auto">
              {conversation.map((msg, i) => (
                <div key={i} className={`mb-4 ${msg.role === "user" ? "text-right" : ""}`}>
                  <div className={`inline-block rounded-lg p-4 max-w-2xl ${msg.role === "user" ? "bg-indigo-500/20" : "bg-slate-800"}`}>
                    <div className="text-xs text-slate-400 mb-1">
                      {msg.role === "user" ? "You" : "AI Coach"}
                    </div>
                    <div 
                      className="prose prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: msg.text
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br/>')
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col items-center gap-4">
              {isAISpeaking && (
                <button
                  onClick={skipSpeech}
                  className="text-xs text-slate-400 hover:text-slate-300"
                >
                  Skip →
                </button>
              )}
              
              {transcript && (
                <div className="flex items-center gap-2">
                  <div className="text-sm text-slate-300 bg-slate-800 px-4 py-2 rounded-lg max-w-2xl">
                    {transcript}
                  </div>
                  <button
                    onClick={restartRecording}
                    className="text-xs text-slate-400 hover:text-slate-300"
                  >
                    ↻ Restart
                  </button>
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
