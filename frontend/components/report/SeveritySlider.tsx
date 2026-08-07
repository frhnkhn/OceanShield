interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function SeveritySlider({
  value,
  onChange,
}: Props) {
  return (
    <div>

      <p className="text-slate-800 mb-2 font-bold text-xs uppercase tracking-wider">

        Severity: {value}

      </p>

      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="w-full"
      />

    </div>
  );
}