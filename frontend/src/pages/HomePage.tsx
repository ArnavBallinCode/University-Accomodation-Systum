import { motion } from "framer-motion";
import { ArrowRight, Sparkles, WandSparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { MetricCard } from "../components/MetricCard";
import { useToast } from "../components/ToastProvider";
import { apiGet } from "../lib/api";

interface HeroMetric {
  label: string;
  value: string;
  helper: string;
  accent: string;
}

const countModules = [
  { label: "Students", endpoint: "/api/students", accent: "from-orange-300 to-yellow-300" },
  { label: "Staff", endpoint: "/api/staff", accent: "from-cyan-300 to-teal-300" },
  { label: "Rooms", endpoint: "/api/rooms", accent: "from-amber-300 to-orange-300" },
  { label: "Leases", endpoint: "/api/leases", accent: "from-lime-300 to-emerald-300" }
];

export function HomePage(): JSX.Element {
  const [metrics, setMetrics] = useState<HeroMetric[]>([]);
  const { pushToast } = useToast();

  useEffect(() => {
    let mounted = true;

    const loadSnapshot = async (): Promise<void> => {
      try {
        const values = await Promise.all(
          countModules.map(async (module) => {
            const rows = await apiGet<unknown[]>(module.endpoint);
            return {
              label: module.label,
              value: String(rows.length),
              helper: `${module.label.toLowerCase()} records synced`,
              accent: module.accent
            } satisfies HeroMetric;
          })
        );

        if (mounted) {
          setMetrics(values);
        }
      } catch {
        if (mounted) {
          pushToast({
            tone: "error",
            title: "Snapshot fetch failed",
            description: "Backend is not reachable yet. Start FastAPI and refresh this page."
          });
        }
      }
    };

    void loadSnapshot();
    return () => {
      mounted = false;
    };
  }, [pushToast]);

  return (
    <div className="space-y-8 pb-8">
      <section className="glass-panel relative overflow-hidden p-6 md:p-10">
        <div className="absolute -right-10 top-5 h-36 w-36 animate-pulse-ring rounded-full border border-orange-300/70" />
        <div className="absolute -bottom-10 left-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,#00b8a94d_0%,#00b8a900_70%)]" />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-orange-300/80 bg-orange-100 px-4 py-2 font-heading text-xs font-black uppercase tracking-[0.18em] text-orange-700"
        >
          <Sparkles className="h-4 w-4" />
          Hyperactive Residence Control Room
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-5 max-w-4xl font-heading text-4xl font-black leading-tight text-slate-900 md:text-6xl"
        >
          Blast through accommodation ops with a multi-page, animation-heavy command universe.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700 md:text-lg"
        >
          This UI is now React + TypeScript + Tailwind, purpose-built for rapid CRUD workflows, report execution,
          and live operational insight across halls, apartments, invoices, inspections, and everything in between.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link
            to="/studio"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-heading text-xs font-black uppercase tracking-[0.16em] text-white shadow-glow transition hover:-translate-y-0.5"
          >
            Open Entity Forge
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/reports"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-100 px-5 py-3 font-heading text-xs font-black uppercase tracking-[0.16em] text-cyan-900 shadow-mint transition hover:-translate-y-0.5"
          >
            Launch Report Reactor
            <WandSparkles className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            helper={metric.helper}
            accent={metric.accent}
            index={index}
          />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Entity Forge",
            text: "Create, edit, and delete any module with dynamic form generation.",
            accent: "from-orange-200 to-rose-200"
          },
          {
            title: "Report Reactor",
            text: "Run all assignment reports (a-n) from one parameterized control panel.",
            accent: "from-cyan-200 to-sky-200"
          },
          {
            title: "Pulse Board",
            text: "Track live totals and rent signals in an animated operations dashboard.",
            accent: "from-lime-200 to-teal-200"
          }
        ].map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + index * 0.08 }}
            className="glass-panel overflow-hidden p-4"
          >
            <div className={`mb-3 h-2 rounded-full bg-gradient-to-r ${item.accent}`} />
            <h3 className="font-heading text-xl font-black text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
          </motion.article>
        ))}
      </section>
    </div>
  );
}
