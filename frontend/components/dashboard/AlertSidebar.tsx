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
        return "bg-red-50 border-red-200 text-red-750";
      case "high":
        return "bg-orange-50 border-orange-200 text-orange-755";
      case "moderate":
        return "bg-amber-50 border-amber-200 text-amber-755";
      default:
        return "bg-blue-50 border-blue-200 text-blue-755";
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
    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <h3 className="font-bold text-slate-800 tracking-wider flex items-center gap-2 text-xs uppercase">
          <BellRing className="h-4 w-4 text-slate-500" /> Emergency Alert Center
        </h3>
        <span className="rounded bg-slate-50 border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500 font-mono">
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
              className={`rounded border p-3 transition-all duration-200 hover:bg-slate-50/30 ${style}`}
            >
              <div className="flex gap-2">
                <AlertIcon className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs leading-tight text-slate-900 mb-1">
                    {alert.title}
                  </h4>
                  <p className="text-[11px] text-slate-550 leading-normal">
                    {alert.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-blue-900">{alert.sender}</span>
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
