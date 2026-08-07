"use client";

import { MOCK_ALERTS, Alert } from "@/constants/mockData";
import { 
  BellRing, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  ShieldAlert,
  Clock 
} from "lucide-react";

export default function AlertSidebar() {
  const getSeverityStyles = (sev: Alert["severity"]) => {
    switch (sev) {
      case "critical":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      case "high":
        return "bg-orange-500/10 border-orange-500/30 text-orange-400";
      case "moderate":
        return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      default:
        return "bg-cyan-500/10 border-cyan-500/30 text-cyan-400";
    }
  };

  const getIcon = (sev: Alert["severity"]) => {
    switch (sev) {
      case "critical":
        return AlertOctagon;
      case "high":
        return ShieldAlert;
      case "moderate":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/40 p-5 backdrop-blur-md h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <h3 className="font-bold text-cyan-400 tracking-wider flex items-center gap-2 text-sm uppercase">
          <BellRing className="h-4 w-4 animate-swing" /> Emergency Alert Center
        </h3>
        <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] text-cyan-400 font-mono">
          LIVE FEED
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[380px]">
        {MOCK_ALERTS.map((alert) => {
          const AlertIcon = getIcon(alert.severity);
          const style = getSeverityStyles(alert.severity);
          
          return (
            <div
              key={alert.id}
              className={`rounded-lg border p-3 transition-all duration-200 hover:bg-slate-900/40 ${style}`}
            >
              <div className="flex gap-2">
                <AlertIcon className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs leading-tight text-white mb-1">
                    {alert.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {alert.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-semibold text-cyan-400">{alert.sender}</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
