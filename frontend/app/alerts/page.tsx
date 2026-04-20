"use client";

import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import {
  AlertTriangle,
  Sparkles,
  Zap,
  UserCircle2,
  Clock,
  MapPin,
  Bell,
  Search,
  Filter,
  Plus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

type Severity = "CRITICAL" | "WARNING" | "INFO";

interface Alert {
  id: number;
  title: string;
  description: string;
  severity: Severity;
  time: string;
  location: string;
  icon: React.ReactNode;
  accentColor: string;
}

const alerts: Alert[] = [
  {
    id: 1,
    title: "Congestion at North Gate",
    description:
      "Flow rate dropped below 15 people/min. Unauthorized queue spillover detected in Sector 2-A bypass lane.",
    severity: "CRITICAL",
    time: "2 mins ago",
    location: "North Entry Plaza",
    icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
    accentColor: "bg-red-500",
  },
  {
    id: 2,
    title: "Restroom 4-B cleaning in progress",
    description:
      "Scheduled maintenance. Sanitation crew #12 dispatched. Re-opening estimated in 8 minutes.",
    severity: "INFO",
    time: "5 mins ago",
    location: "Concourse Level 2",
    icon: <Sparkles className="w-4 h-4 text-blue-400" />,
    accentColor: "bg-blue-500",
  },
  {
    id: 3,
    title: "Power Fluctuation: Section G",
    description:
      "Minor voltage drop detected in beverage cooling units. UPS active. Maintenance notified for breaker check.",
    severity: "WARNING",
    time: "12 mins ago",
    location: "Electrical Room 03",
    icon: <Zap className="w-4 h-4 text-yellow-400" />,
    accentColor: "bg-yellow-500",
  },
  {
    id: 4,
    title: "VIP Arrival: Suite 204",
    description:
      "Guest manifest confirmed. Hospitality staff notified for beverage service.",
    severity: "INFO",
    time: "24 mins ago",
    location: "Suite Level",
    icon: <UserCircle2 className="w-4 h-4 text-blue-400" />,
    accentColor: "bg-blue-500",
  },
  {
    id: 5,
    title: "Unusual Crowd Density: Gate B",
    description:
      "Density threshold exceeded. Real-time analytics show 92% capacity with rising trend.",
    severity: "WARNING",
    time: "31 mins ago",
    location: "Gate B Entrance",
    icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
    accentColor: "bg-yellow-500",
  },
];

const severityBadge = (severity: Severity) => {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-500/15 text-red-400 border border-red-500/30";
    case "WARNING":
      return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
    case "INFO":
      return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
  }
};

export default function LiveAlertsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | Severity>("ALL");

  const filteredAlerts = alerts.filter((a) => {
    const matchesFilter = filter === "ALL" || a.severity === filter;
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#0b1220] text-white">
      <SideBar />

      {/* Main wrapper — left padding avoids sidebar overlap */}
      <div className="flex-1 pl-64">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800/60 bg-[#0b1220]/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] tracking-[0.2em] text-slate-400">
              SYSTEM MONITORING
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search alerts..."
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
        <main className="px-6 py-5 grid grid-cols-12 gap-5">
          {/* Left / Main */}
          <section className="col-span-12 xl:col-span-8">
            {/* Page heading */}
            <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Live Alerts
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time system notifications and incident monitoring
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/60 rounded-lg p-1">
                  {(["ALL", "CRITICAL", "WARNING", "INFO"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded transition ${
                        filter === f
                          ? "bg-yellow-500 text-black"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition">
                  <Filter className="w-3.5 h-3.5" />
                  Filters
                </button>
              </div>
            </div>

            {/* Alerts list */}
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="group relative flex gap-3 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 pl-5 transition cursor-pointer overflow-hidden"
                >
                  <span
                    className={`absolute left-0 top-0 bottom-0 w-1 ${alert.accentColor}`}
                  />
                  <div className="w-8 h-8 rounded-md bg-slate-900/60 flex items-center justify-center flex-shrink-0">
                    {alert.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-sm">{alert.title}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider flex-shrink-0 ${severityBadge(
                          alert.severity
                        )}`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2.5 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </span>
                      {alert.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {alert.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredAlerts.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No alerts match your filters.
                </div>
              )}
            </div>
          </section>

          {/* Right Panel */}
          <aside className="col-span-12 xl:col-span-4 space-y-4">
            {/* Heatmap */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.2em] text-slate-400">
                  HEATMAP VIEW
                </span>
                <span className="flex items-center gap-1 text-[10px] text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  LIVE
                </span>
              </div>

              <div className="relative aspect-square rounded-md bg-slate-950/70 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-4 rounded-full bg-yellow-500/40 blur-2xl" />
                <div className="absolute inset-8 rounded-full bg-orange-500/40 blur-xl" />
                <div className="absolute inset-6 rounded-full border border-yellow-500/20" />
                <div className="absolute inset-12 rounded-full border border-yellow-500/15" />
                <div className="absolute inset-20 rounded-full border border-yellow-500/10" />
                <div className="relative w-4 h-4 rounded-full bg-red-500 shadow-[0_0_25px_8px_rgba(239,68,68,0.6)]" />
              </div>

              <div className="mt-2 text-[10px] text-slate-400 tracking-wider">
                SECTOR 2-A CONGESTION
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
                <div className="text-[10px] text-slate-400 tracking-widest">
                  RESOLVED
                </div>
                <div className="text-2xl font-bold mt-1">142</div>
                <div className="flex items-center gap-1 text-[10px] text-green-400 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% vs last hour
                </div>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
                <div className="text-[10px] text-slate-400 tracking-widest">
                  AVG RESPONSE
                </div>
                <div className="text-2xl font-bold mt-1">3.4m</div>
                <div className="flex items-center gap-1 text-[10px] text-red-400 mt-1">
                  <TrendingDown className="w-3 h-3" />
                  -5% efficiency
                </div>
              </div>
            </div>

            {/* Intelligence Summary */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-3">
                Intelligence Summary
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="leading-relaxed">
                    AI predicts{" "}
                    <span className="font-semibold text-white">
                      peak congestion
                    </span>{" "}
                    at South Gate in 15 minutes.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="w-3.5 h-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="leading-relaxed">
                    Recommending{" "}
                    <span className="font-semibold text-white">
                      staff reallocation
                    </span>{" "}
                    from East Concourse.
                  </p>
                </div>
              </div>
              <button className="mt-4 w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 rounded-md py-2 text-[10px] font-semibold tracking-widest transition">
                VIEW DETAILED INSIGHT
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="text-xs bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 rounded-md py-2 transition">
                  Dispatch Team
                </button>
                <button className="text-xs bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 rounded-md py-2 transition">
                  Broadcast
                </button>
                <button className="text-xs bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 rounded-md py-2 transition">
                  Escalate
                </button>
                <button className="text-xs bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 rounded-md py-2 transition">
                  Archive
                </button>
              </div>
            </div>
          </aside>
        </main>

        {/* Floating Action Button */}
        <button className="fixed bottom-6 right-6 w-12 h-12 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center shadow-lg shadow-yellow-500/20 transition">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}