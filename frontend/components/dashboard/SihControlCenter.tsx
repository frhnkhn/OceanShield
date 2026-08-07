"use client";

import { useState, useEffect } from "react";
import { 
  Play, 
  ShieldAlert, 
  Battery, 
  WifiOff, 
  Compass, 
  AlertTriangle,
  Lightbulb,
  Sliders
} from "lucide-react";

interface SihControlCenterProps {
  onSimulateScenario: (scenario: string) => void;
  onToggleDisasterMode: (active: boolean) => void;
  onSetBatteryLevel: (level: number) => void;
}

export default function SihControlCenter({ 
  onSimulateScenario, 
  onToggleDisasterMode, 
  onSetBatteryLevel 
}: SihControlCenterProps) {
  const [activeScenario, setActiveScenario] = useState("None");
  const [offlineSim, setOfflineSim] = useState(false);
  const [simBattery, setSimBattery] = useState(100);
  const [flashlight, setFlashlight] = useState(false);

  const handleScenario = (name: string) => {
    setActiveScenario(name);
    onSimulateScenario(name);
  };

  const handleOfflineToggle = () => {
    const next = !offlineSim;
    setOfflineSim(next);
    onToggleDisasterMode(next);
  };

  const handleBatteryChange = (level: number) => {
    setSimBattery(level);
    onSetBatteryLevel(level);
    // Emit global event for components (like UploadBox camera restriction)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("sim_battery_change", { detail: level }));
    }
  };

  const [simTransmitMode, setSimTransmitMode] = useState<"standard" | "lora" | "satellite">("standard");

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-800 tracking-wider flex items-center gap-2 text-xs uppercase">
          <Sliders className="h-4 w-4 text-slate-500" /> SIH Demo Control Deck
        </h3>
        <span className="bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold text-red-700">
          JUDGE PANEL
        </span>
      </div>

      {/* 1. Live Scenario Injector */}
      <div>
        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Simulate Disaster Scenario</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => handleScenario("cyclone")}
            className={`py-2 px-1 rounded border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeScenario === "cyclone" ? "bg-red-600 border-red-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" /> Cyclone Cat-3
          </button>

          <button
            onClick={() => handleScenario("flood")}
            className={`py-2 px-1 rounded border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeScenario === "flood" ? "bg-blue-600 border-blue-500 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" /> Coast Flooding
          </button>

          <button
            onClick={() => handleScenario("tsunami")}
            className={`py-2 px-1 rounded border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeScenario === "tsunami" ? "bg-indigo-600 border-indigo-500 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <Play className="h-3.5 w-3.5" /> Tsunami Alert
          </button>

          <button
            onClick={() => handleScenario("oil_spill")}
            className={`py-2 px-1 rounded border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeScenario === "oil_spill" ? "bg-amber-600 border-amber-500 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" /> Oil Spill / Chem
          </button>
        </div>
      </div>

      {/* 2. Simulation triggers */}
      <div className="border-t border-slate-100 pt-3 flex flex-col gap-3">
        {/* Offline Toggle */}
        <div className="flex justify-between items-center text-xs">
          <div>
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <WifiOff className="h-4 w-4 text-amber-600" /> Simulate Disaster Mode
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Toggles emergency offline/mesh status.</p>
          </div>
          <button
            onClick={handleOfflineToggle}
            className={`py-1.5 px-3 rounded font-bold text-[10px] border transition-all ${
              offlineSim ? "bg-amber-50 border-amber-200 text-amber-700 font-extrabold" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {offlineSim ? "OFFLINE ACTIVE" : "GO OFFLINE"}
          </button>
        </div>

        {/* Battery Toggles */}
        <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2.5">
          <div>
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Battery className="h-4 w-4 text-emerald-600" /> Battery Optimization
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Simulate low-power EOC modes.</p>
          </div>
          
          <div className="flex gap-1.5">
            <button
              onClick={() => handleBatteryChange(100)}
              className={`px-2 py-1 rounded text-[9px] font-bold border ${simBattery === 100 ? "border-emerald-600 text-emerald-700 bg-emerald-50" : "border-slate-200 bg-white text-slate-500"}`}
            >
              100%
            </button>
            <button
              onClick={() => handleBatteryChange(18)}
              className={`px-2 py-1 rounded text-[9px] font-bold border ${simBattery === 18 ? "border-orange-600 text-orange-700 bg-orange-50" : "border-slate-200 bg-white text-slate-500"}`}
            >
              18%
            </button>
            <button
              onClick={() => handleBatteryChange(4)}
              className={`px-2 py-1 rounded text-[9px] font-bold border ${simBattery === 4 ? "border-red-600 text-red-700 bg-red-50" : "border-slate-200 bg-white text-slate-500"}`}
            >
              4%
            </button>
          </div>
        </div>
      </div>

      {/* 3. Simulated Disaster Tools (Visible if Offline/Disaster Mode Active) */}
      {offlineSim && (
        <div className="mt-2 border border-amber-250 bg-amber-50/50 rounded p-3 text-xs flex flex-col gap-2">
          <p className="font-bold text-amber-700 flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
            <Compass className="h-3.5 w-3.5" /> EOC Offline Mesh & Telemetry Toolkit
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-[10px] mb-1">
            <button
              onClick={() => setFlashlight(f => !f)}
              className={`py-1.5 rounded border text-[9px] font-bold flex items-center justify-center gap-1 ${
                flashlight ? "bg-yellow-100 border-yellow-300 text-yellow-800" : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              <Lightbulb className="h-3.5 w-3.5" /> {flashlight ? "FLASHLIGHT ON" : "FLASHLIGHT"}
            </button>
            <div className="border border-slate-200 bg-slate-50 rounded p-1.5 flex items-center justify-center font-mono font-bold text-slate-700 gap-1 text-[9px]">
              mesh: 11 nodes
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2 flex flex-col gap-1.5">
            <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Transmission Technology</label>
            <div className="grid grid-cols-3 gap-1 text-[9px] font-bold">
              <button
                onClick={() => setSimTransmitMode("standard")}
                className={`py-1 rounded border transition-all ${simTransmitMode === "standard" ? "border-blue-900 text-blue-900 bg-blue-50" : "border-slate-200 text-slate-550 bg-white"}`}
              >
                CELL/WI-FI
              </button>
              <button
                onClick={() => setSimTransmitMode("lora")}
                className={`py-1 rounded border transition-all ${simTransmitMode === "lora" ? "border-amber-600 text-amber-700 bg-amber-50" : "border-slate-200 text-slate-550 bg-white"}`}
              >
                LORA MESH
              </button>
              <button
                onClick={() => setSimTransmitMode("satellite")}
                className={`py-1 rounded border transition-all ${simTransmitMode === "satellite" ? "border-indigo-650 text-indigo-700 bg-indigo-50" : "border-slate-200 text-slate-550 bg-white"}`}
              >
                SATELLITE SOS
              </button>
            </div>
            <p className="text-[8px] text-slate-450 leading-normal">
              {simTransmitMode === "standard" && "Attempts direct HTTPS upload to central FastAPI OceanShield node."}
              {simTransmitMode === "lora" && "Transmits highly compressed data packages using low-power 868MHz packet radio hops."}
              {simTransmitMode === "satellite" && "Uplinks minimal telemetry packages directly to L-band satellite transponders."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
