import React, { FormEvent } from "react";

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  zone: string;
  setZone: (zone: string) => void;
}


export default function InputBar({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  zone,
  setZone,
}: InputBarProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit();
    }
  };

  const zones = ["South Gate", "North Gate", "VIP Lounge", "East Gate","Food Court A","Food Court B"];

  return (
    <div className="flex flex-col gap-4">

      {/* INPUT */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full max-w-2xl mx-auto group"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Where should I go for food right now?"
          disabled={isLoading}
          className="w-full bg-[#0a0f1c]/80 backdrop-blur-md border border-gray-800 text-white rounded-2xl py-5 pl-7 pr-36 focus:outline-none focus:border-[#2568fb] focus:ring-1 focus:ring-[#2568fb]/50 transition-all placeholder-gray-600 text-lg shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
        />

        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#fecd45] text-black font-semibold rounded-xl px-5 py-2.5 transition-all hover:bg-yellow-400 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? "Analyzing..." : "Analyze →"}
        </button>
      </form>

      {/* 🔥 CONTROLS */}
      <div className="flex flex-wrap justify-center gap-3 text-sm">

        {/* ZONE SELECTOR */}
        <div className="flex items-center gap-2 bg-[#0a0f1c]/70 border border-gray-800 rounded-full px-3 py-1.5">
          <span className="text-gray-400 text-xs">Zone</span>
          {zones.map((z) => (
            <button
              key={z}
              onClick={() => setZone(z)}
              className={`
                px-3 py-1 rounded-full transition-all
                ${zone === z
                  ? "bg-[#2568fb]/20 text-[#3b82f6]"
                  : "text-gray-400 hover:text-white"}
              `}
            >
              {z}
            </button>
          ))}
        </div>

      

      </div>
    </div>
  );
}
