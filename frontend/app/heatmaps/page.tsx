"use client";

import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import {
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MapPin,
  Clock,
  Bell,
  Search,
  UserCircle2,
  Activity,
  Layers,
  Maximize2,
  Wind,
  Navigation,
  Eye,
  Zap,
} from "lucide-react";

type DensityLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

interface Zone {
  id: string;
  name: string;
  current: number;
  capacity: number;
  trend: "up" | "down" | "stable";
  trendValue: string;
  level: DensityLevel;
  x: number; // position on map (%)
  y: number;
  size: number; // radius in px
}

const zones: Zone[] = [
  {
    id: "z1",
    name: "North Gate",
    current: 4820,
    capacity: 5000,
    trend: "up",
    trendValue: "+8%",
    level: "CRITICAL",
    x: 50,
    y: 12,
    size: 90,
  },
  {
    id: "z2",
    name: "South Gate",
    current: 2100,
    capacity: 5000,
    trend: "up",
    trendValue: "+3%",
    level: "MODERATE",
    x: 50,
    y: 88,
    size: 65,
  },
  {
    id: "z3",
    name: "East Concourse",
    current: 3400,
    capacity: 4000,
    trend: "down",
    trendValue: "-2%",
    level: "HIGH",
    x: 82,
    y: 45,
    size: 75,
  },
  {
    id: "z4",
    name: "West Concourse",
    current: 980,
    capacity: 4000,
    trend: "down",
    trendValue: "-12%",
    level: "LOW",
    x: 18,
    y: 45,
    size: 55,
  },
  {
    id: "z5",
    name: "Food Court A",
    current: 1750,
    capacity: 2000,
    trend: "up",
    trendValue: "+15%",
    level: "HIGH",
    x: 35,
    y: 35,
    size: 60,
  },
  {
    id: "z6",
    name: "Food Court B",
    current: 640,
    capacity: 2000,
    trend: "stable",
    trendValue: "0%",
    level: "LOW",
    x: 65,
    y: 65,
    size: 50,
  },
  {
    id: "z7",
    name: "Main Arena",
    current: 18500,
    capacity: 20000,
    trend: "up",
    trendValue: "+1%",
    level: "HIGH",
    x: 50,
    y: 50,
    size: 110,
  },
];

const levelConfig: Record<
  DensityLevel,
  { color: string; bg: string; text: string; glow: string }
> = {
  LOW: {
    color: "bg-green-500",
    bg: "bg-green-500/15",
    text: "text-green-400",
    glow: "rgba(34,197,94,0.5)",
  },
  MODERATE: {
    color: "bg-yellow-500",
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
    glow: "rgba(234,179,8,0.5)",
  },
  HIGH: {
    color: "bg-orange-500",
    bg: "bg-orange-500/15",
    text: "text-orange-400",
    glow: "rgba(249,115,22,0.6)",
  },
  CRITICAL: {
    color: "bg-red-500",
    bg: "bg-red-500/15",
    text: "text-red-400",
    glow: "rgba(239,68,68,0.7)",
  },
};

const recommendations = [
  {
    icon: <Navigation className="w-3.5 h-3.5 text-green-400" />,
    title: "Redirect to West Concourse",
    desc: "Only 24% full. Signage update recommended.",
    priority: "high",
  },
  {
    icon: <Wind className="w-3.5 h-3.5 text-blue-400" />,
    title: "Open Gate 7 overflow",
    desc: "Ease North Gate pressure by ~30%.",
    priority: "critical",
  },
  {
    icon: <Users className="w-3.5 h-3.5 text-yellow-400" />,
    title: "Deploy staff to Food Court A",
    desc: "Surge detected. 3 additional staff suggested.",
    priority: "medium",
  },
];

export default function HeatmapsPage() {
  const [view, setView] = useState<"density" | "flow" | "predictive">("density");
  const [timeframe, setTimeframe] = useState<"LIVE" | "1H" | "24H">("LIVE");
  const [selectedZone, setSelectedZone] = useState<Zone | null>(zones[0]);

  const totalAttendance = zones.reduce((sum, z) => sum + z.current, 0);
  const totalCapacity = zones.reduce((sum, z) => sum + z.capacity, 0);
  const avgDensity = Math.round((totalAttendance / totalCapacity) * 100);

  return (
    <div className="flex min-h-screen bg-[#0b1220] text-white">
      <SideBar />

      <div className="flex-1 pl-64">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800/60 bg-[#0b1220]/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] tracking-[0.2em] text-slate-400">
              CROWD INTELLIGENCE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                placeholder="Search zones..."
                className="bg-slate-800/50 border border-slate-700/60 rounded-lg text-xs pl-8 pr-3 py-1.5 w-56 focus:outline-none focus:border-yellow-500/40 transition"
              />
            </div>
            <button className="p-1.5 rounded-lg hover:bg-slate-800 transition relative">
              <Bell className="w-4 h-4 text-slate-300" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center">
              <UserCircle2 className="w-5 h-5 text-slate-300" />
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="px-6 py-5">
          {/* Page heading */}
          <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Crowd Heatmaps</h1>
              <p className="text-xs text-slate-400 mt-1">
                Live density mapping, flow analytics & predictive crowd distribution
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Timeframe */}
              <div className="flex items-center gap-1 bg-slate-800/50 border border-slate-700/60 rounded-lg p-1">
                {(["LIVE", "1H", "24H"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded transition ${
                      timeframe === t
                        ? "bg-yellow-500 text-black"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition">
                <Layers className="w-3.5 h-3.5" />
                Layers
              </button>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 tracking-widest">
                  TOTAL ATTENDANCE
                </span>
                <Users className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="text-2xl font-bold mt-1">
                {totalAttendance.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-green-400 mt-0.5">
                <TrendingUp className="w-3 h-3" />
                +342 in last 5m
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 tracking-widest">
                  AVG DENSITY
                </span>
                <Activity className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="text-2xl font-bold mt-1">{avgDensity}%</div>
              <div className="mt-1.5 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                  style={{ width: `${avgDensity}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 tracking-widest">
                  HOTSPOTS
                </span>
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              </div>
              <div className="text-2xl font-bold mt-1 text-red-400">
                {zones.filter((z) => z.level === "CRITICAL").length}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {zones.filter((z) => z.level === "HIGH").length} high-density zones
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 tracking-widest">
                  FLOW RATE
                </span>
                <Wind className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="text-2xl font-bold mt-1">68/min</div>
              <div className="flex items-center gap-1 text-[10px] text-red-400 mt-0.5">
                <TrendingDown className="w-3 h-3" />
                -12% last hour
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-5">
            {/* Heatmap Visualization */}
            <section className="col-span-12 xl:col-span-8">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg overflow-hidden">
                {/* Controls */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
                  <div className="flex items-center gap-1 bg-slate-900/60 rounded-md p-1">
                    {(
                      [
                        { id: "density", label: "Density", icon: Activity },
                        { id: "flow", label: "Flow", icon: Wind },
                        { id: "predictive", label: "Predictive", icon: Eye },
                      ] as const
                    ).map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setView(v.id)}
                        className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded transition ${
                          view === v.id
                            ? "bg-slate-700 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <v.icon className="w-3 h-3" />
                        {v.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] text-red-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      LIVE
                    </span>
                    <button className="p-1 rounded hover:bg-slate-700/50 transition">
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Map Canvas */}
                <div className="relative aspect-[16/10] bg-slate-950/70 overflow-hidden">
                  {/* Grid background */}
                  <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Stadium outline */}
                  <div className="absolute inset-[12%] border-2 border-slate-700/60 rounded-[50%]" />
                  <div className="absolute inset-[22%] border border-slate-700/40 rounded-[50%]" />
                  <div className="absolute inset-[35%] border border-slate-700/30 rounded-[50%]" />

                  {/* Zone field label */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] tracking-[0.3em] text-slate-600 pointer-events-none">
                    FIELD
                  </div>

                  {/* Zones */}
                  {zones.map((zone) => {
                    const cfg = levelConfig[zone.level];
                    const isSelected = selectedZone?.id === zone.id;
                    return (
                      <button
                        key={zone.id}
                        onClick={() => setSelectedZone(zone)}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group"
                        style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                      >
                        {/* Glow */}
                        <div
                          className="absolute rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                          style={{
                            width: zone.size * 1.8,
                            height: zone.size * 1.8,
                            backgroundColor: cfg.glow,
                          }}
                        />
                        {/* Core */}
                        <div
                          className={`relative rounded-full ${cfg.color} opacity-80 transition-all ${
                            isSelected ? "ring-2 ring-white scale-110" : ""
                          }`}
                          style={{
                            width: zone.size * 0.5,
                            height: zone.size * 0.5,
                          }}
                        />
                        {/* Label */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-medium text-white/90 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700/60 opacity-0 group-hover:opacity-100 transition">
                          {zone.name}
                        </div>
                      </button>
                    );
                  })}

                  {/* Legend */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-700/60 rounded-md px-3 py-2 text-[10px]">
                    <div className="text-slate-400 tracking-widest mb-1.5">
                      DENSITY SCALE
                    </div>
                    <div className="flex items-center gap-2">
                      {(["LOW", "MODERATE", "HIGH", "CRITICAL"] as const).map(
                        (lv) => (
                          <div key={lv} className="flex items-center gap-1">
                            <span
                              className={`w-2 h-2 rounded-full ${levelConfig[lv].color}`}
                            />
                            <span className="text-slate-300">{lv}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Compass */}
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full border border-slate-700/60 bg-slate-900/80 flex items-center justify-center text-[10px] text-slate-400">
                    <span className="absolute top-0.5">N</span>
                    <Navigation className="w-3 h-3 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Zone list under map */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {zones.map((zone) => {
                  const cfg = levelConfig[zone.level];
                  const pct = Math.round((zone.current / zone.capacity) * 100);
                  const isSelected = selectedZone?.id === zone.id;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`text-left bg-slate-800/30 hover:bg-slate-800/60 border rounded-lg p-3 transition ${
                        isSelected
                          ? "border-yellow-500/50"
                          : "border-slate-700/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{zone.name}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text}`}
                        >
                          {zone.level}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-1.5">
                        <span className="text-lg font-bold">
                          {zone.current.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          / {zone.capacity.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${cfg.color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1.5 text-[10px]">
                        <span className="text-slate-400">{pct}% full</span>
                        <span
                          className={`flex items-center gap-0.5 ${
                            zone.trend === "up"
                              ? "text-red-400"
                              : zone.trend === "down"
                              ? "text-green-400"
                              : "text-slate-400"
                          }`}
                        >
                          {zone.trend === "up" ? (
                            <TrendingUp className="w-2.5 h-2.5" />
                          ) : zone.trend === "down" ? (
                            <TrendingDown className="w-2.5 h-2.5" />
                          ) : null}
                          {zone.trendValue}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Right Panel */}
            <aside className="col-span-12 xl:col-span-4 space-y-4">
              {/* Selected Zone Detail */}
              {selectedZone && (
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] tracking-[0.2em] text-slate-400">
                      ZONE DETAILS
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        levelConfig[selectedZone.level].bg
                      } ${levelConfig[selectedZone.level].text}`}
                    >
                      {selectedZone.level}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-yellow-500" />
                    {selectedZone.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-slate-900/60 rounded-md p-2">
                      <div className="text-[9px] text-slate-400 tracking-widest">
                        OCCUPANCY
                      </div>
                      <div className="text-lg font-bold mt-0.5">
                        {Math.round(
                          (selectedZone.current / selectedZone.capacity) * 100
                        )}
                        %
                      </div>
                    </div>
                    <div className="bg-slate-900/60 rounded-md p-2">
                      <div className="text-[9px] text-slate-400 tracking-widest">
                        PEOPLE
                      </div>
                      <div className="text-lg font-bold mt-0.5">
                        {selectedZone.current.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-slate-900/60 rounded-md p-2">
                      <div className="text-[9px] text-slate-400 tracking-widest">
                        CAPACITY
                      </div>
                      <div className="text-lg font-bold mt-0.5">
                        {selectedZone.capacity.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-slate-900/60 rounded-md p-2">
                      <div className="text-[9px] text-slate-400 tracking-widest">
                        TREND
                      </div>
                      <div
                        className={`text-lg font-bold mt-0.5 ${
                          selectedZone.trend === "up"
                            ? "text-red-400"
                            : selectedZone.trend === "down"
                            ? "text-green-400"
                            : ""
                        }`}
                      >
                        {selectedZone.trendValue}
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-3 bg-yellow-500 hover:bg-yellow-400 text-black text-[11px] font-semibold rounded-md py-2 transition">
                    View Zone Analytics
                  </button>
                </div>
              )}

              {/* Least Crowded Zones */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-green-400" />
                    Least Crowded
                  </h4>
                  <span className="text-[10px] text-slate-400">Recommend</span>
                </div>
                <div className="space-y-2">
                  {[...zones]
                    .sort(
                      (a, b) =>
                        a.current / a.capacity - b.current / b.capacity
                    )
                    .slice(0, 3)
                    .map((z) => {
                      const pct = Math.round((z.current / z.capacity) * 100);
                      return (
                        <div
                          key={z.id}
                          className="flex items-center justify-between bg-slate-900/40 rounded-md px-3 py-2"
                        >
                          <div>
                            <div className="text-xs font-medium">{z.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {z.current.toLocaleString()} people
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-400">
                              {pct}%
                            </div>
                            <div className="text-[9px] text-slate-500">full</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    AI Recommendations
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {recommendations.length} active
                  </span>
                </div>
                <div className="space-y-2.5">
                  {recommendations.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 bg-slate-900/40 rounded-md p-2.5"
                    >
                      <div className="mt-0.5">{r.icon}</div>
                      <div className="flex-1">
                        <div className="text-xs font-medium">{r.title}</div>
                        <div className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                          {r.desc}
                        </div>
                      </div>
                      <button className="text-[9px] font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded px-1.5 py-1 transition">
                        APPLY
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Timeline */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-sm flex items-center gap-1.5 mb-3">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Recent Events
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex gap-2 text-slate-400">
                    <span className="text-slate-500 min-w-[40px]">2m</span>
                    <span>North Gate surged past 95%</span>
                  </div>
                  <div className="flex gap-2 text-slate-400">
                    <span className="text-slate-500 min-w-[40px]">8m</span>
                    <span>West Concourse dropped below 25%</span>
                  </div>
                  <div className="flex gap-2 text-slate-400">
                    <span className="text-slate-500 min-w-[40px]">14m</span>
                    <span>Food Court A hit peak density</span>
                  </div>
                  <div className="flex gap-2 text-slate-400">
                    <span className="text-slate-500 min-w-[40px]">22m</span>
                    <span>Main Arena reached 92% capacity</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}