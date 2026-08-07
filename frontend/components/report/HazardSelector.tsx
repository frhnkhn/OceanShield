interface Props {
  value: string;
  onChange: (value: string) => void;
}

const hazards = [
  "Flood",
  "High Waves",
  "Oil Spill",
  "Coastal Erosion",
  "Marine Pollution",
  "Cyclone",
  "Tsunami",
];

export default function HazardSelector({
  value,
  onChange,
}: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:border-blue-900 focus:outline-none"
    >
      {hazards.map((hazard) => (
        <option key={hazard}>
          {hazard}
        </option>
      ))}
    </select>
  );
}