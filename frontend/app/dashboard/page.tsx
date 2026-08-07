"use client";

import { useEffect, useState } from "react";
import { logoutUser } from "@/services/firebaseAuth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import StatsCards from "@/components/dashboard/StatsCards";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import AlertSidebar from "@/components/dashboard/AlertSidebar";
import RiskMeter from "@/components/dashboard/RiskMeter";
import SihControlCenter from "@/components/dashboard/SihControlCenter";
import AiForecast from "@/components/dashboard/AiForecast";
import DamageAssessment from "@/components/dashboard/DamageAssessment";
import DroneDashboard from "@/components/dashboard/DroneDashboard";
import AiChatAssistant from "@/components/dashboard/AiChatAssistant";
import OperationalIntelligence from "@/components/dashboard/OperationalIntelligence";

// New Phase 10 Modules
import SocialIntelligenceDashboard from "@/components/social/SocialIntelligenceDashboard";
import DigitalTwinViewer from "@/components/simulation/DigitalTwinViewer";
import NationalAnalyticsDeck from "@/components/government/NationalAnalyticsDeck";
import Sidebar from "@/components/layout/Sidebar";

import { Clock, LogOut, Shield, MessageSquare, Activity } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function Dashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [time, setTime] = useState("");
  const [activeTab, setActiveTab] = useState<"eoc" | "social" | "simulation">("eoc");

  // Judge Simulation States
  const [scenario, setScenario] = useState("None");
  const [disasterMode, setDisasterMode] = useState(false);
  const [battery, setBattery] = useState(100);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + " UTC+5:30");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        router.push("/login");
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-white flex flex-col font-sans transition-all duration-300 ${
      battery < 5 ? "contrast-125 saturate-50" : ""
    }`}>
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />
        
        {/* Main command center panel */}
        <main className="flex-1 p-6 flex flex-col gap-6 overflow-x-hidden">

        
        {/* Banner with EOC status */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 to-slate-950/40 p-6 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              Emergency Operations Command (EOC) — Status: {disasterMode ? "Offline Mesh Activated" : "Operational"}
            </div>
            
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
              Command Station <span className="text-cyan-400 font-mono">{currentUser?.email?.split("@")[0] || "Staff"}</span>
              {scenario !== "None" && <span className="text-red-500 font-mono text-sm ml-3">SIMULATING: {scenario.toUpperCase()}</span>}
            </h2>
            
            <p className="text-slate-400 text-sm mt-1">
              {battery < 20 ? "🚨 Low power: telemetry background poll halted, animation FPS reduced." : "Real-time OceanShield AI hazard monitoring console & GIS response control."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-900 border border-slate-800 px-4 py-2 text-sm font-mono text-cyan-300 flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              {time}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-950/40 hover:bg-red-500 border border-red-500/40 hover:border-red-500 px-4 py-2.5 text-sm font-bold text-red-400 hover:text-white transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Tab switch navigation */}
        <div className="flex gap-2 border-b border-slate-800 pb-px text-sm">
          <button
            onClick={() => setActiveTab("eoc")}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-bold transition-all ${
              activeTab === "eoc" 
                ? "border-cyan-500 text-cyan-400" 
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Shield className="h-4 w-4" /> Command Center EOC
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-bold transition-all ${
              activeTab === "social" 
                ? "border-cyan-500 text-cyan-400" 
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="h-4 w-4" /> Social Intelligence Deck
          </button>
          <button
            onClick={() => setActiveTab("simulation")}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-bold transition-all ${
              activeTab === "simulation" 
                ? "border-cyan-500 text-cyan-400" 
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Activity className="h-4 w-4" /> Simulation & Digital Twin
          </button>
        </div>

        {/* Tab Panels */}
        {activeTab === "eoc" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-6">
              <SihControlCenter 
                onSimulateScenario={setScenario}
                onToggleDisasterMode={setDisasterMode}
                onSetBatteryLevel={setBattery}
              />
              <RiskMeter />
              <WeatherWidget />
              <AiForecast scenario={scenario} />
            </div>

            <div className="flex flex-col gap-6">
              <StatsCards />
              <DroneDashboard />
              <OperationalIntelligence />
              <DamageAssessment scenario={scenario} />
            </div>

            <div className="flex flex-col gap-6">
              <AlertSidebar />
              <AiChatAssistant />
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="flex flex-col gap-6">
            <SocialIntelligenceDashboard />
          </div>
        )}

        {activeTab === "simulation" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DigitalTwinViewer />
            <NationalAnalyticsDeck />
          </div>
        )}

      </main>
      </div>
    </div>
  );
}