import React from "react";
import { AskResponse } from "../lib/api";

export type MessageType = 
  | { id: string; role: "user"; content: string }
  | { id: string; role: "assistant"; content: AskResponse }
  | { id: string; role: "error"; content: string };

function parseReason(reasonText: string) {
  // Try to split "5 min wait \u00b7 low congestion \u00b7 optimal route"
  if (reasonText.includes("\u00b7")) {
    const parts = reasonText.split("\u00b7").map(p => p.trim());
    return {
      blocks: parts.slice(0, 2), // Take first two as blocks (e.g. wait time, density)
      text: parts.slice(2).join(" \u00b7 ") || "" // the rest as reason text or empty
    };
  }
  // Otherwise, default to one big text
  return { blocks: [], text: reasonText };
}

export default function ChatMessage({ message }: { message: MessageType }) {
  if (message.role === "error") {
    return (
      <div className="flex justify-center w-full mb-6">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm max-w-lg text-center backdrop-blur-sm">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end w-full mb-6 result-panel-enter">
        <div className="bg-[#2568fb] text-white px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[80%] md:max-w-[70%] shadow-lg text-base">
          {message.content}
        </div>
      </div>
    );
  }

  // Assistant message
  const result = message.content;
  const { blocks, text } = parseReason(result.reason);

  return (
    <div className="flex justify-start w-full mb-6 animate-[fadeIn_0.3s_ease] md:mb-8 result-panel-enter">
      <div className="flex flex-col gap-3 w-full max-w-xl">
        <div className="w-8 h-8 rounded-full bg-[#111827] border border-gray-700 flex items-center justify-center flex-shrink-0 shadow-sm mb-1">
          <svg className="w-4 h-4 text-[#fecd45]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
            Recommendation
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
            {result.recommendation}
          </h3>
          
          {blocks.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blocks.map((block, idx) => (
                <div key={idx} className="bg-[#2568fb]/10 border border-[#2568fb]/20 text-blue-300 px-3 py-1.5 rounded-md text-xs font-semibold">
                  {block}
                </div>
              ))}
            </div>
          )}

          <div className="text-gray-300 text-sm leading-relaxed">
            {text ? text : result.reason}
          </div>

          {result.alternative && (
            <div className="mt-4 pt-4 border-t border-gray-800/60">
              <span className="text-xs text-gray-500 block mb-1">Alternative Option</span>
              <p className="text-sm text-gray-400">{result.alternative}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
