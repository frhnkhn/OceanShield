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
      className="w-full rounded-lg bg-slate-800 p-3 text-white"
    >
      {hazards.map((hazard) => (
        <option key={hazard}>
          {hazard}
        </option>
      ))}
    </select>
  );
}