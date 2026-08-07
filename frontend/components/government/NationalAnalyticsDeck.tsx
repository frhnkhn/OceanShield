"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, Globe } from "lucide-react";

export default function NationalAnalyticsDeck() {
  const data = [
    { state: "Tamil Nadu", reports: 280, resources: 85 },
    { state: "Andhra Pradesh", reports: 195, resources: 65 },
    { state: "Odisha", reports: 245, resources: 72 },
    { state: "West Bengal", reports: 180, resources: 50 },
    { state: "Kerala", reports: 120, resources: 40 },
    { state: "Gujarat", reports: 90, resources: 30 }
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
        <h3 className="font-bold text-slate-800 tracking-wider flex items-center gap-2 text-xs uppercase">
          <Globe className="h-4 w-4 text-slate-500" /> National Incident Ledger
        </h3>
        <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-slate-500">
          ALL INDIA
        </span>
      </div>

      <div className="h-56 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="state" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#1e293b" }} />
            <Bar dataKey="reports" fill="#2563eb" name="Incidents Logged" />
            <Bar dataKey="resources" fill="#6366f1" name="Resource Utilization %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Top Threat State</span>
          <p className="font-bold text-red-700 mt-0.5">Tamil Nadu</p>
        </div>
        <div className="p-2 rounded bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Avg Response Time</span>
          <p className="font-bold text-slate-900 mt-0.5 font-mono">18.5 mins</p>
        </div>
        <div className="p-2 rounded bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Common Hazard</span>
          <p className="font-bold text-blue-900 mt-0.5">Flooding</p>
        </div>
      </div>
    </div>
  );
}
