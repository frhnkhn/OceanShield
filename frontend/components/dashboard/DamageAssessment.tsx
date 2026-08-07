"use client";

import { Activity, ShieldAlert, Award, AlertOctagon } from "lucide-react";

interface DamageAssessmentProps {
  scenario: string;
}

export default function DamageAssessment({ scenario }: DamageAssessmentProps) {
  // Determine severity values based on simulation scenario selected
  const getMetrics = () => {
    if (scenario === "cyclone") {
      return { infra: "78% damaged", road: "Major closures", economic: "$12.4M est.", priority: 9.5, team: "NDRF + Coast Guard" };
    }
    if (scenario === "flood") {
      return { infra: "45% inundated", road: "Submerged connectors", economic: "$4.8M est.", priority: 8.8, team: "SDRF + Fire Services" };
    }
    if (scenario === "tsunami") {
      return { infra: "92% critical loss", road: "Complete blocks", economic: "$45.0M est.", priority: 9.9, team: "Full NDMA Deployment" };
    }
    if (scenario === "oil_spill") {
      return { infra: "Marine zone critical", road: "Clear roads", economic: "$8.5M est.", priority: 7.5, team: "Coast Guard Marine division" };
    }
    return { infra: "Minimal loss", road: "Clear", economic: "$0.1M est.", priority: 3.2, team: "Local Patrols" };
  };

  const m = getMetrics();

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/40 p-5 backdrop-blur-md">
      <h3 className="font-bold text-cyan-400 tracking-wider flex items-center gap-2 text-sm uppercase border-b border-slate-800 pb-3">
        <ShieldAlert className="h-4 w-4" /> AI Damage & Rescue Priority
      </h3>

      <div className="mt-4 space-y-3 text-xs">
        <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
          <span className="text-slate-500">Priority Score (1-10)</span>
          <span className="font-bold font-mono text-red-400">{m.priority} / 10</span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
          <span className="text-slate-500">Infrastructure Impact</span>
          <span className="font-semibold text-white">{m.infra}</span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
          <span className="text-slate-500">Roadway Status</span>
          <span className="font-semibold text-white">{m.road}</span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
          <span className="text-slate-500">Projected Losses</span>
          <span className="font-bold font-mono text-cyan-400">{m.economic}</span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
          <span className="text-slate-500">Recommended Allocation</span>
          <span className="font-semibold text-indigo-400">{m.team}</span>
        </div>
      </div>
    </div>
  );
}
