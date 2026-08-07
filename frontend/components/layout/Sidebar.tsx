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
    { href: "/analytics", label: "Analytics", icon: BarChart3, roles: ["govt"] },
    { href: "/report", label: "Reports", icon: AlertTriangle, roles: ["govt", "volunteer"] },
    { href: "/shelters", label: "Shelters", icon: FlameKindling },
    { href: "/profile", label: "Emergency Contacts", icon: Phone },
    { href: "/admin", label: "Users & Admin", icon: Users, roles: ["govt"] },
    { href: "/profile", label: "Settings & Profile", icon: Settings },
  ];

  let activeRole = "citizen";
  if (typeof window !== "undefined") {
    activeRole = localStorage.getItem("user_role") || "citizen";
  }

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(activeRole);
  });

  const handleLogout = async () => {
    await logoutUser();
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_role");
    }
    router.push("/login");
  };

  return (
    <aside 
      className={`sticky top-0 left-0 h-[calc(100vh-73px)] border-r border-slate-200 bg-white transition-all duration-300 z-[4000] flex flex-col justify-between shrink-0 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col gap-2 p-3">
        {/* Toggle button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="self-end p-1.5 rounded hover:bg-slate-100 border border-transparent hover:border-slate-200 text-slate-500 hover:text-slate-800 transition-all mb-2"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Menu Navigation */}
        <nav className="flex flex-col gap-1">
          {filteredMenuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 rounded px-3 py-2.5 transition-all text-sm font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-900 border border-blue-100 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-950' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-800 border border-transparent transition-all"
        >
          <LogOut className="h-5 w-5 shrink-0 text-red-500" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
