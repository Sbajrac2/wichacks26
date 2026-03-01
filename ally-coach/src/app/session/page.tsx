"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { markSituationComplete, getNextSituationIndex, getScenarioProgress } from "../lib/progress";

function SessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scenario = searchParams.get("scenario") || "gender-bias";
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [typedInput, setTypedInput] = useState("");
  const [conversation, setConversation] = useState<{ role: string; text: string }[]>([]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [situationIndex, setSituationIndex] = useState(0);
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const finalTranscriptRef = useRef("");

  // Define all scenario prompts
  const scenarioPrompts: Record<string, string[]> = {
    "gender-bias": [
      "You're in a team meeting. A female colleague just shared an idea, but a male coworker interrupts and takes credit for it. What do you say?",
      "A female student was overlooked for a scholarship in favor of a male student with similar achievements. How do you respond?",
      "During a presentation, a male colleague repeatedly talks over a female colleague. How do you address it?",
      "You notice female teammates being left out of important emails and meetings. What action do you take?",
      "A manager praises a male colleague for work your female colleague did. How do you respond?"
    ],
    "racial-microaggressions": [
      "During lunch, a coworker makes a 'joke' about someone's ethnicity. Everyone laughs uncomfortably. How do you respond?",
      "A teammate keeps using stereotypes to describe colleagues of a certain race. What do you do?",
      "Someone on your team mispronounces a colleague's ethnic name repeatedly. How do you react?",
      "During a meeting, a person assumes a colleague of color is an intern. How do you address it?",
      "A coworker comments that a certain ethnic group 'naturally' has certain skills. What do you say?"
    ],
    "misgendering": [
      "In a meeting, someone repeatedly uses the wrong pronouns for your colleague. What do you do?",
      "A new coworker insists on using an outdated name for someone who recently transitioned. How do you respond?",
      "Someone makes a joke about someone's gender identity. How do you address it?",
      "During an introduction, a colleague is misgendered publicly. How do you handle it?",
      "Your manager consistently misgenders a team member in emails. What action do you take?"
    ]
  };

  // Start session
  async function startSession() {
    const idx = getNextSituationIndex(scenario); // get correct initial index
    setSituationIndex(idx);
    setSessionStarted(true);

    const prompt = scenarioPrompts[scenario][idx];
    const initialConversation = [{ role: "ai", text: prompt }];
    setConversation(initialConversation);

    await speakText(prompt);
  }

  // Function to speak text using ElevenLabs API
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
      audioRef.current = audio;

      audio.onended = () => {
        setIsAISpeaking(false);
        audioRef.current = null;
      };

      try {
        await audio.play();
      } catch (err) {
        console.warn("Autoplay prevented:", err);
        setIsAISpeaking(false);
      }
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

  function restartRecording() {
    setTranscript("");
    finalTranscriptRef.current = "";
  }

  // Start voice recording
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
        if (event.error === 'not-allowed') alert("Microphone permission denied.");
        else if (event.error === 'audio-capture') alert("No microphone found.");
        setIsRecording(false);
      };

      recognition.onend = () => { /* do nothing */ };
      recognition.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
      alert("Could not start recording.");
    }
  }

  // Stop recording and send input to AI
  function stopRecording() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsRecording(false);

      if (transcript && transcript.trim()) {
        const newConversation = [...conversation, { role: "user", text: transcript }];
        setConversation(newConversation);
        getAIFeedback(transcript, newConversation);
        setTranscript("");
        finalTranscriptRef.current = "";
      } else {
        alert("No speech detected. Please try again and speak clearly.");
      }
    }
  }

  // Handle typed input
  function submitTypedInput() {
    if (typedInput.trim()) {
      const newConversation = [...conversation, { role: "user", text: typedInput }];
      setConversation(newConversation);
      getAIFeedback(typedInput, newConversation);
      setTypedInput("");
    }
  }

  // Fetch AI feedback
  async function getAIFeedback(userResponse: string, conversationHistory: any) {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          scenario, 
          userResponse,
          conversationHistory,
          situationIndex
        })
      });

      const data = await res.json();
      const feedback = data.feedback;

      const updatedConversation = [...conversationHistory, { role: "ai", text: feedback }];
      setConversation(updatedConversation);
      await speakText(feedback);

      if (data.situationComplete) {
        markSituationComplete(scenario);
        setTimeout(() => router.push('/badges'), 2000);
      }
    } catch (error) {
      console.error("Feedback error:", error);
    }
  }

  // End scene and move to next situation
  async function endScene() {
    try {
      markSituationComplete(scenario);

      const nextIdx = situationIndex + 1;

      if (nextIdx < scenarioPrompts[scenario].length) {
        setSituationIndex(nextIdx);
        const nextPrompt = scenarioPrompts[scenario][nextIdx];
        const aiText = `Next situation ${nextIdx + 1}: ${nextPrompt}`;
        setConversation([{ role: "ai", text: aiText }]);
        await speakText(aiText);
      } else {
        // Completed all 5 scenes
        const prog = getScenarioProgress(scenario);
        if (prog && prog.completed) {
          setTimeout(() => router.push('/badges'), 1500);
        }
      }
    } catch (err) {
      console.error("End scene error:", err);
    }
  }

  // UI rendering
  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="text-sm text-slate-400 hover:text-slate-300">
            ← Back to home
          </a>
          <a href="/badges" className="text-sm text-indigo-400 hover:text-indigo-300">
            View badges
          </a>
        </div>

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
                  <div className={`inline-block rounded-lg p-4 max-w-2xl ${msg.role === "user" ? "bg-indigo-500/20" : "bg-slate-800"}`}>
                    <div className="text-xs text-slate-400 mb-1">
                      {msg.role === "user" ? "You" : "AI Coach"}
                    </div>
                    <div>{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="w-full max-w-2xl flex justify-end">
                <button
                  onClick={endScene}
                  className="text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-2 rounded-lg"
                >
                  End Scene →
                </button>
              </div>

              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setInputMode("voice")}
                  className={`px-4 py-2 rounded-lg text-sm ${inputMode === "voice" ? "bg-indigo-500" : "bg-slate-800"}`}
                >
                   Voice
                </button>
                <button
                  onClick={() => setInputMode("text")}
                  className={`px-4 py-2 rounded-lg text-sm ${inputMode === "text" ? "bg-indigo-500" : "bg-slate-800"}`}
                >
                   Type
                </button>
              </div>

              {isAISpeaking && (
                <button
                  onClick={skipSpeech}
                  className="text-xs text-slate-400 hover:text-slate-300"
                >
                  Skip →
                </button>
              )}

              {inputMode === "voice" ? (
                <>
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
                       Start Speaking
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="rounded-full bg-green-500 p-8 hover:bg-green-400 animate-pulse"
                    >
                       Done Speaking
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full max-w-2xl flex gap-2">
                  <input
                    type="text"
                    value={typedInput}
                    onChange={(e) => setTypedInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && submitTypedInput()}
                    placeholder="Type your response..."
                    className="flex-1 bg-slate-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isAISpeaking}
                  />
                  <button
                    onClick={submitTypedInput}
                    disabled={isAISpeaking || !typedInput.trim()}
                    className="bg-indigo-500 px-6 py-3 rounded-lg hover:bg-indigo-400 disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
      <SessionContent />
    </Suspense>
  );
}
