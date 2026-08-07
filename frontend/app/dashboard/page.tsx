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
  const [role, setRole] = useState<string>("citizen");

  // Judge Simulation States
  const [scenario, setScenario] = useState("None");
  const [disasterMode, setDisasterMode] = useState(false);
  const [battery, setBattery] = useState(100);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("user_role") || "citizen";
      setRole(savedRole);
    }
  }, []);

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
    <div className={`min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-all duration-300 ${
      battery < 5 ? "contrast-125 saturate-50" : ""
    }`}>
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />
        
        {/* Main command center panel */}
        <main className="flex-1 p-6 flex flex-col gap-6 overflow-x-hidden">

        
        {/* Banner with EOC status */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-slate-500 font-sans text-xs uppercase tracking-wider font-bold">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Emergency Operations Command (EOC) — Status: {disasterMode ? "Offline Mesh Activated" : "Operational"}
            </div>
            
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Command Station <span className="text-blue-900 font-mono">{currentUser?.email?.split("@")[0] || "Staff"}</span>
              {scenario !== "None" && <span className="text-red-650 font-mono text-sm ml-3 font-bold">SIMULATING: {scenario.toUpperCase()}</span>}
            </h2>
            
            <p className="text-slate-500 text-xs mt-1">
              {battery < 20 ? "🚨 Low power: telemetry background poll halted, animation FPS reduced." : "Real-time OceanShield hazard monitoring console & GIS response control."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono text-slate-700 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              {time}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 transition-all duration-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>

        {/* Tab switch navigation */}
        <div className="flex gap-2 border-b border-slate-200 pb-px text-sm">
          <button
            onClick={() => setActiveTab("eoc")}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-bold transition-all ${
              activeTab === "eoc" 
                ? "border-blue-900 text-blue-900" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Shield className="h-4 w-4" /> {role === "citizen" ? "Citizen Portal" : role === "volunteer" ? "Volunteer Command" : "Command Center EOC"}
          </button>
          
          {role !== "citizen" && (
            <button
              onClick={() => setActiveTab("social")}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-bold transition-all ${
                activeTab === "social" 
                  ? "border-blue-900 text-blue-900" 
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <MessageSquare className="h-4 w-4" /> Social Intelligence Deck
            </button>
          )}

          {role === "govt" && (
            <button
              onClick={() => setActiveTab("simulation")}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-bold transition-all ${
                activeTab === "simulation" 
                  ? "border-blue-900 text-blue-900" 
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Activity className="h-4 w-4" /> Simulation & Digital Twin
            </button>
          )}
        </div>

        {/* Tab Panels */}
        {activeTab === "eoc" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-6">
              {role === "govt" && (
                <SihControlCenter 
                  onSimulateScenario={setScenario}
                  onToggleDisasterMode={setDisasterMode}
                  onSetBatteryLevel={setBattery}
                />
              )}
              <RiskMeter />
              <WeatherWidget />
              {role !== "citizen" && <AiForecast scenario={scenario} />}
            </div>

            <div className="flex flex-col gap-6">
              <StatsCards />
              {role === "govt" && <DroneDashboard />}
              {role !== "citizen" && <OperationalIntelligence />}
              <DamageAssessment scenario={scenario} />
            </div>

            <div className="flex flex-col gap-6">
              <AlertSidebar />
              <AiChatAssistant />
            </div>
          </div>
        )}

        {role !== "citizen" && activeTab === "social" && (
          <div className="flex flex-col gap-6">
            <SocialIntelligenceDashboard />
          </div>
        )}

        {role === "govt" && activeTab === "simulation" && (
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