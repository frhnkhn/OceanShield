"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { logoutUser } from "@/services/firebaseAuth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { EMERGENCY_CONTACTS } from "@/constants/mockData";
import { 
  User as UserIcon, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  LogOut, 
  Award, 
  Settings, 
  Heart,
  Moon,
  Info
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [notifEnabled, setNotifEnabled] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  const achievements = [
    { title: "Coastal Guardian", desc: "First incident report submitted and verified.", icon: ShieldCheck, color: "text-cyan-400" },
    { title: "Rescue Coordinator", desc: "Assisted in routing emergency staff to local shelters.", icon: Award, color: "text-yellow-400" },
    { title: "Watch Commander", desc: "Logged over 5 reports verified by administration.", icon: Heart, color: "text-emerald-400" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left profile column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Identity Card */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-md text-center flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-cyan-950 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center mb-4">
                <UserIcon className="h-10 w-10" />
              </div>
              <h3 className="font-bold text-lg text-white">
                {currentUser?.email?.split("@")[0].toUpperCase() || "AGENT_STAFF"}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser?.email || "staff@oceanshield.gov"}</p>
              
              <div className="mt-4 rounded-full bg-cyan-500/10 px-3 py-1 border border-cyan-500/30 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                Level 3 Watch Officer
              </div>

              <button
                onClick={handleLogout}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-red-950/40 hover:bg-red-500 border border-red-500/40 hover:border-red-500 py-2.5 text-xs font-bold text-red-400 hover:text-white transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>

            {/* Profile Settings */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-5 backdrop-blur-md flex flex-col gap-4">
              <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 flex items-center gap-1.5 border-b border-slate-900 pb-3">
                <Settings className="h-4 w-4 text-cyan-500" /> Console Settings
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">Tactical Dark Mode</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Optimized for nocturnal emergency centers.</p>
                  </div>
                  <button 
                    onClick={() => setDarkMode(prev => !prev)}
                    className={`h-6 w-11 rounded-full p-1 transition-all ${darkMode ? "bg-cyan-600" : "bg-slate-800"}`}
                  >
                    <div className={`h-4 w-4 rounded-full bg-white transition-all ${darkMode ? "translate-x-5" : ""}`} />
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">Sensor Sound Alerts</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Audible warning when critical hazards load.</p>
                  </div>
                  <button 
                    onClick={() => setNotifEnabled(prev => !prev)}
                    className={`h-6 w-11 rounded-full p-1 transition-all ${notifEnabled ? "bg-cyan-600" : "bg-slate-800"}`}
                  >
                    <div className={`h-4 w-4 rounded-full bg-white transition-all ${notifEnabled ? "translate-x-5" : ""}`} />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right details column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Achievements */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-md flex flex-col gap-4">
              <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-yellow-400" /> Watch Accomplishments & Badges
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((ach, idx) => {
                  const Icon = ach.icon;
                  return (
                    <div key={idx} className="rounded-lg border border-slate-900 bg-slate-950 p-4 flex flex-col items-center text-center">
                      <Icon className={`h-8 w-8 mb-2 ${ach.color}`} />
                      <h4 className="font-bold text-xs text-white leading-tight">{ach.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{ach.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emergency Hotline Module */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-md flex flex-col gap-4">
              <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-cyan-400" /> One-Click Emergency Hotlines
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EMERGENCY_CONTACTS.map((contact, index) => (
                  <a
                    key={index}
                    href={`tel:${contact.phone}`}
                    className="flex justify-between items-center p-3 rounded-lg border border-slate-900 bg-slate-950 hover:border-cyan-500/30 transition-all group"
                  >
                    <div>
                      <p className="font-bold text-xs text-white leading-tight">{contact.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{contact.subtitle}</p>
                    </div>
                    <span className="rounded bg-cyan-500/10 group-hover:bg-cyan-500 border border-cyan-500/30 px-2.5 py-1 text-xs font-mono font-bold text-cyan-400 group-hover:text-black transition-all">
                      {contact.phone}
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
