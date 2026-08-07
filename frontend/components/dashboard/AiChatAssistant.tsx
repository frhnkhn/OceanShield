"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Bot, User } from "lucide-react";

export default function AiChatAssistant() {
  const [messages, setMessages] = useState<Array<{ sender: "bot" | "user"; text: string }>>([
    { sender: "bot", text: "OceanShield Emergency Agent ready. Ask me about nearby shelters, storm status, or first aid advice." }
  ]);
  const [query, setQuery] = useState("");

  const handleQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query.toLowerCase();
    let reply = "I am processing that request. For live evacuation maps, please navigate to the GIS Map panel.";

    if (userText.includes("shelter")) {
      reply = "Nearest shelter detected: Marina Multi-Purpose Cyclone Shelter, kamarajar Salai (420 meters away, capacity: 1500, active).";
    } else if (userText.includes("first aid") || userText.includes("flood safety")) {
      reply = "Flood Safety Guide: 1. Keep power mains shut. 2. Boil drinking water. 3. Avoid walking/driving through standing waters. 4. Evacuate to higher levels.";
    } else if (userText.includes("phone") || userText.includes("contact") || userText.includes("number")) {
      reply = "Critical Numbers: NDMA Control Room: 1078, SDRF: 1070, Coastal Police: 1093, Coast Guard: 1554.";
    }

    setMessages(prev => [
      ...prev,
      { sender: "user", text: query },
      { sender: "bot", text: reply }
    ]);
    setQuery("");
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/40 p-5 backdrop-blur-md h-[340px] flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-2">
        <h3 className="font-bold text-cyan-400 tracking-wider flex items-center gap-2 text-sm uppercase">
          <Bot className="h-4 w-4" /> AI Emergency Assistant
        </h3>
        <span className="bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-bold text-cyan-400">
          ONLINE ASSIST
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[200px] mb-2 text-xs">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-2 items-start ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`h-6 w-6 rounded-full shrink-0 flex items-center justify-center font-bold text-[10px] ${
              msg.sender === "bot" ? "bg-cyan-950 text-cyan-400 border border-cyan-800" : "bg-slate-900 text-white border border-slate-700"
            }`}>
              {msg.sender === "bot" ? "AI" : "U"}
            </div>
            <div className={`p-2.5 rounded-lg leading-normal ${
              msg.sender === "bot" ? "bg-slate-900/60 text-slate-200" : "bg-cyan-600 text-white"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleQuery} className="flex gap-2">
        <input
          type="text"
          placeholder="Ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-cyan-600 border border-cyan-500 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-cyan-500"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
