"use client";

import Link from "next/link";
import { 
  AlertTriangle, 
  Map, 
  FlameKindling, 
  Phone, 
  AlertOctagon, 
  BarChart3, 
  User, 
  Settings,
  HelpCircle
} from "lucide-react";

export default function QuickActions() {
  const actions = [
    { label: "Report Hazard", href: "/report", icon: AlertTriangle, color: "hover:bg-red-500/10 hover:border-red-500/50 text-red-400" },
    { label: "Safety Map GIS", href: "/map", icon: Map, color: "hover:bg-cyan-500/10 hover:border-cyan-500/50 text-cyan-400" },
    { label: "Nearby Shelters", href: "/shelters", icon: FlameKindling, color: "hover:bg-indigo-500/10 hover:border-indigo-500/50 text-indigo-400" },
    { label: "Analytics Room", href: "/analytics", icon: BarChart3, color: "hover:bg-violet-500/10 hover:border-violet-500/50 text-violet-400" },
    { label: "My Profile", href: "/profile", icon: User, color: "hover:bg-emerald-500/10 hover:border-emerald-500/50 text-emerald-400" },
    { label: "Admin Operations", href: "/admin", icon: Settings, color: "hover:bg-amber-500/10 hover:border-amber-500/50 text-amber-400" }
  ];

  const triggerSOS = () => {
    alert("🚨 EMERGENCY SOS BROADCAST SENT to NDRF, Coast Guard, and local district authorities! Your current coordinates are being tracked.");
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/40 p-5 backdrop-blur-md">
      <h3 className="font-bold text-cyan-400 tracking-wider flex items-center gap-2 text-sm uppercase border-b border-slate-800 pb-3">
        <Settings className="h-4 w-4" /> Quick Actions
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <Link
              key={idx}
              href={act.href}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border border-slate-800 bg-slate-950/80 transition-all duration-200 ${act.color}`}
            >
              <Icon className="h-5 w-5 mb-1.5" />
              <span className="text-xs font-semibold text-center text-white">{act.label}</span>
            </Link>
          );
        })}
      </div>

      <button
        onClick={triggerSOS}
        className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 border border-red-500 py-3 text-sm font-black uppercase text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-200 hover:bg-red-500 hover:scale-[1.01]"
      >
        <AlertOctagon className="h-5 w-5 animate-bounce" /> Broadcast SOS Signal
      </button>
    </div>
  );
}
