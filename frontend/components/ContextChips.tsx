import React from "react";

interface ContextChipsProps {
  currentZone: string;
  priority: string;
  onZoneChange: (zone: string) => void;
  onPriorityChange: (priority: string) => void;
  disabled?: boolean;
}

export default function ContextChips({
  currentZone,
  priority,
  onZoneChange,
  onPriorityChange,
  disabled = false,
}: ContextChipsProps) {
  const zones = ["South Gate", "North Gate", "VIP Lounge", "East Gate"];
  const priorities = [
    { id: "fastest", label: "Fastest" },
    { id: "least_crowded", label: "Least Crowded" },
    { id: "balanced", label: "Balanced" },
  ];

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-6">
      <div className="flex items-center gap-2 bg-[#111827]/50 p-1.5 rounded-full border border-gray-800/50 backdrop-blur-sm">
        <span className="px-3 text-sm text-gray-500 font-medium tracking-wide">\ud83d\udccd Zone</span>
        <div className="flex items-center gap-1">
          {zones.map((zone) => (
            <button
              key={zone}
              type="button"
              disabled={disabled}
              onClick={() => onZoneChange(zone)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                currentZone === zone
                  ? "bg-[#2568fb]/20 text-[#2568fb] shadow-[0_0_10px_rgba(37,104,251,0.2)]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 bg-[#111827]/50 p-1.5 rounded-full border border-gray-800/50 backdrop-blur-sm">
        <span className="px-3 text-sm text-gray-500 font-medium tracking-wide">Priority</span>
        <div className="flex items-center gap-1">
          {priorities.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={disabled}
              onClick={() => onPriorityChange(p.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                priority === p.id
                  ? "bg-[#2568fb]/20 text-[#2568fb] shadow-[0_0_10px_rgba(37,104,251,0.2)]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
