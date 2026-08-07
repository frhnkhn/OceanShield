import { useEffect, useState } from "react";

interface UploadBoxProps {
  images: File[];
  setImages: (files: File[]) => void;
  disabled?: boolean;
}

export default function UploadBox({
  images,
  setImages,
  disabled = false,
}: UploadBoxProps) {
  const [simBattery, setSimBattery] = useState(100);

  useEffect(() => {
    // Listen for custom event indicating simulated battery changes
    const handleBatteryChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail !== undefined) {
        setSimBattery(customEvent.detail);
      }
    };
    window.addEventListener("sim_battery_change", handleBatteryChange);
    return () => window.removeEventListener("sim_battery_change", handleBatteryChange);
  }, []);

  const isLowBatteryBlocked = simBattery < 5;

  return (
    <div className="space-y-3">
      <label className="font-semibold text-white flex justify-between items-center">
        <span>Upload hazard evidence pictures <span className="text-slate-400">(optional, multiple allowed)</span></span>
        {isLowBatteryBlocked && (
          <span className="text-[10px] bg-red-500/20 border border-red-500/40 text-red-400 px-2 py-0.5 rounded font-bold animate-pulse">
            CAMERA BLOCKED (BATTERY &lt; 5%)
          </span>
        )}
      </label>

      <input
        type="file"
        accept="image/*"
        multiple
        disabled={disabled || isLowBatteryBlocked}
        onChange={(e) => {
          if (e.target.files) {
            setImages(Array.from(e.target.files));
          }
        }}
        className={`w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-950 file:text-cyan-400 hover:file:bg-cyan-900 transition-all ${
          isLowBatteryBlocked ? "opacity-50 cursor-not-allowed" : ""
        }`}
      />

      {isLowBatteryBlocked && (
        <p className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-300">
          ⚠️ Camera and media uploads are disabled to preserve critical battery power (&lt;5%). Please send a text/location report only.
        </p>
      )}

      {images.length > 0 && !isLowBatteryBlocked && (
        <div className="space-y-2">
          <p className="font-semibold text-xs text-cyan-400">Selected evidence pictures ({images.length}):</p>
          <div className="grid grid-cols-2 gap-2">
            {images.map((file, idx) => (
              <p key={idx} className="rounded-lg border border-cyan-900 bg-slate-950 p-2 text-xs text-cyan-200 truncate">
                📄 {file.name} ({Math.ceil(file.size / 1024)} KB)
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
