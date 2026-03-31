import { motion } from "framer-motion";
import { LockKeyhole, MoonStar, Rocket, ShieldCheck, SunMedium, UserCircle2 } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AnimatedBackdrop } from "../components/AnimatedBackdrop";
import { useAuth, type UserRole } from "../providers/AuthProvider";
import { useTheme } from "../providers/ThemeProvider";

interface DemoAccount {
  username: string;
  password: string;
  role: UserRole;
  note: string;
}

const demoAccounts: DemoAccount[] = [
  {
    username: "admin",
    password: "Admin@123",
    role: "admin",
    note: "Full control: create, update, delete, and all reports."
  },
  {
    username: "manager",
    password: "Manager@123",
    role: "manager",
    note: "Operational writes: create and update records, no deletes."
  },
  {
    username: "viewer",
    password: "Viewer@123",
    role: "viewer",
    note: "Read-only mode for reporting and dashboards."
  }
];

function roleTone(role: UserRole): string {
  if (role === "admin") {
    return "border-orange-300 bg-orange-100 text-orange-800";
  }

  if (role === "manager") {
    return "border-cyan-300 bg-cyan-100 text-cyan-900";
  }

  return "border-emerald-300 bg-emerald-100 text-emerald-900";
}

export function LoginPage(): JSX.Element {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = useMemo(() => {
    const state = location.state as { from?: string } | null;
    if (state?.from && state.from.startsWith("/")) {
      return state.from;
    }
    return "/";
  }, [location.state]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setErrorMessage("Enter both username and password.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await login(cleanUsername, password);
      navigate(destination, { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 md:px-8 md:py-10">
      <AnimatedBackdrop />

      <div className="relative z-10 mx-auto flex max-w-6xl justify-end">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-200"
        >
          {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          {isDark ? "Light mode" : "Dark mode"}
        </button>
      </div>

      <div className="relative z-10 mx-auto mt-4 grid max-w-6xl gap-6 pb-10 lg:grid-cols-[1fr_1.1fr]">
        <motion.section
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-panel p-6 md:p-8"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-100 px-3 py-1 font-heading text-xs font-black uppercase tracking-[0.17em] text-orange-800">
            <Rocket className="h-4 w-4" />
            Residence Command Universe
          </p>
          <h1 className="mt-4 font-heading text-4xl font-black leading-tight text-slate-900 md:text-5xl">
            Product-grade housing operations control.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-700 md:text-base">
            Multi-role access is now live. Sign in as admin, manager, or viewer to experience role-specific controls
            across CRUD, reports, and real-time pulse boards.
          </p>

          <div className="mt-5 space-y-3">
            {demoAccounts.map((account, index) => (
              <motion.button
                key={account.username}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.06 }}
                onClick={() => {
                  setUsername(account.username);
                  setPassword(account.password);
                }}
                className="w-full rounded-2xl border border-white/80 bg-white/75 p-4 text-left transition hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-heading text-lg font-black text-slate-900">{account.username}</p>
                  <span className={`rounded-full border px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] ${roleTone(account.role)}`}>
                    {account.role}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Password: {account.password}</p>
                <p className="mt-2 text-sm text-slate-700">{account.note}</p>
              </motion.button>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="glass-panel p-6 md:p-8"
        >
          <div className="mb-5">
            <p className="font-heading text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Secure access portal</p>
            <h2 className="mt-2 font-heading text-3xl font-black text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm text-slate-600">Authenticate to unlock your role-based command surface.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-[0.13em] text-slate-500">Username</span>
              <div className="relative">
                <UserCircle2 className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full rounded-2xl border border-white/80 bg-white/85 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none ring-cyan-300 transition focus:ring"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-[0.13em] text-slate-500">Password</span>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-white/80 bg-white/85 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none ring-cyan-300 transition focus:ring"
                />
              </div>
            </label>

            {errorMessage && (
              <p className="rounded-xl border border-rose-300 bg-rose-100 px-3 py-2 text-sm text-rose-800">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 font-heading text-xs font-black uppercase tracking-[0.15em] text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShieldCheck className="h-4 w-4" />
              {submitting ? "Authenticating..." : "Enter command center"}
            </button>
          </form>
        </motion.section>
      </div>
    </div>
  );
}
