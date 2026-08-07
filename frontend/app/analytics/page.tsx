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
  const COLORS = ["#2563eb", "#059669", "#d97706", "#7c3aed", "#db2777", "#dc2626"];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-850 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        
        {/* Page title banner */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 font-sans text-xs uppercase tracking-wider font-bold">
            <BarChart3 className="h-4 w-4 text-slate-400" /> Incident Analytics Command Room
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Coastal Disaster Analytics
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Visual intelligence analysis of incoming reports, response times, and hazard vectors.
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. Monthly Report Trends (Area Chart) */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 tracking-wider flex items-center gap-2 text-xs uppercase mb-4">
              <TrendingUp className="h-4 w-4 text-slate-500" /> Monthly Report Trends
            </h3>
            <div className="h-80 w-full text-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_REPORTS}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#1e293b" }} />
                  <Legend />
                  <Area type="monotone" dataKey="reports" stroke="#2563eb" fillOpacity={1} fill="url(#colorReports)" name="Total Reports" />
                  <Line type="monotone" dataKey="resolved" stroke="#059669" strokeWidth={2} name="Resolved Reports" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Top Hazard Types (Pie Chart) */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 tracking-wider flex items-center gap-2 text-xs uppercase mb-4">
              <PieIcon className="h-4 w-4 text-slate-500" /> Top Hazard Distributions
            </h3>
            <div className="h-80 w-full text-[10px]">
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
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#1e293b" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. District-wise Comparison (Bar Chart) */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 tracking-wider flex items-center gap-2 text-xs uppercase mb-4">
              <Activity className="h-4 w-4 text-slate-500" /> District Risk Assessment
            </h3>
            <div className="h-80 w-full text-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DISTRICT_COMPARISON}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#1e293b" }} />
                  <Legend />
                  <Bar dataKey="reports" fill="#2563eb" name="Total Incidents" />
                  <Bar dataKey="critical" fill="#dc2626" name="Critical Incidents" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Response Time by Hazard Type (Horizontal Bar Chart) */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 tracking-wider flex items-center gap-2 text-xs uppercase mb-4">
              <ShieldAlert className="h-4 w-4 text-slate-500" /> Average Agency Response Times
            </h3>
            <div className="h-80 w-full text-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RESPONSE_TIME_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#1e293b" }} />
                  <Legend />
                  <Bar dataKey="minutes" fill="#7c3aed" name="Avg Response Time (Mins)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
