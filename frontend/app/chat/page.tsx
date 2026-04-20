"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/SideBar";
import InputBar from "../../components/InputBar";
import ChatMessage, { MessageType } from "../../components/ChatMessage";
import { submitQuestion } from "../../lib/api";

/* ─── tiny icon helpers (inline SVGs to avoid extra deps) ─── */
const IconUsers = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 5.87v-2a4 4 0 00-3-3.87m6-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 11-6 0 3 3 0 016 0zM6 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconClock = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
  </svg>
);
const IconBolt = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const IconMapPin = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconTrending = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const IconShield = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

/* ─── right-panel data (would come from API in production) ─── */
const LIVE_STATS = [
  { label: "Current Crowd", value: "12,847", change: "+3.2%", icon: <IconUsers />, color: "text-blue-400" },
  { label: "Avg Wait Time", value: "8 min", change: "-12%", icon: <IconClock />, color: "text-emerald-400" },
  { label: "Active Alerts", value: "2", change: "Low", icon: <IconBolt />, color: "text-amber-400" },
];

const ZONE_STATUS = [
  { name: "South Gate", crowd: 78, status: "busy" },
  { name: "North Gate", crowd: 42, status: "moderate" },
  { name: "VIP Lounge", crowd: 23, status: "low" },
  { name: "East Gate", crowd: 61, status: "moderate" },
  { name: "Food Court A", crowd: 89, status: "busy" },
  { name: "Food Court B", crowd: 34, status: "low" },
];

const QUICK_PROMPTS = [
  "Fastest route to my seat?",
  "Best food stall right now?",
  "When is halftime?",
  "Nearest restroom with no line?",
  "Show crowd prediction for next 30 min",
  "Any safety alerts near me?",
];

const RECENT_ALERTS = [
  { text: "South Gate congestion rising — consider East Gate", time: "2m ago", severity: "warning" },
  { text: "Food Court A wait times above 15 min", time: "5m ago", severity: "info" },
  { text: "VIP Lounge reopened after cleaning", time: "12m ago", severity: "success" },
];

/* ─── helper: crowd bar color ─── */
function crowdColor(pct: number) {
  if (pct >= 75) return "bg-red-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-emerald-500";
}
function crowdBg(pct: number) {
  if (pct >= 75) return "bg-red-500/10";
  if (pct >= 50) return "bg-amber-500/10";
  return "bg-emerald-500/10";
}
function statusDot(status: string) {
  if (status === "busy") return "bg-red-400";
  if (status === "moderate") return "bg-amber-400";
  return "bg-emerald-400";
}
function severityStyle(s: string) {
  if (s === "warning") return "border-l-amber-500 bg-amber-500/5";
  if (s === "success") return "border-l-emerald-500 bg-emerald-500/5";
  return "border-l-blue-500 bg-blue-500/5";
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [zone, setZone] = useState("South Gate");
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* live clock */
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* greeting */
  useEffect(() => {
    const greeting: MessageType = {
      id: "system-greeting",
      role: "assistant",
      content: {
        recommendation: "System Online · Neural Assistant Ready",
        reason:
          "Live data stream connected. I can assist with crowd flow, food recommendations, navigation, and wait-time optimization in real time.",
        alternative: "Try: 'Find the least crowded food stall near me'",
      },
    };
    setMessages([greeting]);
  }, []);

  /* scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* submit */
  const handleAnalyze = async () => {
    if (!question.trim()) return;
    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);

    try {
      const response = await submitQuestion({
        question: userMessage.content,
        user_context: { current_zone: zone },
      });
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: response },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "error", content: err.message },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* quick prompt click */
  const handleQuickPrompt = (prompt: string) => {
    setQuestion(prompt);
  };

  return (
    <div className="flex h-screen bg-[#070a13] text-white overflow-hidden">
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* CENTER – CHAT */}
      <div className="flex flex-col flex-1 min-w-0 relative">
        {/* top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#070a13]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-white/50 font-mono tracking-wide">
              LIVE · {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* chat messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-3xl mr-[8%] mx-auto flex flex-col gap-6">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className="animate-[fadeInUp_0.4s_ease]"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ChatMessage message={msg} />
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 pl-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
                </div>
                <span className="text-xs text-white/30">Analyzing...</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* floating input */}
        <div className="sticky bottom-0 z-20 px-6 pb-6 pt-3 bg-gradient-to-t from-[#070a13] via-[#070a13]/80 to-transparent">
          <div className="max-w-3xl mr-[9%] mx-auto">
            <InputBar
              value={question}
              onChange={setQuestion}
              onSubmit={handleAnalyze}
              isLoading={isLoading}
              zone={zone}
              setZone={setZone}
            />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          RIGHT PANEL — Context & Live Intelligence
         ════════════════════════════════════════════ */}
      {rightPanelOpen && (
        <aside className="w-[340px] shrink-0 border-l border-white/5 bg-[#0b0f1a] overflow-y-auto hidden lg:flex flex-col">
          {/* ── Header ── */}
          <div className="px-5 pt-5 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <IconShield />
              <h2 className="text-sm font-semibold tracking-wide text-white/90">LIVE INTELLIGENCE</h2>
            </div>
            <p className="text-[11px] text-white/30">Real-time stadium analytics</p>
          </div>

          {/* ── Live Stats Cards ── */}
          <div className="px-5 py-4 space-y-3 border-b border-white/5">
            {LIVE_STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>{stat.icon}</div>
                  <div>
                    <p className="text-[11px] text-white/40 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-lg font-bold text-white/90 leading-tight">{stat.value}</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
            ))}
          </div>

          {/* ── Zone Heatmap ── */}
          <div className="px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <IconMapPin />
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Zone Status</h3>
            </div>
            <div className="space-y-2">
              {ZONE_STATUS.map((z) => (
                <div
                  key={z.name}
                  className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition
                    ${zone === z.name ? "bg-blue-500/10 border border-blue-500/30" : "hover:bg-white/[0.03] border border-transparent"}`}
                  onClick={() => setZone(z.name)}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${statusDot(z.status)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white/70 truncate">{z.name}</span>
                      <span className="text-[10px] text-white/40">{z.crowd}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${crowdColor(z.crowd)}`}
                        style={{ width: `${z.crowd}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent Alerts ── */}
          <div className="px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <IconBolt />
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Recent Alerts</h3>
            </div>
            <div className="space-y-2">
              {RECENT_ALERTS.map((alert, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border-l-2 ${severityStyle(alert.severity)} transition hover:translate-x-0.5`}
                >
                  <p className="text-xs text-white/70 leading-relaxed">{alert.text}</p>
                  <p className="text-[10px] text-white/30 mt-1">{alert.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Quick Prompts ── */}
          <div className="px-5 py-4 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <IconTrending />
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Quick Prompts</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-white/10
                             text-white/50 hover:text-white/90 hover:border-blue-500/40 hover:bg-blue-500/10
                             transition-all duration-200 active:scale-95"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="px-5 py-3 border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-white/30 font-mono">DATA STREAM ACTIVE</span>
              </div>
              <span className="text-[10px] text-white/20 font-mono">v2.4.1</span>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}