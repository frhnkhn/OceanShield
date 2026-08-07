"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import { MOCK_SHELTERS, Shelter } from "@/constants/mockData";
import { 
  FlameKindling, 
  Search, 
  Phone, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Building, 
  Home, 
  Heart,
  Navigation
} from "lucide-react";

export default function SheltersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredShelters = useMemo(() => {
    return MOCK_SHELTERS.filter(shelter => {
      const matchesSearch = shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            shelter.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || shelter.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, filterType]);

  const getShelterBadge = (type: Shelter["type"]) => {
    switch (type) {
      case "cyclone_shelter":
        return { label: "Cyclone Shelter", color: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400", icon: Home };
      case "hospital":
        return { label: "Hospital / Medical", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", icon: Heart };
      case "ndrf_camp":
        return { label: "NDRF Camp", color: "bg-red-500/10 border-red-500/30 text-red-400", icon: ShieldCheck };
      case "coast_guard":
        return { label: "Coast Guard", color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400", icon: Building };
      default:
        return { label: "Emergency Post", color: "bg-slate-500/10 border-slate-500/30 text-slate-400", icon: Building };
    }
  };

  const handleNavigate = (shelter: Shelter) => {
    alert(`🗺️ Loading safety evacuation route to ${shelter.name}... Navigate using the GIS Map.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        
        {/* Banner */}
        <div className="rounded-xl border border-cyan-500/20 bg-slate-950/40 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">
            <FlameKindling className="h-4 w-4" /> Safety Infrastructure Directory
          </div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            Safe Shelters & Emergency Posts
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Search and locate active cyclone shelters, hospitals, police networks, and emergency camps.
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <input
              type="text"
              placeholder="Search shelters by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          </div>

          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="all">All Infrastructure Types</option>
              <option value="cyclone_shelter">Cyclone Shelters</option>
              <option value="hospital">Hospitals</option>
              <option value="ndrf_camp">NDRF Camps</option>
              <option value="coast_guard">Coast Guard Stations</option>
              <option value="police_station">Police Stations</option>
              <option value="fire_station">Fire Stations</option>
            </select>
          </div>
        </div>

        {/* Shelter Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShelters.map((shelter) => {
            const badge = getShelterBadge(shelter.type);
            const BadgeIcon = badge.icon;
            const occupancyPercentage = Math.round((shelter.occupancy / shelter.capacity) * 100);

            return (
              <div 
                key={shelter.id}
                className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-cyan-500/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badge.color}`}>
                      <BadgeIcon className="h-3 w-3" />
                      {badge.label}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      occupancyPercentage > 85 ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {occupancyPercentage}% FULL
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white mb-2 leading-snug">
                    {shelter.name}
                  </h3>

                  <p className="text-xs text-slate-400 mb-3 flex items-start gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                    {shelter.address}
                  </p>

                  {/* Capacity Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>Occupancy</span>
                      <span className="font-mono text-white">{shelter.occupancy} / {shelter.capacity} people</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full ${occupancyPercentage > 85 ? "bg-red-500" : "bg-emerald-500"}`} 
                        style={{ width: `${occupancyPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-900 pt-4 flex gap-3">
                  <a
                    href={`tel:${shelter.contact}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 py-2.5 text-xs font-bold text-slate-300 transition-all hover:bg-slate-850"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call
                  </a>

                  <button
                    onClick={() => handleNavigate(shelter)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 border border-indigo-500 py-2.5 text-xs font-bold text-white transition-all hover:bg-indigo-500"
                  >
                    <Navigation className="h-3.5 w-3.5 animate-pulse" /> Evac Route
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
