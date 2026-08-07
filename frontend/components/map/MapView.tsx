"use client";

import { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getReports } from "@/services/mapService";
import { Report } from "@/types/report";
import { MOCK_SHELTERS, Shelter } from "@/constants/mockData";
import { 
  Filter, 
  MapPin, 
  Search, 
  Navigation, 
  FlameKindling, 
  ShieldAlert, 
  SlidersHorizontal,
  Flame,
  Route,
  Clock,
  Layers,
  Thermometer
} from "lucide-react";

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Icons helper
const createCustomIcon = (color: string) => {
  return new L.DivIcon({
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};"></div>`,
    className: "custom-marker-icon",
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const shelterIcon = new L.DivIcon({
  html: `<div style="background-color: #6366f1; width: 16px; height: 16px; border-radius: 4px; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px #6366f1;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width: 10px; height: 10px;"><path d="m12 3-10 9h3v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8h3L12 3z"/></svg></div>`,
  className: "shelter-marker-icon",
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

// Helper component to access map instance
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number]>([13.0827, 80.2707]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([13.0827, 80.2707]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterHazard, setFilterHazard] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Layers State
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showShelters, setShowShelters] = useState(true);
  const [mapStyle, setMapStyle] = useState<"dark" | "google-road" | "google-satellite">("dark");

  // Routing State
  const [activeRoute, setActiveRoute] = useState<{
    shelter: Shelter;
    distance: string;
    duration: string;
    safePath: [number, number][];
    blockedPath: [number, number][];
  } | null>(null);

  useEffect(() => {
    // Load reports
    const loadReports = async () => {
      const data = await getReports();
      setReports(data);
      setIsLoading(false);
    };
    void loadReports();

    // Get user geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(loc);
          setMapCenter(loc);
        },
        () => console.log("Geolocation permission denied, using default.")
      );
    }
  }, []);

  // Filter logic
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            report.hazard.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesHazard = filterHazard === "all" || report.hazard.toLowerCase() === filterHazard.toLowerCase();
      
      let matchesSeverity = true;
      if (filterSeverity !== "all") {
        if (filterSeverity === "critical") matchesSeverity = report.severity >= 4;
        else if (filterSeverity === "high") matchesSeverity = report.severity === 3;
        else if (filterSeverity === "moderate") matchesSeverity = report.severity === 2;
        else if (filterSeverity === "low") matchesSeverity = report.severity === 1;
      }

      const matchesStatus = filterStatus === "all" || report.status.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesHazard && matchesSeverity && matchesStatus;
    });
  }, [reports, searchQuery, filterHazard, filterSeverity, filterStatus]);

  // Math distance calculation helper
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // Severity color helper
  const getSeverityColor = (sev: number) => {
    if (sev >= 4) return "#ef4444"; // Red
    if (sev === 3) return "#f97316"; // Orange
    if (sev === 2) return "#f59e0b"; // Yellow
    return "#10b981"; // Green (Safe / Low)
  };

  // Trigger Routing Navigation to nearest shelter
  const handleNavigateToSafety = (shelter: Shelter) => {
    // Generate dummy route with curves/nodes between user and shelter
    const start = userLocation;
    const end: [number, number] = [shelter.latitude, shelter.longitude];
    
    // Create safe path (green) and blocked path (red dashed)
    const midPoint1: [number, number] = [start[0] + (end[0] - start[0]) * 0.4, start[1] + (end[1] - start[1]) * 0.3];
    const midPoint2: [number, number] = [start[0] + (end[0] - start[0]) * 0.7, start[1] + (end[1] - start[1]) * 0.85];

    // Blocked road branches off from midPoint1
    const blockedNode: [number, number] = [midPoint1[0] + 0.008, midPoint1[1] - 0.005];

    setActiveRoute({
      shelter,
      distance: calculateDistance(start[0], start[1], end[0], end[1]) + " km",
      duration: Math.round(parseFloat(calculateDistance(start[0], start[1], end[0], end[1])) * 2.5) + " mins",
      safePath: [start, midPoint1, midPoint2, end],
      blockedPath: [midPoint1, blockedNode]
    });

    setMapCenter(end);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-73px)] w-full overflow-hidden bg-slate-50 text-slate-850">
      
      {/* 1. Left Smart Filters Sidebar */}
      <aside className="w-full md:w-80 border-r border-slate-200 bg-white p-5 flex flex-col gap-4 overflow-y-auto shrink-0 z-[1010]">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <SlidersHorizontal className="h-4 w-4 text-slate-505" />
          <h2 className="font-bold text-xs uppercase tracking-wider text-slate-700">Smart GIS Filters</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search location or incident..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-900 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        </div>

        {/* Hazard Type Filter */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Hazard Type</label>
          <select
            value={filterHazard}
            onChange={(e) => setFilterHazard(e.target.value)}
            className="mt-1 w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
          >
            <option value="all">All Hazards</option>
            <option value="flooding">Coastal Flooding</option>
            <option value="cyclone">Cyclone / Wind Damage</option>
            <option value="waves">High Waves / Erosion</option>
            <option value="pollution">Marine Pollution</option>
            <option value="oil_spill">Oil Spill</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Severity</label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="mt-1 w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical (Red)</option>
            <option value="high">High (Orange)</option>
            <option value="moderate">Moderate (Yellow)</option>
            <option value="low">Low (Green)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Verification Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mt-1 w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Layers Control */}
        <div className="border-t border-slate-900 pt-3">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5 mb-2">
            <Layers className="h-3.5 w-3.5 text-cyan-500" /> Layer Toggle
          </label>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="accent-cyan-500 h-4 w-4"
              />
              Show Live Heat Map
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showShelters}
                onChange={(e) => setShowShelters(e.target.checked)}
                className="accent-cyan-500 h-4 w-4"
              />
              Show Emergency Shelters
            </label>
          </div>
        </div>

        {/* Base Map Select */}
        <div className="border-t border-slate-100 pt-3">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5 mb-2">
            <Layers className="h-3.5 w-3.5 text-slate-550" /> Map Tile Source
          </label>
          <select
            value={mapStyle}
            onChange={(e) => setMapStyle(e.target.value as any)}
            className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
          >
            <option value="dark">CartoDB Dark Theme (OSM)</option>
            <option value="google-road">Google Maps (Roadmap)</option>
            <option value="google-satellite">Google Maps (Satellite)</option>
          </select>
        </div>

        {/* Active Route Box */}
        {activeRoute && (
          <div className="mt-auto border border-blue-200 rounded bg-blue-50/50 p-3 text-xs text-blue-950">
            <div className="flex justify-between items-center mb-1">
              <span className="font-extrabold uppercase tracking-wider text-[10px] text-blue-900 flex items-center gap-1">
                <Route className="h-3.5 w-3.5" /> Active Safety Route
              </span>
              <button 
                onClick={() => setActiveRoute(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <p className="font-semibold text-slate-900 leading-tight">{activeRoute.shelter.name}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500">Distance</span>
                <p className="font-mono text-slate-900 font-bold">{activeRoute.distance}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Est. Time</span>
                <p className="font-mono text-slate-900 font-bold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                  {activeRoute.duration}
                </p>
              </div>
            </div>
            <div className="mt-2 border-t border-slate-200 pt-2 text-[10px] text-slate-500 leading-snug">
              <span className="text-emerald-600 font-bold">Route clear:</span> Coastal Highway safe. <span className="text-red-650 font-bold">Erosion Block:</span> Royapuram connector blocked.
            </div>
          </div>
        )}
      </aside>

      {/* 2. Fullscreen GIS map container */}
      <div className="flex-1 relative h-full w-full">
        <MapContainer
          center={mapCenter}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
        >
          <MapController center={mapCenter} />

          {mapStyle === "dark" && (
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          )}
          {mapStyle === "google-road" && (
            <TileLayer
              attribution="© Google Maps"
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            />
          )}
          {mapStyle === "google-satellite" && (
            <TileLayer
              attribution="© Google Maps"
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            />
          )}

          {/* User Location marker */}
          <Circle
            center={userLocation}
            radius={2000}
            pathOptions={{ fillColor: "#06b6d4", fillOpacity: 0.1, color: "#06b6d4", weight: 1, dashArray: "4 4" }}
          />
          <Marker position={userLocation} icon={createCustomIcon("#06b6d4")}>
            <Popup>
              <p className="font-bold text-xs text-cyan-400">COMMAND POST / USER LOCATION</p>
              <p className="text-[11px] text-slate-600">Coordinates: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}</p>
            </Popup>
          </Marker>

          {/* Render filters/reports */}
          {filteredReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={createCustomIcon(getSeverityColor(report.severity))}
            >
              <Popup minWidth={240}>
                <div className="text-slate-900 text-xs">
                  <div className="flex justify-between items-center border-b pb-1.5 mb-1.5">
                    <span className="font-bold uppercase tracking-wider text-cyan-600">{report.hazard}</span>
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                      style={{ backgroundColor: getSeverityColor(report.severity) }}
                    >
                      SEVERITY: {report.severity}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm leading-tight mb-1">{report.title}</h3>
                  <p className="text-slate-600 leading-normal mb-2">{report.description}</p>
                  
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] border-t pt-1.5 text-slate-500">
                    <span><b>Status:</b> {report.status}</span>
                    <span><b>Distance:</b> {calculateDistance(userLocation[0], userLocation[1], report.latitude, report.longitude)} km</span>
                    <span><b>Lat/Lng:</b> {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
                    <span><b>Date:</b> {new Date(report.created_at).toLocaleDateString()}</span>
                  </div>

                  {report.weather_data && (
                    <div className="mt-2 border-t pt-1.5 text-[10px] text-slate-600">
                      <span className="font-bold text-cyan-700">🌡️ Weather at Incident:</span>
                      <div className="grid grid-cols-2 gap-x-2 mt-0.5 text-slate-500">
                        <span>Temp: {report.weather_data.temp}°C</span>
                        <span>Wind: {report.weather_data.wind_speed} km/h ({report.weather_data.wind_dir})</span>
                        <span>Rain: {report.weather_data.rainfall} mm</span>
                        <span>Humidity: {report.weather_data.humidity}%</span>
                      </div>
                    </div>
                  )}

                  {(report as any).ai_results?.verification_score !== undefined && (
                    <div className="mt-2 border-t pt-1.5 text-[10px] font-bold text-cyan-600">
                      🛡️ AI Verification: {(report as any).ai_results.verification_score}% ({(report as any).ai_results.verification_status})
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Shelters Layer */}
          {showShelters && MOCK_SHELTERS.map((shelter) => (
            <Marker
              key={shelter.id}
              position={[shelter.latitude, shelter.longitude]}
              icon={shelterIcon}
            >
              <Popup minWidth={240}>
                <div className="text-slate-900 text-xs">
                  <div className="flex justify-between items-center border-b pb-1.5 mb-1.5">
                    <span className="font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                      <FlameKindling className="h-3.5 w-3.5" /> Shelter
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {shelter.occupancy}/{shelter.capacity} CAP
                    </span>
                  </div>
                  <h3 className="font-bold text-sm leading-tight mb-1">{shelter.name}</h3>
                  <p className="text-slate-600 mb-2 leading-tight">{shelter.address}</p>
                  
                  <div className="text-[10px] text-slate-500 mb-3">
                    <p><b>Contact:</b> {shelter.contact}</p>
                    <p><b>Type:</b> {shelter.type.replace("_", " ").toUpperCase()}</p>
                  </div>

                  <button
                    onClick={() => handleNavigateToSafety(shelter)}
                    className="w-full flex items-center justify-center gap-1.5 rounded bg-indigo-600 py-1.5 text-xs font-bold text-white transition-all duration-200 hover:bg-indigo-500"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Navigate to Safety
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Heatmap circles if toggled */}
          {showHeatmap && filteredReports.map((report) => (
            <Circle
              key={`heat-${report.id}`}
              center={[report.latitude, report.longitude]}
              radius={3500}
              pathOptions={{
                fillColor: getSeverityColor(report.severity),
                fillOpacity: 0.15,
                color: "transparent",
                weight: 0
              }}
            />
          ))}

          {/* Render Safety routing paths if active */}
          {activeRoute && (
            <>
              {/* Safe Route (Green Polyline) */}
              <Polyline 
                positions={activeRoute.safePath}
                pathOptions={{ color: "#10b981", weight: 5, opacity: 0.8, lineJoin: "round" }}
              />
              {/* Unsafe / Blocked Route (Red Dashed Polyline) */}
              <Polyline 
                positions={activeRoute.blockedPath}
                pathOptions={{ color: "#ef4444", weight: 4, opacity: 0.7, dashArray: "5 10" }}
              />
            </>
          )}

        </MapContainer>

        {/* Legend status indicators overlay */}
        <div className="absolute right-4 bottom-4 z-[1000] rounded-lg border border-cyan-500/20 bg-slate-950/90 px-4 py-3 text-xs text-white shadow-lg backdrop-blur-md">
          <p className="font-bold text-cyan-300 uppercase tracking-wider mb-2">GIS Command Legends</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
              <span>Critical Risk Level</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400"></span>
              <span>High Severity Hazard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
              <span>Moderate Threat Level</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
              <span>Safe / Low Hazard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-indigo-500 flex items-center justify-center text-[8px]">🏠</span>
              <span>Emergency Shelter</span>
            </div>
          </div>
        </div>

        {/* Top Floating Bar */}
        <div className="absolute left-4 top-4 z-[1000] rounded-lg bg-slate-950/90 px-4 py-2.5 text-xs text-white shadow-lg border border-cyan-500/20 backdrop-blur-md">
          <p className="font-bold text-cyan-300">Live GIS Data Layer Feed</p>
          <p className="text-slate-400">{isLoading ? "Syncing sensors…" : `${filteredReports.length} Active incidents filtered`}</p>
        </div>
      </div>
    </div>
  );
}
