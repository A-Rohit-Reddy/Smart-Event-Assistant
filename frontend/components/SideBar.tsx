"use client";

import { useState } from "react";
import { usePathname} from "next/navigation"
import { BarChart3, Compass, Sparkles, Users, Bell, Settings, HelpCircle, LogOut } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
  { name: "Wait Times Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Smart Navigation", href: "/navigation", icon: Compass },
  { name: "AI Companion", href: "/chat", icon: Sparkles },
  { name: "Crowd Heatmaps", href: "/heatmaps", icon: Users },
  { name: "Live Alerts", href: "/alerts", icon: Bell },
];

  return (
    <>
      {/* Hover trigger zone */}
      <div
        className="fixed left-0 top-0 h-full w-4 z-40"
        onMouseEnter={() => setOpen(true)}
      />

      {/* Sidebar */}
      <div
        onMouseLeave={() => setOpen(false)}
        className={`fixed top-0 left-0 h-full w-68 z-50 transition-all duration-500 ease-[cubic-bezier(0.25, 0.8, 0.25, 1)]
          ${open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-80"}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c] via-[#070a13] to-black opacity-90" />
        <div className="absolute inset-0 bg-[#070a13]/90 backdrop-blur-xl border-white/5 border-r shadow-[0_0_40px_rgba(0,0,0,0.6)]"/>
        <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#2568fb]/40 to-transparent"/>
        <div className="relative z-10 flex flex-col h-full px-5 py-6">
          <div className="mb-6 ml-3">
            <h1 className = "text-[#fecd45] text-xm tracking-widest font-bold">
              STADIUM INTELLIGENCE
            </h1>
            <p className="text-gray-400 text-xm mt-1">
              Vantage Point . North Sector
            </p>
          </div>

          <nav className="flex flex-col gap-1 mt-2">

            {links.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`
                    relative flex items-center gap-3 px-4 py-2.5 rounded-md text-sm
                    transition-all duration-300
                    ${active
                      ? "bg-[#0f1b34] text-[#3b82f6]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"}
                  `}
                >
                  {/* LEFT ACTIVE BAR */}
                  {active && (
                    <span className="absolute left-0 top-0 h-full w-[3px] bg-[#fecd45] rounded-r" />
                  )}

                  {/* ICON */}
                  <span className={`
                    text-base
                    ${active ? "text-[#3b82f6]" : "text-gray-500 group-hover:text-white"}
                  `}>
                    <Icon size={18}/>
                  </span>

                  {/* TEXT */}
                  <span className="font-medium tracking-wide">
                    {link.name}
                  </span>
                </a>
              );
            })}

          </nav>

          
          <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-1">

            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-gray-500
                        hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <HelpCircle size={18} className="text-gray-500 group-hover:text-white" />
              <span className="tracking-wide">Help</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-gray-500
                        hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
            >
              <LogOut size={18} className="text-gray-500 group-hover:text-red-400" />
              <span className="tracking-wide">Logout</span>
            </a>

          </div>
        </div>
      </div>
    </>
  );
}
