"use client";

interface StarRatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  label?: string;
  step?: number;
}

export default function StarRating({
  value,
  max = 10,
  onChange,
  size = "md",
  readonly = false,
  label,
  step = 0.5,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const getColor = (rating: number) => {
    if (rating >= 8) return "text-green-500";
    if (rating >= 6) return "text-yellow-500";
    if (rating >= 4) return "text-orange-500";
    return "text-red-500";
  };

  if (readonly) {
    return (
      <div className="flex items-center gap-1">
        {label && <span className="text-xs text-gray-400 mr-1">{label}</span>}
        <span className={`font-bold ${sizeClasses[size]} ${getColor(value)}`}>
          {value.toFixed(1)}
        </span>
        <span className="text-xs text-gray-400">/{max}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-300">{label}</label>}
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0.5}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
        <span className={`font-bold min-w-[2.5rem] text-center ${sizeClasses[size]} ${getColor(value)}`}>
          {value.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
