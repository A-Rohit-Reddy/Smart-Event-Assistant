"use client";

import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import {
  Navigation,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  Bell,
  Search,
  UserCircle2,
  Route,
  Footprints,
  Accessibility,
  Car,
  Star,
  ChevronRight,
  Compass,
  Zap,
  TrendingUp,
  Coffee,
  Utensils,
  ShoppingBag,
  Trophy,
  DoorOpen,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  Locate,
} from "lucide-react";

type Density = "LOW" | "MEDIUM" | "HIGH";
type RouteMode = "FASTEST" | "SCENIC" | "ACCESSIBLE";

interface Destination {
  id: number;
  name: string;
  category: string;
  icon: React.ReactNode;
  distance: string;
  eta: string;
  density: Density;
  accent: string;
}

const destinations: Destination[] = [
  {
    id: 1,
    name: "Gate A — Main Entrance",
    category: "Entry / Exit",
    icon: <DoorOpen className="w-4 h-4 text-blue-400" />,
    distance: "120m",
    eta: "2 min",
    density: "MEDIUM",
    accent: "bg-blue-500",
  },
  {
    id: 2,
    name: "Food Court — Level 2",
    category: "Dining",
    icon: <Utensils className="w-4 h-4 text-yellow-400" />,
    distance: "340m",
    eta: "5 min",
    density: "HIGH",
    accent: "bg-yellow-500",
  },
  {
    id: 3,
    name: "Merchandise Store",
    category: "Retail",
    icon: <ShoppingBag className="w-4 h-4 text-pink-400" />,
    distance: "210m",
    eta: "3 min",
    density: "LOW",
    accent: "bg-pink-500",
  },
  {
    id: 4,
    name: "Section 104 — Your Seat",
    category: "Seating",
    icon: <Trophy className="w-4 h-4 text-green-400" />,
    distance: "90m",
    eta: "1 min",
    density: "LOW",
    accent: "bg-green-500",
  },
  {
    id: 5,
    name: "Coffee Kiosk — Concourse",
    category: "Dining",
    icon: <Coffee className="w-4 h-4 text-orange-400" />,
    distance: "150m",
    eta: "2 min",
    density: "MEDIUM",
    accent: "bg-orange-500",
  },
];

const densityBadge = (d: Density) => {
  switch (d) {
    case "LOW":
      return "bg-green-500/15 text-green-400 border border-green-500/30";
    case "MEDIUM":
      return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
    case "HIGH":
      return "bg-red-500/15 text-red-400 border border-red-500/30";
  }
};

export default function ParticipantNavigationPage() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<RouteMode>("FASTEST");
  const [selected, setSelected] = useState<number>(4);

  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedDest = destinations.find((d) => d.id === selected);

  return (
    <div className="flex min-h-screen bg-[#0b1220] text-white">
      <SideBar />

      <div className="flex-1 pl-64">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800/60 bg-[#0b1220]/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] tracking-[0.2em] text-slate-400">
              NAVIGATION ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destinations..."
                className="bg-slate-800/50 border border-slate-700/60 rounded-lg text-xs pl-8 pr-3 py-1.5 w-56 focus:outline-none focus:border-yellow-500/40 transition"
              />
            </div>
            <button className="p-1.5 rounded-lg hover:bg-slate-800 transition relative">
              <Bell className="w-4 h-4 text-slate-300" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-500 rounded-full" />
            </button>
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center">
              <UserCircle2 className="w-5 h-5 text-slate-300" />
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="px-6 py-5 grid grid-cols-12 gap-5">
          {/* Left — Destinations */}
          <section className="col-span-12 xl:col-span-4">
            <div className="mb-5">
              <h1 className="text-3xl font-bold tracking-tight">
                Route Planner
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Navigate the venue smartly — avoid crowds, reach on time
              </p>
            </div>

            {/* Mode selector */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3 mb-4">
              <div className="text-[10px] tracking-[0.2em] text-slate-400 mb-2">
                ROUTE PREFERENCE
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "FASTEST" as RouteMode, icon: <Zap className="w-3.5 h-3.5" />, label: "Fastest" },
                  { id: "SCENIC" as RouteMode, icon: <Footprints className="w-3.5 h-3.5" />, label: "Scenic" },
                  { id: "ACCESSIBLE" as RouteMode, icon: <Accessibility className="w-3.5 h-3.5" />, label: "Accessible" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex flex-col items-center gap-1 py-2 rounded-md text-[11px] font-medium transition ${
                      mode === m.id
                        ? "bg-yellow-500 text-black"
                        : "bg-slate-900/60 border border-slate-700/60 text-slate-300 hover:text-white"
                    }`}
                  >
                    {m.icon}
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Current location */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-lg p-3 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-yellow-500/20 flex items-center justify-center">
                <Locate className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-slate-400 tracking-widest">
                  CURRENT LOCATION
                </div>
                <div className="text-sm font-semibold">Concourse B — Entry Plaza</div>
              </div>
            </div>

            {/* Destinations */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-300 tracking-wider">
                DESTINATIONS ({filtered.length})
              </h3>
              <button className="text-[10px] text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
                <Star className="w-3 h-3" /> Saved
              </button>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filtered.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => setSelected(dest.id)}
                  className={`group w-full text-left relative flex gap-3 border rounded-lg p-3 pl-4 transition overflow-hidden ${
                    selected === dest.id
                      ? "bg-slate-800/60 border-yellow-500/40"
                      : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50"
                  }`}
                >
                  <span
                    className={`absolute left-0 top-0 bottom-0 w-1 ${dest.accent}`}
                  />
                  <div className="w-8 h-8 rounded-md bg-slate-900/60 flex items-center justify-center flex-shrink-0">
                    {dest.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {dest.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {dest.category}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider flex-shrink-0 ${densityBadge(
                          dest.density
                        )}`}
                      >
                        {dest.density}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Route className="w-3 h-3" />
                        {dest.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {dest.eta}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 self-center transition ${
                      selected === dest.id
                        ? "text-yellow-400"
                        : "text-slate-600 group-hover:text-slate-400"
                    }`}
                  />
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No destinations found.
                </div>
              )}
            </div>
          </section>

          {/* Center — Map */}
          <section className="col-span-12 xl:col-span-5">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-semibold tracking-wider">
                    VENUE MAP — LIVE
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500" /> Low
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" /> Med
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> High
                  </span>
                </div>
              </div>

              <div className="relative aspect-[4/3] bg-slate-950/70">
                {/* Dashed boundary */}
                <div className="absolute inset-4 border-2 border-dashed border-slate-700/60 rounded-2xl" />

                {/* Grid pattern */}
                <div
                  className="absolute inset-4 opacity-[0.08] rounded-2xl"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />

                {/* Density heat zones */}
                <div className="absolute top-[18%] right-[20%] w-28 h-28 rounded-full bg-red-500/25 blur-2xl" />
                <div className="absolute bottom-[25%] left-[18%] w-24 h-24 rounded-full bg-yellow-500/25 blur-2xl" />

                {/* Route path */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                  <defs>
                    <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 110 180 Q 160 140 200 150 T 290 90"
                    stroke="url(#routeGrad)"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    fill="none"
                    className="animate-pulse"
                  />
                </svg>

                {/* High density marker */}
                <div className="absolute top-[15%] right-[18%]">
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-2 py-1.5 flex flex-col items-center gap-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-[9px] font-bold text-red-400 tracking-wider">
                      HIGH DENSITY
                    </span>
                  </div>
                </div>

                {/* Exit blocked */}
                <div className="absolute bottom-[30%] left-[18%]">
                  <div className="bg-slate-900/80 border border-red-500/40 rounded-md px-2 py-1">
                    <span className="text-[9px] font-bold text-red-400 tracking-wider">
                      EXIT BLOCKED
                    </span>
                  </div>
                </div>

                {/* Destination pin */}
                <div className="absolute top-[25%] right-[25%]">
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-yellow-500 animate-ping absolute" />
                    <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center relative shadow-lg shadow-yellow-500/50">
                      <MapPin className="w-3.5 h-3.5 text-black" />
                    </div>
                  </div>
                </div>

                {/* User marker */}
                <div className="absolute bottom-[38%] left-[26%]">
                  <div className="relative flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_20px_6px_rgba(59,130,246,0.5)] border-2 border-white" />
                    <span className="mt-1 text-[9px] bg-slate-900 px-1.5 py-0.5 rounded font-bold tracking-wider">
                      YOU
                    </span>
                  </div>
                </div>

                {/* Zoom controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-1">
                  <button className="w-8 h-8 rounded-md bg-slate-900/80 border border-slate-700/60 flex items-center justify-center hover:bg-slate-800 transition">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-md bg-slate-900/80 border border-slate-700/60 flex items-center justify-center hover:bg-slate-800 transition">
                    <Minus className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-md bg-slate-900/80 border border-slate-700/60 flex items-center justify-center hover:bg-slate-800 transition">
                    <Locate className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Turn-by-turn */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-yellow-400" />
                  Turn-by-Turn Directions
                </h4>
                <span className="text-[10px] text-slate-400 tracking-wider">
                  {selectedDest?.eta} · {selectedDest?.distance}
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { step: 1, text: "Head east along Concourse B", dist: "40m" },
                  { step: 2, text: "Turn right at the info kiosk", dist: "25m" },
                  { step: 3, text: "Take stairs up to Level 2", dist: "15m" },
                  { step: 4, text: `Arrive at ${selectedDest?.name}`, dist: "—" },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="flex items-center gap-3 text-xs bg-slate-900/40 rounded-md p-2.5"
                  >
                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-[11px] font-bold text-yellow-400">
                      {s.step}
                    </div>
                    <p className="flex-1 text-slate-200">{s.text}</p>
                    <span className="text-[10px] text-slate-500 tracking-wider">
                      {s.dist}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right Panel */}
          <aside className="col-span-12 xl:col-span-3 space-y-4">
            {/* ETA card */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/30 rounded-lg p-4">
              <div className="text-[10px] tracking-[0.2em] text-yellow-400 mb-1">
                ESTIMATED ARRIVAL
              </div>
              <div className="text-3xl font-bold">
                {selectedDest?.eta ?? "—"}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                to {selectedDest?.name ?? "destination"}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-green-400 mt-2">
                <TrendingUp className="w-3 h-3" />
                32% faster than usual
              </div>
            </div>

            {/* Nearby amenities */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-3">Along Your Route</h4>
              <div className="space-y-2">
                {[
                  { icon: <Coffee className="w-3.5 h-3.5 text-orange-400" />, name: "Coffee Kiosk", dist: "50m" },
                  { icon: <Users className="w-3.5 h-3.5 text-blue-400" />, name: "Restroom 3-A", dist: "90m" },
                  { icon: <ShoppingBag className="w-3.5 h-3.5 text-pink-400" />, name: "Merch Store", dist: "140m" },
                ].map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-xs bg-slate-900/40 rounded-md px-2.5 py-2"
                  >
                    <div className="w-6 h-6 rounded bg-slate-900/60 flex items-center justify-center">
                      {a.icon}
                    </div>
                    <span className="flex-1">{a.name}</span>
                    <span className="text-[10px] text-slate-500">{a.dist}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI suggestion */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Smart Suggestion
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gate B will reach{" "}
                <span className="font-semibold text-white">peak density</span>{" "}
                in 12 minutes. We rerouted you via{" "}
                <span className="font-semibold text-yellow-400">Concourse B</span>{" "}
                to save 4 minutes.
              </p>
              <button className="mt-3 w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 rounded-md py-2 text-[10px] font-semibold tracking-widest transition flex items-center justify-center gap-1.5">
                ACCEPT REROUTE
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Travel modes */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-3">Travel Options</h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="text-xs bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 rounded-md py-2 transition flex items-center justify-center gap-1.5">
                  <Footprints className="w-3.5 h-3.5" /> Walk
                </button>
                <button className="text-xs bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 rounded-md py-2 transition flex items-center justify-center gap-1.5">
                  <Car className="w-3.5 h-3.5" /> Shuttle
                </button>
              </div>
            </div>
          </aside>
        </main>

        {/* Floating recalculate */}
        <button className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-400 text-black flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg shadow-yellow-500/20 transition font-semibold text-sm">
          <Route className="w-4 h-4" />
          RECALCULATE PATH
        </button>
      </div>
    </div>
  );
}