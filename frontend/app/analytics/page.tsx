"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import { 
  TOP_HAZARD_TYPES, 
  MONTHLY_REPORTS, 
  DISTRICT_COMPARISON, 
  SEVERITY_DISTRIBUTION, 
  STATUS_DISTRIBUTION, 
  RESPONSE_TIME_DATA 
} from "@/constants/mockData";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from "recharts";
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Activity, 
  ShieldAlert 
} from "lucide-react";

export default function AnalyticsPage() {
  const COLORS = ["#06b6d4", "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#f43f5e"];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        
        {/* Page title banner */}
        <div className="rounded-xl border border-cyan-500/20 bg-slate-950/40 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">
            <BarChart3 className="h-4 w-4" /> Incident Analytics Command Room
          </div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            Coastal Disaster Analytics
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Visual intelligence analysis of incoming reports, response times, and hazard vectors.
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. Monthly Report Trends (Area Chart) */}
          <div className="rounded-xl border border-cyan-500/10 bg-slate-950/40 p-5 backdrop-blur-md">
            <h3 className="font-bold text-cyan-400 tracking-wider flex items-center gap-2 text-sm uppercase mb-4">
              <TrendingUp className="h-4 w-4" /> Monthly Report Trends
            </h3>
            <div className="h-80 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_REPORTS}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#06b6d4" }} />
                  <Legend />
                  <Area type="monotone" dataKey="reports" stroke="#06b6d4" fillOpacity={1} fill="url(#colorReports)" name="Total Reports" />
                  <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved Reports" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Top Hazard Types (Pie Chart) */}
          <div className="rounded-xl border border-cyan-500/10 bg-slate-950/40 p-5 backdrop-blur-md">
            <h3 className="font-bold text-cyan-400 tracking-wider flex items-center gap-2 text-sm uppercase mb-4">
              <PieIcon className="h-4 w-4" /> Top Hazard Distributions
            </h3>
            <div className="h-80 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TOP_HAZARD_TYPES}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {TOP_HAZARD_TYPES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#06b6d4" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. District-wise Comparison (Bar Chart) */}
          <div className="rounded-xl border border-cyan-500/10 bg-slate-950/40 p-5 backdrop-blur-md">
            <h3 className="font-bold text-cyan-400 tracking-wider flex items-center gap-2 text-sm uppercase mb-4">
              <Activity className="h-4 w-4" /> District Risk Assessment
            </h3>
            <div className="h-80 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DISTRICT_COMPARISON}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#06b6d4" }} />
                  <Legend />
                  <Bar dataKey="reports" fill="#3b82f6" name="Total Incidents" />
                  <Bar dataKey="critical" fill="#ef4444" name="Critical Incidents" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Response Time by Hazard Type (Horizontal Bar Chart) */}
          <div className="rounded-xl border border-cyan-500/10 bg-slate-950/40 p-5 backdrop-blur-md">
            <h3 className="font-bold text-cyan-400 tracking-wider flex items-center gap-2 text-sm uppercase mb-4">
              <ShieldAlert className="h-4 w-4" /> Average Agency Response Times
            </h3>
            <div className="h-80 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RESPONSE_TIME_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#06b6d4" }} />
                  <Legend />
                  <Bar dataKey="minutes" fill="#8b5cf6" name="Avg Response Time (Mins)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
