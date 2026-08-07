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
        return { label: "Cyclone Shelter", color: "bg-indigo-50 border-indigo-150 text-indigo-700", icon: Home };
      case "hospital":
        return { label: "Hospital / Medical", color: "bg-emerald-50 border-emerald-150 text-emerald-700", icon: Heart };
      case "ndrf_camp":
        return { label: "NDRF Camp", color: "bg-red-50 border-red-150 text-red-700", icon: ShieldCheck };
      case "coast_guard":
        return { label: "Coast Guard", color: "bg-blue-50 border-blue-150 text-blue-700", icon: Building };
      default:
        return { label: "Emergency Post", color: "bg-slate-50 border-slate-150 text-slate-700", icon: Building };
    }
  };

  const handleNavigate = (shelter: Shelter) => {
    alert(`🗺️ Loading safety evacuation route to ${shelter.name}... Navigate using the GIS Map.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        
        {/* Banner */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 font-sans text-xs uppercase tracking-wider font-bold">
            <FlameKindling className="h-4 w-4 text-slate-400" /> Safety Infrastructure Directory
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Safe Shelters & Emergency Posts
          </h2>
          <p className="text-slate-500 text-xs mt-1">
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
              className="w-full rounded border border-slate-200 bg-white px-4 py-3 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-900 focus:outline-none"
            />
            <Search className="absolute left-3.5 top-4 h-4 w-4 text-slate-400" />
          </div>

          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-905 focus:border-blue-900 focus:outline-none"
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
                className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badge.color}`}>
                      <BadgeIcon className="h-3 w-3" />
                      {badge.label}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      occupancyPercentage > 85 ? "bg-red-50 text-red-700 border border-red-150" : "bg-emerald-50 text-emerald-700 border border-emerald-150"
                    }`}>
                      {occupancyPercentage}% FULL
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug">
                    {shelter.name}
                  </h3>

                  <p className="text-xs text-slate-500 mb-3 flex items-start gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    {shelter.address}
                  </p>

                  {/* Capacity Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>Occupancy</span>
                      <span className="font-mono text-slate-805 font-bold">{shelter.occupancy} / {shelter.capacity} people</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div 
                        className={`h-full ${occupancyPercentage > 85 ? "bg-red-600" : "bg-emerald-600"}`} 
                        style={{ width: `${occupancyPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4 flex gap-3">
                  <a
                    href={`tel:${shelter.contact}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded bg-slate-50 border border-slate-200 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-100"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call
                  </a>

                  <button
                    onClick={() => handleNavigate(shelter)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded bg-blue-900 border border-blue-900 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-800"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Evac Route
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
