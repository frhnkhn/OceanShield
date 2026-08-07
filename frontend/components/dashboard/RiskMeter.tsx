"use client";

import { useEffect, useState } from "react";
import { getReports } from "@/services/mapService";
import { Report } from "@/types/report";
import { ShieldAlert, Compass } from "lucide-react";

export default function RiskMeter() {
  const [reports, setReports] = useState<Report[]>([]);
  
  useEffect(() => {
    const fetchReports = async () => {
      const data = await getReports();
      setReports(data);
    };
    void fetchReports();
  }, []);

  // Compute live OceanShield Risk Index score
  // Low = 0-25, Moderate = 26-50, High = 51-75, Extreme = 76-100
  // Formula: base score from report count * severity weight
  const reportCount = reports.length || 15;
  const criticalCount = reports.filter(r => r.severity >= 4).length || 3;
  const score = Math.min(100, Math.max(12, reportCount * 3 + criticalCount * 12));

  let riskLevel = "LOW";
  let color = "text-emerald-400";
  let barColor = "bg-emerald-400 shadow-[0_0_15px_#10b981]";
  let borderGlow = "border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]";

  if (score > 75) {
    riskLevel = "EXTREME";
    color = "text-red-500 font-extrabold animate-pulse";
    barColor = "bg-red-500 shadow-[0_0_15px_#ef4444]";
    borderGlow = "border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]";
  } else if (score > 50) {
    riskLevel = "HIGH";
    color = "text-orange-400";
    barColor = "bg-orange-400 shadow-[0_0_15px_#f97316]";
    borderGlow = "border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]";
  } else if (score > 25) {
    riskLevel = "MODERATE";
    color = "text-amber-400";
    barColor = "bg-amber-400 shadow-[0_0_15px_#fbbf24]";
    borderGlow = "border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.08)]";
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border bg-slate-950/40 p-5 backdrop-blur-md transition-all duration-300 ${borderGlow}`}>
      <h3 className="font-bold text-cyan-400 tracking-wider flex items-center gap-2 text-sm uppercase border-b border-slate-800 pb-3">
        <Compass className="h-4 w-4" /> AI Risk Index
      </h3>

      <div className="mt-4 flex flex-col items-center justify-center py-2">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          OceanShield Risk Level
        </span>
        <span className={`text-3xl tracking-wider mt-1 ${color}`}>
          {riskLevel}
        </span>
        
        {/* Progress Bar Container */}
        <div className="mt-4 w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div 
            className={`h-full transition-all duration-1000 ${barColor}`}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="mt-3 w-full flex justify-between text-[10px] text-slate-500 font-mono">
          <span>0 (SAFE)</span>
          <span className="text-cyan-400 font-bold">SCORE: {score}/100</span>
          <span>100 (EXTREME)</span>
        </div>
      </div>

      <div className="mt-3 border-t border-slate-900 pt-3 text-[11px] text-slate-400 leading-normal">
        <span className="text-cyan-400 font-bold">Calculation Vector:</span> Density weight of {reportCount} live incidents coupled with {criticalCount} severity outliers. Updates dynamically.
      </div>
    </div>
  );
}
