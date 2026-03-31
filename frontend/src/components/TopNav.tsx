import { Database, Gauge, LogOut, MoonStar, Radar, Rocket, ShieldCheck, SunMedium } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "../lib/utils";
import { useAuth } from "../providers/AuthProvider";
import { useTheme } from "../providers/ThemeProvider";

const navItems = [
  { to: "/", label: "Neon Lobby", icon: Rocket },
  { to: "/studio", label: "Entity Forge", icon: Database },
  { to: "/reports", label: "Report Reactor", icon: Radar },
  { to: "/pulse", label: "Pulse Board", icon: Gauge }
];

function roleTone(role: "admin" | "manager" | "viewer"): string {
  if (role === "admin") {
    return "border-orange-300 bg-orange-100 text-orange-800";
  }

  if (role === "manager") {
    return "border-cyan-300 bg-cyan-100 text-cyan-900";
  }

  return "border-emerald-300 bg-emerald-100 text-emerald-900";
}

export function TopNav(): JSX.Element {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-heading text-xs font-black uppercase tracking-[0.3em] text-orange-500">Accommodation HyperDeck</p>
            <h1 className="font-heading text-xl font-black text-slate-900 md:text-2xl">Residence Command Universe</h1>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 shadow-mint transition hover:-translate-y-0.5"
            >
              {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              {isDark ? "Light" : "Dark"}
            </button>

            {user && (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-2 text-xs font-bold text-slate-700">
                <ShieldCheck className="h-4 w-4 text-cyan-700" />
                <span className={`rounded-full border px-2 py-0.5 uppercase tracking-[0.12em] ${roleTone(user.role)}`}>
                  {user.role}
                </span>
                <span className="hidden font-mono sm:inline">{user.full_name}</span>
              </div>
            )}

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-rose-100 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-rose-900 transition hover:-translate-y-0.5"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>

            <div className="rounded-full border border-white/80 bg-white/80 px-3 py-1 font-mono text-xs text-slate-700 shadow-mint">
              React + TS + Tailwind
            </div>
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
