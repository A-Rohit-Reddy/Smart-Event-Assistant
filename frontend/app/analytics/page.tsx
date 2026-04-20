"use client";

import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Navigation,
  Search,
  Bell,
  UserCircle2,
  Coffee,
  Utensils,
  ShoppingBag,
  Users,
  Sparkles,
  ArrowRight,
  Heart,
  Zap,
  CheckCircle2,
  AlertCircle,
  Timer,
  Star,
  Filter,
} from "lucide-react";

type Trend = "increasing" | "decreasing" | "steady";
type Status = "low" | "moderate" | "high" | "critical";
type Category = "food" | "drinks" | "restroom" | "merch" | "entry";

interface Amenity {
  id: string;
  name: string;
  category: Category;
  location: string;
  waitMin: number;
  forecast15: number;
  forecast30: number;
  forecast60: number;
  trend: Trend;
  status: Status;
  distance: string;
  rating: number;
  tags: string[];
  isFavorite?: boolean;
}

const amenities: Amenity[] = [
  {
    id: "a1",
    name: "Prime Grid Burgers",
    category: "food",
    location: "Level 1 · Gate H",
    waitMin: 18,
    forecast15: 22,
    forecast30: 15,
    forecast60: 9,
    trend: "increasing",
    status: "high",
    distance: "120m",
    rating: 4.6,
    tags: ["Burgers", "Fries"],
    isFavorite: true,
  },
  {
    id: "a2",
    name: "Velocity Taps",
    category: "drinks",
    location: "Level 2 · North Bar",
    waitMin: 4,
    forecast15: 3,
    forecast30: 5,
    forecast60: 8,
    trend: "decreasing",
    status: "low",
    distance: "80m",
    rating: 4.3,
    tags: ["Beer", "Cocktails"],
  },
  {
    id: "a3",
    name: "Fan Gear Collective",
    category: "merch",
    location: "Level 1 · Central Hub",
    waitMin: 9,
    forecast15: 9,
    forecast30: 10,
    forecast60: 12,
    trend: "steady",
    status: "moderate",
    distance: "200m",
    rating: 4.7,
    tags: ["Jerseys", "Souvenirs"],
  },
  {
    id: "a4",
    name: "Restroom B-N1",
    category: "restroom",
    location: "Level 1 · North Wing",
    waitMin: 12,
    forecast15: 14,
    forecast30: 8,
    forecast60: 5,
    trend: "increasing",
    status: "critical",
    distance: "45m",
    rating: 4.0,
    tags: ["Sanitation"],
  },
  {
    id: "a5",
    name: "Taco District",
    category: "food",
    location: "Level 2 · East Food Court",
    waitMin: 6,
    forecast15: 7,
    forecast30: 9,
    forecast60: 11,
    trend: "steady",
    status: "low",
    distance: "160m",
    rating: 4.8,
    tags: ["Mexican", "Vegan opts"],
    isFavorite: true,
  },
  {
    id: "a6",
    name: "Brew Lab Coffee",
    category: "drinks",
    location: "Level 1 · West Concourse",
    waitMin: 2,
    forecast15: 2,
    forecast30: 3,
    forecast60: 4,
    trend: "steady",
    status: "low",
    distance: "220m",
    rating: 4.9,
    tags: ["Coffee", "Pastries"],
  },
];

const categoryConfig: Record<
  Category,
  { label: string; icon: React.ReactNode; color: string }
> = {
  food: {
    label: "Food",
    icon: <Utensils className="w-3.5 h-3.5" />,
    color: "text-orange-400",
  },
  drinks: {
    label: "Drinks",
    icon: <Coffee className="w-3.5 h-3.5" />,
    color: "text-blue-400",
  },
  restroom: {
    label: "Restroom",
    icon: <Users className="w-3.5 h-3.5" />,
    color: "text-purple-400",
  },
  merch: {
    label: "Merch",
    icon: <ShoppingBag className="w-3.5 h-3.5" />,
    color: "text-pink-400",
  },
  entry: {
    label: "Entry",
    icon: <Navigation className="w-3.5 h-3.5" />,
    color: "text-green-400",
  },
};

const statusConfig: Record<
  Status,
  { bg: string; text: string; label: string; bar: string }
> = {
  low: {
    bg: "bg-green-500/15",
    text: "text-green-400",
    label: "No wait",
    bar: "bg-green-500",
  },
  moderate: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
    label: "Short wait",
    bar: "bg-yellow-500",
  },
  high: {
    bg: "bg-orange-500/15",
    text: "text-orange-400",
    label: "Busy",
    bar: "bg-orange-500",
  },
  critical: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    label: "Very busy",
    bar: "bg-red-500",
  },
};

const trendIcon = (t: Trend) => {
  if (t === "increasing")
    return <TrendingUp className="w-3 h-3 text-red-400" />;
  if (t === "decreasing")
    return <TrendingDown className="w-3 h-3 text-green-400" />;
  return <Minus className="w-3 h-3 text-slate-400" />;
};

const trendLabel = (t: Trend) => {
  if (t === "increasing") return "Rising";
  if (t === "decreasing") return "Dropping";
  return "Steady";
};

export default function PredictiveWaitTimesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"wait" | "distance" | "rating">("wait");
  const [search, setSearch] = useState("");

  const filtered = amenities
    .filter(
      (a) =>
        (selectedCategory === "all" || a.category === selectedCategory) &&
        (a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.tags.some((t) =>
            t.toLowerCase().includes(search.toLowerCase())
          ))
    )
    .sort((a, b) => {
      if (sortBy === "wait") return a.waitMin - b.waitMin;
      if (sortBy === "rating") return b.rating - a.rating;
      return parseInt(a.distance) - parseInt(b.distance);
    });

  const quickest = [...amenities].sort((a, b) => a.waitMin - b.waitMin)[0];

  return (
    <div className="flex min-h-screen bg-[#0b1220] text-white">
      <SideBar />

      <div className="flex-1 pl-64">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800/60 bg-[#0b1220]/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] tracking-[0.2em] text-slate-400">
              FAN EXPERIENCE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find food, drinks, restrooms..."
                className="bg-slate-800/50 border border-slate-700/60 rounded-lg text-xs pl-8 pr-3 py-1.5 w-64 focus:outline-none focus:border-yellow-500/40 transition"
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
              <h1 className="text-3xl font-bold tracking-tight">
                Wait Times & Smart Picks
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Skip the lines. See live & predicted waits for everything around you.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-800/50 border border-slate-700/60 rounded-lg p-1">
                {(
                  [
                    { id: "wait", label: "Wait" },
                    { id: "distance", label: "Distance" },
                    { id: "rating", label: "Rating" },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded transition ${
                      sortBy === s.id
                        ? "bg-yellow-500 text-black"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition">
                <Filter className="w-3.5 h-3.5" />
                Filters
              </button>
            </div>
          </div>

          {/* Hero: Quickest Pick */}
          <div className="relative bg-gradient-to-br from-yellow-500/20 via-slate-800/40 to-slate-800/30 border border-yellow-500/30 rounded-xl p-5 mb-5 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-yellow-500/20 blur-3xl" />
            <div className="relative flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
                  <Zap className="w-7 h-7 text-yellow-400" />
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.2em] text-yellow-400 mb-1">
                    YOUR BEST BET RIGHT NOW
                  </div>
                  <h3 className="text-xl font-bold">{quickest.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {quickest.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      {quickest.distance} away
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {quickest.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-center">
                  <div className="text-[10px] text-slate-400 tracking-widest">
                    WAIT
                  </div>
                  <div className="text-3xl font-bold text-green-400">
                    {quickest.waitMin}m
                  </div>
                </div>
                <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-semibold px-4 py-2.5 rounded-lg transition">
                  <Navigation className="w-4 h-4" />
                  Navigate
                </button>
              </div>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 tracking-widest">
                  AVG WAIT
                </span>
                <Clock className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="text-2xl font-bold mt-1">8.3m</div>
              <div className="flex items-center gap-1 text-[10px] text-green-400 mt-0.5">
                <TrendingDown className="w-3 h-3" />
                -2m vs 15m ago
              </div>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 tracking-widest">
                  QUICKEST NOW
                </span>
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold mt-1 text-green-400">2m</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Brew Lab Coffee
              </div>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 tracking-widest">
                  AVOID NOW
                </span>
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              </div>
              <div className="text-2xl font-bold mt-1 text-red-400">18m</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Prime Grid Burgers
              </div>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 tracking-widest">
                  NEXT GOOD TIME
                </span>
                <Timer className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold mt-1">20:35</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                After Quarter 2
              </div>
            </div>
          </div>

          {/* Category chips */}
          <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition flex-shrink-0 ${
                selectedCategory === "all"
                  ? "bg-yellow-500 text-black border-yellow-500"
                  : "bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-600"
              }`}
            >
              All
            </button>
            {(Object.keys(categoryConfig) as Category[]).map((c) => {
              const cfg = categoryConfig[c];
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition flex-shrink-0 ${
                    selectedCategory === c
                      ? "bg-yellow-500 text-black border-yellow-500"
                      : "bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  {cfg.icon}
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-5">
            {/* Left: Amenity cards */}
            <section className="col-span-12 xl:col-span-8 space-y-3">
              {filtered.map((a) => {
                const cat = categoryConfig[a.category];
                const st = statusConfig[a.status];
                return (
                  <div
                    key={a.id}
                    className="group bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 transition"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-lg bg-slate-900/60 border border-slate-700/60 flex items-center justify-center flex-shrink-0 ${cat.color}`}
                      >
                        {cat.icon}
                      </div>

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sm">{a.name}</h3>
                              {a.isFavorite && (
                                <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {a.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Navigation className="w-3 h-3" />
                                {a.distance}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                {a.rating}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-2">
                              {a.tags.map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] text-slate-400 bg-slate-900/60 border border-slate-700/60 rounded px-1.5 py-0.5"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Wait block */}
                          <div className="text-right flex-shrink-0">
                            <div
                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${st.bg} ${st.text} mb-1`}
                            >
                              {st.label}
                            </div>
                            <div className="flex items-baseline gap-1 justify-end">
                              <span className="text-2xl font-bold">
                                {a.waitMin}
                              </span>
                              <span className="text-xs text-slate-400">min</span>
                            </div>
                            <div className="flex items-center gap-1 justify-end text-[10px] text-slate-400 mt-0.5">
                              {trendIcon(a.trend)}
                              {trendLabel(a.trend)}
                            </div>
                          </div>
                        </div>

                        {/* Forecast bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                            <span>Predicted wait</span>
                            <span>Next 60 min</span>
                          </div>
                          <div className="flex items-end gap-1 h-10">
                            {[
                              { label: "Now", val: a.waitMin },
                              { label: "15m", val: a.forecast15 },
                              { label: "30m", val: a.forecast30 },
                              { label: "60m", val: a.forecast60 },
                            ].map((f, i) => {
                              const max = Math.max(
                                a.waitMin,
                                a.forecast15,
                                a.forecast30,
                                a.forecast60
                              );
                              const h = (f.val / max) * 100;
                              const color =
                                f.val <= 5
                                  ? "bg-green-500"
                                  : f.val <= 12
                                  ? "bg-yellow-500"
                                  : f.val <= 18
                                  ? "bg-orange-500"
                                  : "bg-red-500";
                              return (
                                <div
                                  key={i}
                                  className="flex-1 flex flex-col items-center gap-1"
                                >
                                  <div className="w-full h-full flex items-end">
                                    <div
                                      className={`w-full ${color} rounded-sm opacity-80`}
                                      style={{ height: `${h}%` }}
                                    />
                                  </div>
                                  <div className="text-[9px] text-slate-500">
                                    {f.label} · {f.val}m
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          <button className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-[11px] font-semibold px-3 py-1.5 rounded-md transition">
                            <Navigation className="w-3 h-3" />
                            Navigate
                          </button>
                          <button className="flex items-center gap-1.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 text-[11px] font-medium px-3 py-1.5 rounded-md transition">
                            <Bell className="w-3 h-3" />
                            Notify when low
                          </button>
                          <button className="flex items-center gap-1.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 text-[11px] font-medium px-3 py-1.5 rounded-md transition">
                            <Heart
                              className={`w-3 h-3 ${
                                a.isFavorite ? "text-red-400 fill-red-400" : ""
                              }`}
                            />
                            {a.isFavorite ? "Saved" : "Save"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Nothing matches your search.
                </div>
              )}
            </section>

            {/* Right Panel */}
            <aside className="col-span-12 xl:col-span-4 space-y-4">
              {/* AI Suggestion */}
              <div className="bg-gradient-to-br from-blue-500/10 to-slate-800/30 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] tracking-[0.2em] text-blue-400">
                    SMART SUGGESTION
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Based on your past orders, try{" "}
                  <span className="font-semibold text-white">Taco District</span>{" "}
                  — only a{" "}
                  <span className="font-semibold text-green-400">6 min wait</span>{" "}
                  and matches your food preferences.
                </p>
                <button className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition">
                  Take me there
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Best time to go */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-sm flex items-center gap-1.5 mb-3">
                  <Timer className="w-4 h-4 text-green-400" />
                  Best Times to Go
                </h4>
                <div className="space-y-2">
                  {[
                    { time: "Now – 20:10", label: "Pre-match rush", level: "busy" },
                    {
                      time: "20:35 – 20:50",
                      label: "Quarter 2 break",
                      level: "good",
                    },
                    { time: "21:15 – 21:30", label: "Halftime", level: "peak" },
                    {
                      time: "21:50 – 22:10",
                      label: "Third quarter",
                      level: "best",
                    },
                  ].map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-slate-900/40 rounded-md px-3 py-2"
                    >
                      <div>
                        <div className="text-xs font-medium">{t.time}</div>
                        <div className="text-[10px] text-slate-400">
                          {t.label}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.level === "best"
                            ? "bg-green-500/20 text-green-400"
                            : t.level === "good"
                            ? "bg-blue-500/20 text-blue-400"
                            : t.level === "busy"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {t.level.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearest essentials */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-sm flex items-center gap-1.5 mb-3">
                  <MapPin className="w-4 h-4 text-yellow-400" />
                  Nearest Essentials
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      icon: <Users className="w-3.5 h-3.5 text-purple-400" />,
                      name: "Restroom",
                      dist: "45m",
                      wait: "12m",
                      status: "critical",
                    },
                    {
                      icon: <Coffee className="w-3.5 h-3.5 text-blue-400" />,
                      name: "Water Station",
                      dist: "60m",
                      wait: "1m",
                      status: "low",
                    },
                    {
                      icon: (
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                      ),
                      name: "First Aid",
                      dist: "90m",
                      wait: "0m",
                      status: "low",
                    },
                  ].map((e, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-slate-900/40 rounded-md px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        {e.icon}
                        <div>
                          <div className="text-xs font-medium">{e.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {e.dist} away
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-bold ${
                            statusConfig[e.status as Status].text
                          }`}
                        >
                          {e.wait}
                        </div>
                        <div className="text-[9px] text-slate-500">wait</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your plan */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Your Plan
                  </h4>
                  <span className="text-[10px] text-slate-400">2 items</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-slate-900/40 rounded-md p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Taco District</span>
                      <span className="text-[10px] text-green-400">6m wait</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Planned for 20:35
                    </div>
                  </div>
                  <div className="bg-slate-900/40 rounded-md p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Fan Gear</span>
                      <span className="text-[10px] text-yellow-400">9m wait</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Planned for 21:50
                    </div>
                  </div>
                </div>
                <button className="w-full mt-3 bg-yellow-500 hover:bg-yellow-400 text-black text-[11px] font-semibold rounded-md py-2 transition">
                  Optimize My Route
                </button>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}