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
    { title: "Coastal Guardian", desc: "First incident report submitted and verified.", icon: ShieldCheck, color: "text-blue-600" },
    { title: "Rescue Coordinator", desc: "Assisted in routing emergency staff to local shelters.", icon: Award, color: "text-yellow-650" },
    { title: "Watch Commander", desc: "Logged over 5 reports verified by administration.", icon: Heart, color: "text-emerald-650" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left profile column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Identity Card */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm text-center flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-blue-50 border-2 border-blue-200 text-blue-900 flex items-center justify-center mb-4">
                <UserIcon className="h-10 w-10 text-blue-900" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">
                {currentUser?.email?.split("@")[0].toUpperCase() || "AGENT_STAFF"}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser?.email || "staff@oceanshield.gov"}</p>
              
              <div className="mt-4 rounded-full bg-blue-50 px-3 py-1 border border-blue-150 text-[10px] font-bold text-blue-900 uppercase tracking-widest">
                Level 3 Watch Officer
              </div>

              <button
                onClick={handleLogout}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 py-2.5 text-xs font-bold text-slate-700 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>

            {/* Profile Settings */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-xs tracking-wider uppercase text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Settings className="h-4 w-4 text-slate-500" /> Console Settings
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">Tactical Dark Mode</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Optimized for nocturnal emergency centers.</p>
                  </div>
                  <button 
                    onClick={() => setDarkMode(prev => !prev)}
                    className={`h-6 w-11 rounded-full p-1 transition-all ${darkMode ? "bg-blue-900" : "bg-slate-350"}`}
                  >
                    <div className={`h-4 w-4 rounded-full bg-white transition-all ${darkMode ? "translate-x-5" : ""}`} />
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">Sensor Sound Alerts</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Audible warning when critical hazards load.</p>
                  </div>
                  <button 
                    onClick={() => setNotifEnabled(prev => !prev)}
                    className={`h-6 w-11 rounded-full p-1 transition-all ${notifEnabled ? "bg-blue-900" : "bg-slate-350"}`}
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
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-xs tracking-wider uppercase text-slate-500 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-yellow-650" /> Watch Accomplishments & Badges
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((ach, idx) => {
                  const Icon = ach.icon;
                  return (
                    <div key={idx} className="rounded border border-slate-200 bg-slate-50 p-4 flex flex-col items-center text-center">
                      <Icon className={`h-8 w-8 mb-2 ${ach.color}`} />
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">{ach.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{ach.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emergency Hotline Module */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-xs tracking-wider uppercase text-slate-500 flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-slate-500" /> One-Click Emergency Hotlines
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EMERGENCY_CONTACTS.map((contact, index) => (
                  <a
                    key={index}
                    href={`tel:${contact.phone}`}
                    className="flex justify-between items-center p-3 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all group"
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-900 leading-tight">{contact.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{contact.subtitle}</p>
                    </div>
                    <span className="rounded bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-mono font-bold text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-all">
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
