"use client";

import { useEffect, useState } from "react";
import { MOCK_WEATHER, WeatherInfo } from "@/constants/mockData";
import { 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  Waves, 
  AlertTriangle,
  MapPin,
  RefreshCw
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherInfo & { fetchedAt?: string; locationName?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState({ lat: 13.0827, lng: 80.2707 }); // Default to Chennai
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Geolocation permission denied or failed, using default coordinates.", error);
          setLocationError(true);
        }
      );
    }
  }, []);

  const loadWeather = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/weather/?latitude=${lat}&longitude=${lng}`);
      if (!res.ok) throw new Error("Failed to fetch weather");
      const data = await res.json();
      setWeather({
        temp: data.temp,
        windSpeed: data.wind_speed,
        windDir: data.wind_dir,
        humidity: data.humidity,
        rainfall: data.rainfall,
        tideLevel: data.tide_level || "Normal",
        cycloneWarning: data.cyclone_warning,
        cycloneCategory: data.cyclone_category,
        fetchedAt: data.fetched_at,
        locationName: lat === 13.0827 && lng === 80.2707 ? "Chennai Coast" : "Local Coordinates"
      });
    } catch (err) {
      console.error("Error loading weather, using fallback mock data:", err);
      setWeather({
        ...MOCK_WEATHER,
        locationName: "Fallback Station"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(coords.lat, coords.lng);
  }, [coords]);

  const w = weather || MOCK_WEATHER;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wider">
          <Waves className="h-4 w-4 text-slate-500" /> Weather Conditions
        </h3>
        <div className="flex items-center gap-3">
          {w.cycloneWarning && (
            <span className="flex items-center gap-1 rounded bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-bold text-red-600">
              <AlertTriangle className="h-3 w-3 text-red-500" /> CYCLONE ALERT
            </span>
          )}
          <button 
            onClick={() => loadWeather(coords.lat, coords.lng)} 
            disabled={loading}
            className="text-slate-400 hover:text-slate-650 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {w.cycloneWarning && w.cycloneCategory && (
        <div className="mt-3 rounded bg-red-50 border border-red-200/60 p-2.5 text-[11px] text-red-700">
          <strong>Alert:</strong> {w.cycloneCategory} active in local sector. Please advise emergency response.
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded bg-slate-50 p-2 border border-slate-100 text-slate-500">
            <Thermometer className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Temperature</p>
            <p className="text-sm font-semibold text-slate-900">{w.temp}°C</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded bg-slate-50 p-2 border border-slate-100 text-slate-500">
            <Wind className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Wind Speed</p>
            <p className="text-sm font-semibold text-slate-900">{w.windSpeed} km/h ({w.windDir})</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded bg-slate-50 p-2 border border-slate-100 text-slate-500">
            <Droplets className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Humidity</p>
            <p className="text-sm font-semibold text-slate-900">{w.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded bg-slate-50 p-2 border border-slate-100 text-slate-500">
            <CloudRain className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Precipitation</p>
            <p className="text-sm font-semibold text-slate-900">{w.rainfall} mm</p>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 flex justify-between items-center text-[10px] text-slate-450">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-slate-400" /> {w.locationName || "Coastal Station"} ({coords.lat.toFixed(2)}, {coords.lng.toFixed(2)})
        </span>
        {w.fetchedAt && (
          <span>Updated: {w.fetchedAt}</span>
        )}
      </div>
    </div>
  );
}
// triggered hot reload rebuild
