"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { getReports } from "@/services/mapService";
import { Report } from "@/types/report";
import { 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  UserCheck, 
  Send,
  Loader2
} from "lucide-react";

export default function AdminPanel() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [assignee, setAssignee] = useState("NDRF Team A");

  useEffect(() => {
    const fetchReports = async () => {
      const data = await getReports();
      setReports(data.length ? data : getFallbackMockReports());
      setIsLoading(false);
    };
    void fetchReports();
  }, []);

  const getFallbackMockReports = (): Report[] => [
    {
      id: 101,
      title: "Severe Coastal Flooding",
      description: "Water level rose 1.5m above normal. Roadways near beach are submerged.",
      hazard: "Coastal Flooding",
      severity: 4,
      latitude: 13.048,
      longitude: 80.282,
      status: "pending",
      created_at: new Date().toISOString(),
      ai_status: "not_requested",
      gemini_status: "not_configured"
    },
    {
      id: 102,
      title: "Beach Erosion",
      description: "Severe wind erosion causing concrete pathways to collapse into ocean.",
      hazard: "High Waves / Erosion",
      severity: 3,
      latitude: 13.114,
      longitude: 80.294,
      status: "verified",
      created_at: new Date(Date.now() - 3600000).toISOString(),
      ai_status: "not_requested",
      gemini_status: "not_configured"
    }
  ];

  // Actions
  const handleUpdateStatus = (id: number, newStatus: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedReport?.id === id) {
      setSelectedReport(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleUpdateSeverity = (id: number, newSev: number) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, severity: newSev } : r));
    if (selectedReport?.id === id) {
      setSelectedReport(prev => prev ? { ...prev, severity: newSev } : null);
    }
  };

  const handleDelete = (id: number) => {
    setReports(prev => prev.filter(r => r.id !== id));
    if (selectedReport?.id === id) setSelectedReport(null);
  };

  const handleAssignTeam = (id: number) => {
    alert(`🚒 Rescue Mission Dispatched: ${assignee} assigned to Incident ID: ${id}`);
    handleUpdateStatus(id, "assigned");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        
        {/* Title banner */}
        <div className="rounded-xl border border-cyan-500/20 bg-slate-950/40 p-6 backdrop-blur-md flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">
              <ShieldCheck className="h-4 w-4" /> Operations Management Room
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
              Admin Moderation & Dispatch Panel
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Verify citizen reports, assign local response teams, adjust severities, and coordinate rescue efforts.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-bold font-mono">
            SECURE: ROOT_ADMIN
          </span>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
            <p className="mt-3 text-slate-500 text-sm">Syncing with OceanShield Incident Ledger...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Reports list */}
            <div className="lg:col-span-2 rounded-xl border border-slate-900 bg-slate-950/40 p-5 backdrop-blur-md flex flex-col gap-4">
              <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400">Incoming Incidents</h3>
              
              <div className="space-y-3 overflow-y-auto max-h-[500px]">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer flex justify-between items-center ${
                      selectedReport?.id === report.id
                        ? "border-cyan-500 bg-slate-900/60"
                        : "border-slate-800 bg-slate-950 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono text-slate-500">ID: {report.id}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          report.status === "pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          report.status === "verified" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
                          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>
                          {report.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{report.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{report.description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`h-2.5 w-2.5 rounded-full ${
                        report.severity >= 4 ? "bg-red-500" :
                        report.severity === 3 ? "bg-orange-400" :
                        report.severity === 2 ? "bg-amber-400" :
                        "bg-emerald-400"
                      }`} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(report.id);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Moderation details */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {selectedReport ? (
                <div className="rounded-xl border border-cyan-500/20 bg-slate-950/40 p-5 backdrop-blur-md flex flex-col gap-4">
                  <h3 className="font-bold text-sm tracking-wider uppercase text-cyan-400">Moderation Control</h3>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Incident details</span>
                    <h4 className="font-bold text-base text-white mt-1 leading-snug">{selectedReport.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{selectedReport.description}</p>
                    <p className="text-[10px] font-mono text-slate-500 mt-2">Hazard Type: {selectedReport.hazard}</p>
                  </div>

                  {/* Status update */}
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Verification status</span>
                    <div className="grid grid-cols-3 gap-2 mt-1.5">
                      <button
                        onClick={() => handleUpdateStatus(selectedReport.id, "pending")}
                        className={`py-1.5 px-1 rounded border text-[10px] font-bold ${
                          selectedReport.status === "pending" ? "border-amber-500 text-amber-400 bg-amber-500/5" : "border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        PENDING
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedReport.id, "verified")}
                        className={`py-1.5 px-1 rounded border text-[10px] font-bold ${
                          selectedReport.status === "verified" ? "border-cyan-500 text-cyan-400 bg-cyan-500/5" : "border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        VERIFY
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedReport.id, "resolved")}
                        className={`py-1.5 px-1 rounded border text-[10px] font-bold ${
                          selectedReport.status === "resolved" ? "border-emerald-500 text-emerald-400 bg-emerald-500/5" : "border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        RESOLVE
                      </button>
                    </div>
                  </div>

                  {/* Severity adjustments */}
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Update Severity</span>
                    <div className="grid grid-cols-4 gap-2 mt-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <button
                          key={level}
                          onClick={() => handleUpdateSeverity(selectedReport.id, level)}
                          className={`py-1.5 px-1 rounded border text-[11px] font-bold ${
                            selectedReport.severity === level ? "border-red-500 text-red-400 bg-red-500/5" : "border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          Lvl {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Assign rescue teams */}
                  <div className="border-t border-slate-900 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <UserCheck className="h-3.5 w-3.5 text-cyan-400" /> Assign Dispatch Team
                    </span>
                    <div className="flex gap-2">
                      <select
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="NDRF Team Alpha">NDRF Team Alpha</option>
                        <option value="SDRF Coast Division">SDRF Coast Division</option>
                        <option value="Indian Coast Guard Sector 4">Indian Coast Guard Sector 4</option>
                        <option value="Chennai Police Patrol B">Chennai Police Patrol B</option>
                      </select>
                      <button
                        onClick={() => handleAssignTeam(selectedReport.id)}
                        className="rounded-lg bg-cyan-600 border border-cyan-500 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-cyan-500"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-md text-center text-slate-500 text-xs">
                  Select an incident report from the checklist list to view and moderate its parameters.
                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
