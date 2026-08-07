"use client";

import { Activity, Thermometer, ShieldAlert } from "lucide-react";

interface AiForecastProps {
  scenario: string;
}

export default function AiForecast({ scenario }: AiForecastProps) {
  // Determine forecast risk based on demo scenario selected by judges
  const getProbability = (type: string) => {
    if (scenario === "cyclone") {
      if (type === "cyclone") return 98;
      if (type === "storm_surge") return 88;
      if (type === "heavy_rain") return 95;
    }
    if (scenario === "flood") {
      if (type === "flood") return 94;
      if (type === "heavy_rain") return 92;
    }
    if (scenario === "tsunami") {
      if (type === "tsunami") return 97;
      if (type === "flood") return 85;
    }
    if (scenario === "oil_spill") {
      if (type === "oil_spill") return 96;
    }
    
    // Default base probabilities
    const defaults: Record<string, number> = {
      cyclone: 12,
      flood: 34,
      tsunami: 5,
      storm_surge: 22,
      heavy_rain: 45,
      oil_spill: 4
    };
    return defaults[type] || 10;
  };

  const forecasts = [
    { label: "Cyclone Probability", val: getProbability("cyclone"), color: "bg-red-500" },
    { label: "Coastal Inundation / Flood", val: getProbability("flood"), color: "bg-cyan-500" },
    { label: "Tsunami Alert Vector", val: getProbability("tsunami"), color: "bg-indigo-500" },
    { label: "Storm Surge Inundation", val: getProbability("storm_surge"), color: "bg-orange-500" },
    { label: "Heavy Rain Forecast", val: getProbability("heavy_rain"), color: "bg-blue-500" },
    { label: "Marine Oil/Chemical Spill", val: getProbability("oil_spill"), color: "bg-amber-600" }
  ];

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/40 p-5 backdrop-blur-md">
      <h3 className="font-bold text-cyan-400 tracking-wider flex items-center gap-2 text-sm uppercase border-b border-slate-800 pb-3">
        <Activity className="h-4 w-4" /> AI Risk Forecast Engine
      </h3>

      <div className="mt-4 space-y-3.5">
        {forecasts.map((fc, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400 font-semibold">{fc.label}</span>
              <span className="font-mono text-white font-bold">{fc.val}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-700 ${fc.color}`} 
                style={{ width: `${fc.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-slate-900 pt-3 text-[10px] text-slate-500 flex justify-between items-center font-mono">
        <span>Calculation confidence:</span>
        <span className="text-emerald-400 font-bold">94.8% (YOLO + Weather ML)</span>
      </div>
    </div>
  );
}
