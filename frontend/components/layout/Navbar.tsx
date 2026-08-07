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
    <nav className="sticky top-0 z-[5000] w-full border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-wider text-cyan-400">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          OCEAN<span className="text-white">SHIELD</span>
        </Link>

        <div className="hidden md:flex gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/report"
            className="flex items-center gap-2 rounded-lg bg-red-500/20 border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            <AlertTriangle className="h-4 w-4" />
            Report Hazard
          </Link>
        </div>
      </div>
    </nav>
  );
}

