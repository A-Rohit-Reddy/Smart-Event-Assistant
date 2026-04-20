import React from "react";
import { AskResponse } from "../lib/api";

interface ResultPanelProps {
  result: AskResponse | null;
  error: string | null;
}

export default function ResultPanel({ result, error }: ResultPanelProps) {
  if (error) {
    return (
      <div className="mt-8 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center max-w-2xl mx-auto result-panel-enter backdrop-blur-sm">
        <p className="text-red-400 font-medium flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {error}
        </p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto bg-[#111827]/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 result-panel-enter shadow-[0_8px_30px_rgb(0,0,0,0.6)]">
      <div className="flex flex-col items-center text-center gap-5">
        <div className="bg-[#2568fb]/10 p-2.5 rounded-2xl mb-1">
          <svg className="w-6 h-6 text-[#2568fb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
          {result.recommendation}
        </h2>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-[#fecd45]/10 rounded-full border border-[#fecd45]/20 text-[#fecd45]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          <p className="text-sm md:text-base font-medium">
            {result.reason}
          </p>
        </div>

        {result.alternative && (
          <div className="mt-4 pt-6 border-t border-gray-800/80 w-full">
            <p className="text-sm text-gray-500 font-medium">
              <span className="text-gray-400 mr-2">Alternative options:</span> 
              {result.alternative}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
