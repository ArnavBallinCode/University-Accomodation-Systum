import { Database, Gauge, Radar, Rocket } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "../lib/utils";

const navItems = [
  { to: "/", label: "Neon Lobby", icon: Rocket },
  { to: "/studio", label: "Entity Forge", icon: Database },
  { to: "/reports", label: "Report Reactor", icon: Radar },
  { to: "/pulse", label: "Pulse Board", icon: Gauge }
];

export function TopNav(): JSX.Element {
  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-heading text-xs font-black uppercase tracking-[0.3em] text-orange-500">Accommodation HyperDeck</p>
            <h1 className="font-heading text-xl font-black text-slate-900 md:text-2xl">Residence Command Universe</h1>
          </div>
          <div className="rounded-full border border-white/80 bg-white/80 px-3 py-1 font-mono text-xs text-slate-700 shadow-mint">
            React + TS + Tailwind
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "group inline-flex items-center gap-2 rounded-full border px-3 py-2 font-heading text-xs font-bold uppercase tracking-[0.16em] transition",
                    isActive
                      ? "border-orange-300 bg-gradient-to-r from-orange-200/80 to-cyan-200/90 text-slate-900 shadow-glow"
                      : "border-slate-300/70 bg-white/60 text-slate-700 hover:border-orange-300 hover:text-slate-900"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
