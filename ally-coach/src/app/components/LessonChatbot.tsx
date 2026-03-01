"use client";

import { useState } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function LessonChatbot({ scenario }: { scenario: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi! I'm your lesson assistant. Ask me anything about this scenario." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: userMessage, scenario }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <h3 className="text-sm font-semibold mb-4">💬 Ask Questions</h3>
      
      <div className="h-64 overflow-y-auto space-y-3 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`text-sm p-3 rounded-lg ${m.role === "user" ? "bg-indigo-500/20 ml-8" : "bg-slate-800/50 mr-8"}`}>
            <span className="font-semibold text-xs text-slate-400 block mb-1">
              {m.role === "user" ? "You" : "AI Coach"}
            </span>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="text-sm p-3 rounded-lg bg-slate-800/50 mr-8">
            <span className="text-slate-400">Thinking...</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about this scenario..."
          className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
