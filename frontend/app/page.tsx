"use client";

import React, { useState, useRef, useEffect } from "react";
import InputBar from "../components/InputBar";
import ContextChips from "../components/ContextChips";
import ChatMessage, { MessageType } from "../components/ChatMessage";
import { submitQuestion } from "../lib/api";
import Sidebar from "../components/SideBar";
import { useRouter } from "next/navigation";  

export default function Home() {  
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [currentZone, setCurrentZone] = useState("South Gate");
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState("balanced");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasInteracted = messages.length > 0;

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    if (hasInteracted) {
      scrollToBottom();
    }
  }, [messages, hasInteracted]);

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
        user_context: {
          current_zone: currentZone,
          priority,
        },
      });

      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: "error",
        content: err.message || "An unexpected error occurred while analyzing.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={`flex flex-col text-white font-sans selection:bg-[#2568fb]/30 ${hasInteracted ? 'min-h-screen bg-[#070a13]' : 'min-h-screen py-8 md:py-16 px-4'}`}>
      <Sidebar />
      {/* Background embellishments for Hero Mode */}
      {!hasInteracted && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-[#2568fb]/10 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-full max-w-md h-[400px] bg-[#fecd45]/5 blur-[120px] rounded-full pointer-events-none" />
        </>
      )}

      {/* Top Header - Fixed and Minimal in Chat Mode */}
      <header className={`w-full flex justify-between items-center z-40 transition-all ${
        hasInteracted 
          ? 'p-4 border-b border-gray-800/40 bg-[#070a13]/80 backdrop-blur-xl sticky top-0' 
          : 'max-w-7xl mx-auto mb-16 relative'
      }`}>
        <div className="flex items-center gap-3 group cursor-default max-w-[800px] mx-auto w-full px-2 md:px-6">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-[#2568fb] to-blue-900 border border-blue-500/20 flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-semibold text-base md:text-lg tracking-wide text-white drop-shadow-md">
            Smart Stadium
          </span>
          <span className="ml-2 px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-500/10 border border-red-500/20 text-red-500 uppercase tracking-widest flex items-center gap-1.5 max-sm:hidden">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            LIVE
          </span>
          
          <div className="ml-auto flex items-center gap-2.5 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full bg-[#111827]/80 border border-gray-800 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs md:text-sm font-medium text-gray-300 tracking-wide">42,180 <span className="hidden sm:inline">spectators</span></span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full relative z-10 mt-4 md:mt-12">
          <div className="text-center mb-12 flex flex-col items-center">
            <div className="px-5 py-1.5 rounded-full bg-[#111827]/80 backdrop-blur-md border border-gray-700/50 mb-8 inline-flex items-center shadow-lg">
              <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-gray-300">
                Real-time Decision Engine
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
              Stadium <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fecd45] to-[#fff3c4] drop-shadow-[0_0_20px_rgba(254,205,69,0.25)]">Intelligence</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl text-center leading-relaxed font-light">
              Crowd analysis and smart routing powered by live data.
            </p>
            <div className="flex justify-center items-center w-full mt-12">
              {/* Button here */}
              <button
                onClick={() => {
                  if (loading) return;
                  setLoading(true);
                  setTimeout(() => {
                    router.push(`/chat`);
                  }, 1000);
                }}
                className="
                  group relative overflow-hidden rounded-2xl px-8 py-3.5
                  font-semibold text-sm tracking-wide text-black
                  bg-gradient-to-r from-[#fecd45] via-[#ffd86b] to-[#ffe89a]
                  border border-[#fff1b0]/60
                  shadow-[0_8px_30px_rgba(254,205,69,0.28),inset_0_1px_0_rgba(255,255,255,0.35)]
                  transition-all duration-300 ease-out
                  hover:-translate-y-0.5 hover:scale-[1.03]
                  hover:shadow-[0_0_22px_rgba(254,205,69,0.35),0_0_55px_rgba(254,205,69,0.28),inset_0_1px_0_rgba(255,255,255,0.45)]
                  hover:border-[#fecd45]/60
                  active:scale-[0.97]
                  focus:ring-2 focus:ring-[#fecd45]/70
                "
              >
                {/* ambient glow */}
                <span
                  className="
                    absolute inset-0 -z-10 rounded-2xl
                    bg-[#fecd45]/30 blur-2xl opacity-0
                    transition-all duration-500
                    group-hover:opacity-100 group-hover:scale-110
                  "
                />

                {/* moving glow sweep */}
                <span
                  className="
                    absolute inset-0 rounded-2xl overflow-hidden
                  "
                >
                  <span
                    className="
                      absolute -left-1/2 top-0 h-full w-1/2
                      bg-gradient-to-r from-transparent via-white/35 to-transparent
                      skew-x-[-20deg]
                      translate-x-[-120%]
                      group-hover:translate-x-[280%]
                      transition-transform duration-700 ease-out
                    "
                  />
                </span>

                {/* subtle top highlight */}
                <span
                  className="
                    absolute inset-0 rounded-2xl
                    bg-gradient-to-b from-white/35 via-transparent to-transparent
                    opacity-40 pointer-events-none
                  "
                />

                {/* text */}
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="3" opacity="0.2"/>
                        <path d="M22 12a10 10 0 0 1-10 10" stroke="black" strokeWidth="3"/>
                      </svg>
                      Initializing…
                    </>
                  ) : (
                    <>
                      Engage Neural Assistant
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          

          <div className="mt-auto pt-16 pb-4 text-center relative z-10 opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-default">
            <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 text-[10px] md:text-xs font-semibold text-gray-400 tracking-[0.2em] uppercase">
              <span className="hover:text-white transition-colors">Crowd Heatmaps</span>
              <span className="text-gray-700">&bull;</span>
              <span className="hover:text-white transition-colors">Smart Navigation</span>
              <span className="text-gray-700">&bull;</span>
              <span className="hover:text-white transition-colors">Live Alerts</span>
              <span className="text-gray-700">&bull;</span>
              <span className="hover:text-white transition-colors">Predictive Wait</span>
            </div>
          </div>
        </div>
    </main>
  );
}
