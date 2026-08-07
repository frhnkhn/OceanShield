"use client";

import { useEffect, useState } from "react";
import { Navigation, Camera, Battery, Plane } from "lucide-react";

export default function DroneDashboard() {
  const [battery, setBattery] = useState(88);
  const [alt, setAlt] = useState(120);

  useEffect(() => {
    const timer = setInterval(() => {
      setBattery(b => Math.max(15, b - 1));
      setAlt(a => Math.max(80, Math.min(180, a + (Math.random() > 0.5 ? 5 : -5))));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/40 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <h3 className="font-bold text-cyan-400 tracking-wider flex items-center gap-2 text-sm uppercase">
          <Plane className="h-4 w-4" /> Drone Aerial Surveillance
        </h3>
        <span className="bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400">
          UAV ACTIVE
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Mock Video Feed Placeholder */}
        <div className="col-span-2 md:col-span-1 rounded-lg border border-slate-800 bg-slate-900 h-28 relative overflow-hidden flex items-center justify-center">
          <div className="absolute top-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[8px] font-mono text-cyan-400">
            REC: CAM_1
          </div>
          
          <Camera className="h-8 w-8 text-slate-700 animate-pulse" />
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
          <div className="absolute bottom-2 left-2 text-[9px] text-slate-400 font-mono">
            Marina Sector 4
          </div>
        </div>

        {/* Flight Parameters */}
        <div className="col-span-2 md:col-span-1 flex flex-col justify-between text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">UAV Battery</span>
            <span className="font-bold font-mono text-emerald-400 flex items-center gap-1">
              <Battery className="h-3.5 w-3.5" /> {battery}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Altitude</span>
            <span className="font-bold font-mono text-white">{alt} m AGL</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Flight Mode</span>
            <span className="font-semibold text-cyan-400">Autonomous Grid</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Area Coverage</span>
            <span className="font-bold text-white font-mono">4.2 km²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
