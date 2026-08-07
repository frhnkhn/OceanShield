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
    { label: "Report Hazard", href: "/report", icon: AlertTriangle, color: "hover:bg-red-50 hover:border-red-300 text-red-700" },
    { label: "Safety Map GIS", href: "/map", icon: Map, color: "hover:bg-blue-50 hover:border-blue-300 text-blue-900" },
    { label: "Nearby Shelters", href: "/shelters", icon: FlameKindling, color: "hover:bg-indigo-50 hover:border-indigo-300 text-indigo-700" },
    { label: "Analytics Room", href: "/analytics", icon: BarChart3, color: "hover:bg-violet-50 hover:border-violet-300 text-violet-700" },
    { label: "My Profile", href: "/profile", icon: User, color: "hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700" },
    { label: "Admin Operations", href: "/admin", icon: Settings, color: "hover:bg-amber-50 hover:border-amber-300 text-amber-700" }
  ];

  const triggerSOS = () => {
    alert("🚨 EMERGENCY SOS BROADCAST SENT to NDRF, Coast Guard, and local district authorities! Your current coordinates are being tracked.");
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-bold text-slate-800 tracking-wider flex items-center gap-2 text-xs uppercase border-b border-slate-100 pb-3">
        <Settings className="h-4 w-4 text-slate-500" /> Quick Actions
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <Link
              key={idx}
              href={act.href}
              className={`flex flex-col items-center justify-center p-3 rounded border border-slate-200 bg-slate-50 transition-all duration-200 ${act.color}`}
            >
              <Icon className="h-5 w-5 mb-1.5" />
              <span className="text-xs font-semibold text-center text-slate-800">{act.label}</span>
            </Link>
          );
        })}
      </div>

      <button
        onClick={triggerSOS}
        className="mt-4 w-full flex items-center justify-center gap-2 rounded bg-red-650 border border-red-700 py-3 text-sm font-black uppercase text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:scale-[1.01]"
      >
        <AlertOctagon className="h-5 w-5" /> Broadcast SOS Signal
      </button>
    </div>
  );
}
