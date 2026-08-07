"use client";

import { useEffect, useState, use } from "react";
import Navbar from "@/components/layout/Navbar";
import { getReport } from "@/services/reportService";
import { Report } from "@/types/report";
import { 
  Clock, 
  MapPin, 
  User, 
  MessageSquare, 
  Send,
  Loader2,
  Calendar,
  AlertTriangle,
  ChevronRight
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReportDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const reportId = parseInt(resolvedParams.id, 10);
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<Array<{ author: string; text: string; time: string }>>([
    { author: "HQ Dispatcher", text: "Report received. Verification team dispatched.", time: "10 mins ago" },
    { author: "Local Officer", text: "Confirmed flooding near sub-station. Traffic redirected.", time: "4 mins ago" }
  ]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await getReport(reportId);
        setReport(data);
      } catch (err) {
        // Fallback mock report for demo/testing
        setReport({
          id: reportId,
          title: "Severe Cyclone Wind Damage",
          description: "High velocity winds have damaged power poles and uprooted large trees on Marina Beach Road. Immediate assistance required.",
          hazard: "Cyclone / Wind Damage",
          severity: 3,
          latitude: 13.0480,
          longitude: 80.2820,
          status: "assigned",
          created_at: new Date().toISOString(),
          ai_status: "completed",
          gemini_status: "not_requested",
          image_url: null
        });
      } finally {
        setIsLoading(false);
      }
    };
    void loadReport();
  }, [reportId]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [
      ...prev,
      { author: "You (Command Agent)", text: newComment, time: "Just now" }
    ]);
    setNewComment("");
  };

  const getSeverityColor = (sev: number) => {
    if (sev >= 4) return "text-red-500 bg-red-500/10 border-red-500/30";
    if (sev === 3) return "text-orange-400 bg-orange-400/10 border-orange-400/30";
    if (sev === 2) return "text-amber-400 bg-amber-400/10 border-amber-400/30";
    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  };

  // Timeline helper
  const timelineSteps = [
    { key: "created", label: "Created", desc: "Report submitted by citizen" },
    { key: "verified", label: "Verified", desc: "Operations verification" },
    { key: "assigned", label: "Assigned", desc: "Rescue team dispatched" },
    { key: "started", label: "Rescue Started", desc: "On-site operations active" },
    { key: "resolved", label: "Resolved", desc: "Area declared safe" }
  ];

  // Helper to determine state index
  const getStatusIndex = (status: string) => {
    const s = status.toLowerCase();
    if (s === "resolved") return 4;
    if (s === "started" || s === "rescue started") return 3;
    if (s === "assigned") return 2;
    if (s === "verified") return 1;
    return 0; // Default created
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
          <p className="mt-3 text-slate-500 text-sm">Fetching Report Details...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-red-400 font-bold">Report not found.</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = getStatusIndex(report.status);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        
        {/* Banner navigation path */}
        <div className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
          <span>OceanShield AI</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Incident Index</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-cyan-400">Incident Details #{report.id}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Header detail block */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-md">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getSeverityColor(report.severity)}`}>
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Severity Level {report.severity}
                  </span>
                  <h1 className="mt-3 text-2xl font-black text-white leading-snug">{report.title}</h1>
                </div>
                <span className="shrink-0 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-mono font-bold uppercase">
                  {report.status}
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-300 leading-relaxed">{report.description}</p>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-900 pt-5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-cyan-500" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Reporter</p>
                    <p className="text-white mt-0.5 font-mono">Citizen #{report.id + 42}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-500" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Submitted</p>
                    <p className="text-white mt-0.5">{new Date(report.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                  <MapPin className="h-4 w-4 text-cyan-500" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Coordinates</p>
                    <p className="text-white mt-0.5 font-mono">{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-md">
              <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 mb-6">Operations Timeline</h3>
              
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* Horizontal line for desktop */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-800 hidden md:block z-[0]" />
                
                {timelineSteps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step.key} className="relative z-[1] flex md:flex-col items-center md:text-center gap-3 md:gap-0 flex-1 w-full">
                      <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold text-xs font-mono transition-all duration-300 ${
                        isCompleted 
                          ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]" 
                          : "bg-slate-900 border-slate-800 text-slate-500"
                      }`}>
                        {idx + 1}
                      </div>

                      <div className="md:mt-3 flex flex-col items-start md:items-center">
                        <span className={`text-xs font-extrabold tracking-wide ${isCurrent ? "text-cyan-400" : isCompleted ? "text-white" : "text-slate-500"}`}>
                          {step.label}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5 max-w-[130px] hidden md:block">
                          {step.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comments Room */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-md flex flex-col gap-4">
              <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" /> Discussion Feed
              </h3>

              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div key={index} className="rounded-lg bg-slate-900/60 border border-slate-800 p-3 flex gap-3 items-start">
                    <div className="h-7 w-7 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold text-xs flex items-center justify-center">
                      {comment.author[0]}
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-[10px] gap-4 mb-1">
                        <span className="font-bold text-slate-300">{comment.author}</span>
                        <span className="text-slate-500 font-mono flex items-center gap-1"><Clock className="h-3 w-3" /> {comment.time}</span>
                      </div>
                      <p className="text-xs text-white leading-normal">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Post operational update..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-600 border border-cyan-500 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-cyan-500"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

          </div>

          {/* Right Preview Columns */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Image evidence card */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-5 backdrop-blur-md">
              <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 mb-3">Camera Evidence</h3>
              {report.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={report.image_url} 
                  alt="Incident evidence" 
                  className="rounded-lg border border-slate-800 object-cover w-full h-48"
                />
              ) : (
                <div className="rounded-lg border border-dashed border-slate-850 bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
                  <span className="text-2xl mb-1.5">📷</span>
                  <p className="text-xs font-bold text-slate-400">No Image Uploaded</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Firebase storage offline</p>
                </div>
              )}
            </div>

            {/* Map Preview */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-5 backdrop-blur-md flex flex-col gap-3">
              <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400">Tactical Map Preview</h3>
              <div className="rounded-lg border border-slate-800 bg-slate-900 h-48 w-full relative overflow-hidden flex items-center justify-center">
                
                {/* Dynamic mini GIS preview indicator */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                
                <div className="z-10 text-center p-4">
                  <MapPin className="h-8 w-8 text-cyan-400 mx-auto animate-bounce" />
                  <p className="mt-2 text-xs font-bold text-white">GIS COORDINATE PIN</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{report.latitude.toFixed(4)}° N, {report.longitude.toFixed(4)}° E</p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
