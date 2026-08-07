"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/services/firebaseAuth";
import { 
  LayoutDashboard, 
  Map, 
  BarChart3, 
  FlameKindling, 
  ShieldCheck, 
  User, 
  AlertTriangle,
  Phone,
  Settings,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/map", label: "GIS Map", icon: Map },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/report", label: "Reports", icon: AlertTriangle },
    { href: "/shelters", label: "Shelters", icon: FlameKindling },
    { href: "/profile", label: "Emergency Contacts", icon: Phone },
    { href: "/admin", label: "Users & Admin", icon: Users },
    { href: "/profile", label: "Settings & Profile", icon: Settings },
  ];

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <aside 
      className={`sticky top-0 left-0 h-[calc(100vh-73px)] border-r border-cyan-500/20 bg-slate-950/90 backdrop-blur-md transition-all duration-300 z-[4000] flex flex-col justify-between shrink-0 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col gap-2 p-3">
        {/* Toggle button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="self-end p-1.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 text-slate-400 hover:text-white transition-all mb-2"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Menu Navigation */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-sm font-medium ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-3 border-t border-slate-900">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/40 hover:text-white border border-transparent hover:border-red-500/20 transition-all"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
