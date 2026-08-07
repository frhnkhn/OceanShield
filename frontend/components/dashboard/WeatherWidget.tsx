"use client";

import { MOCK_WEATHER } from "@/constants/mockData";
import { 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  Waves, 
  AlertTriangle 
} from "lucide-react";

export default function WeatherWidget() {
  const w = MOCK_WEATHER;

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/40 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-bold text-cyan-400 tracking-wider flex items-center gap-2 text-sm uppercase">
          <Waves className="h-4 w-4" /> Live Coastal Conditions
        </h3>
        {w.cycloneWarning && (
          <span className="flex items-center gap-1 rounded bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-xs font-semibold text-red-400 animate-pulse">
            <AlertTriangle className="h-3 w-3" /> CYCLONE ALERT
          </span>
        )}
      </div>

      {w.cycloneWarning && w.cycloneCategory && (
        <div className="mt-3 rounded-lg bg-red-500/5 border border-red-500/20 p-3 text-xs text-red-300">
          <p className="font-bold">Active System Alert:</p>
          <p className="mt-0.5">{w.cycloneCategory} active in South Bay of Bengal. Approaching at 12 knots.</p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded bg-slate-900/60 p-2 text-cyan-400">
            <Thermometer className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Temperature</p>
            <p className="text-base font-bold text-white">{w.temp}°C</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded bg-slate-900/60 p-2 text-cyan-400">
            <Wind className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Wind Speed</p>
            <p className="text-base font-bold text-white">{w.windSpeed} km/h ({w.windDir})</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded bg-slate-900/60 p-2 text-cyan-400">
            <Droplets className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Humidity</p>
            <p className="text-base font-bold text-white">{w.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded bg-slate-900/60 p-2 text-cyan-400">
            <CloudRain className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Precipitation</p>
            <p className="text-base font-bold text-white">{w.rainfall} mm</p>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-900 pt-3 flex justify-between items-center text-xs">
        <span className="text-slate-500">Astronomical Tide Level:</span>
        <span className="font-semibold text-emerald-400">{w.tideLevel}</span>
      </div>
    </div>
  );
}
