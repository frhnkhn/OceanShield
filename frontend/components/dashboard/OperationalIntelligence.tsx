"use client";

import { MessageCircle, FileText, Anchor, Users } from "lucide-react";

export default function OperationalIntelligence() {
  const feeds = [
    { source: "Twitter/X", post: "Bridge near Adyar under heavy inundation. Water rising fast. #ChennaiRain", score: "AI Confidence: 91% (Valid)" },
    { source: "Reddit", post: "Power outage in Sector 4 Mylapore. Trees block streets.", score: "AI Confidence: 84% (Relevant)" }
  ];

  const resources = [
    { item: "Inflatable Speedboats", qty: 14, status: "Deployed (8)" },
    { item: "Rescue Helicopters", qty: 3, status: "Airborne (1)" },
    { item: "SDRF Ambulances", qty: 24, status: "Active (19)" },
    { item: "Emergency Food Kits", qty: 4500, status: "Stored" }
  ];

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/40 p-5 backdrop-blur-md flex flex-col gap-4">
      
      {/* Social Media Scraper */}
      <div>
        <h4 className="font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-2">
          <MessageCircle className="h-4 w-4" /> Live Social Scraper
        </h4>
        <div className="space-y-2.5">
          {feeds.map((f, idx) => (
            <div key={idx} className="rounded bg-slate-900/60 p-2 border border-slate-800 text-[10px]">
              <div className="flex justify-between text-slate-500 font-bold mb-0.5">
                <span>{f.source}</span>
                <span className="text-cyan-400 font-mono">{f.score}</span>
              </div>
              <p className="text-white leading-normal">{f.post}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Allocation Tracker */}
      <div className="border-t border-slate-900 pt-3">
        <h4 className="font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-2">
          <Anchor className="h-4 w-4" /> Resource Fleet Allocation
        </h4>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          {resources.map((r, idx) => (
            <div key={idx} className="p-2 rounded bg-slate-900/40 border border-slate-900 flex justify-between items-center">
              <div>
                <p className="font-bold text-white leading-tight">{r.item}</p>
                <p className="text-slate-500 mt-0.5">{r.status}</p>
              </div>
              <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono font-bold px-2 py-0.5 rounded">
                x{r.qty}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Volunteer registries */}
      <div className="border-t border-slate-900 pt-3">
        <h4 className="font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-2">
          <Users className="h-4 w-4" /> Volunteer Roster
        </h4>
        <div className="flex justify-between items-center text-[10px] text-slate-400">
          <span>Active Volunteers Registered: <strong className="text-white font-mono">182 officers</strong></span>
          <span className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 font-bold uppercase tracking-wider text-[8px]">
            Certificates Ready
          </span>
        </div>
      </div>
    </div>
  );
}
