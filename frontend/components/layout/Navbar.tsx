"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  BarChart3, 
  ShieldAlert, 
  ShieldCheck, 
  User, 
  AlertTriangle,
  FlameKindling
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/map", label: "GIS Map", icon: Map },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/shelters", label: "Safe Shelters", icon: FlameKindling },
    { href: "/admin", label: "Admin Panel", icon: ShieldCheck },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-[5000] w-full border-b border-slate-200 bg-white text-slate-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-wider text-slate-900">
          <ShieldAlert className="h-5 w-5 text-red-650" />
          OCEAN<span className="text-slate-550 font-normal">SHIELD</span>
          <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 tracking-normal uppercase border border-slate-200">
            Official
          </span>
        </Link>

        <div className="hidden md:flex gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded px-3 py-1.5 transition-all duration-200 ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-bold border border-slate-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                }`}
              >
                <Icon className="h-4 w-4 text-slate-500" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/report"
            className="flex items-center gap-2 rounded bg-red-600 hover:bg-red-500 border border-red-700 px-4 py-2 text-sm font-bold text-white transition-all duration-200 shadow-sm"
          >
            <AlertTriangle className="h-4 w-4" />
            Report Hazard
          </Link>
        </div>
      </div>
    </nav>
  );
}

