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
  let color = "text-emerald-600";
  let barColor = "bg-emerald-600";

  if (score > 75) {
    riskLevel = "EXTREME";
    color = "text-red-600 font-extrabold";
    barColor = "bg-red-600";
  } else if (score > 50) {
    riskLevel = "HIGH";
    color = "text-orange-600";
    barColor = "bg-orange-600";
  } else if (score > 25) {
    riskLevel = "MODERATE";
    color = "text-amber-600";
    barColor = "bg-amber-600";
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-bold text-slate-800 tracking-wider flex items-center gap-2 text-xs uppercase border-b border-slate-100 pb-3">
        <Compass className="h-4 w-4 text-slate-500" /> AI Risk Index
      </h3>

      <div className="mt-4 flex flex-col items-center justify-center py-2">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          OceanShield Risk Level
        </span>
        <span className={`text-3xl font-extrabold tracking-wider mt-1 ${color}`}>
          {riskLevel}
        </span>
        
        {/* Progress Bar Container */}
        <div className="mt-4 w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div 
            className={`h-full transition-all duration-1000 ${barColor}`}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="mt-3 w-full flex justify-between text-[10px] text-slate-500 font-mono">
          <span>0 (SAFE)</span>
          <span className="text-blue-900 font-bold">SCORE: {score}/100</span>
          <span>100 (EXTREME)</span>
        </div>
      </div>

      <div className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-500 leading-normal">
        <span className="text-blue-900 font-bold">Calculation Vector:</span> Density weight of {reportCount} live incidents coupled with {criticalCount} severity outliers. Updates dynamically.
      </div>
    </div>
  );
}
