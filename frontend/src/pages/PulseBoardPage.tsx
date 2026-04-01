import { motion } from "framer-motion";
import { Activity, Flame, Waves } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useToast } from "../components/ToastProvider";
import { apiGet } from "../lib/api";
import type { DataRow } from "../types";

interface PulseMetric {
  label: string;
  value: number;
  accent: string;
}

const sources = [
  { label: "Students", endpoint: "/api/students", accent: "from-orange-300 to-yellow-300" },
  { label: "Halls", endpoint: "/api/halls", accent: "from-cyan-300 to-blue-300" },
  { label: "Apartments", endpoint: "/api/apartments", accent: "from-lime-300 to-teal-300" },
  { label: "Rooms", endpoint: "/api/rooms", accent: "from-amber-300 to-orange-300" },
  { label: "Leases", endpoint: "/api/leases", accent: "from-fuchsia-300 to-rose-300" },
  { label: "Invoices", endpoint: "/api/invoices", accent: "from-sky-300 to-cyan-300" }
];

export function PulseBoardPage(): JSX.Element {
  const [metrics, setMetrics] = useState<PulseMetric[]>([]);
  const [rentStats, setRentStats] = useState<DataRow | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<DataRow[]>([]);
  const [occupancyData, setOccupancyData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { pushToast } = useToast();

  useEffect(() => {
    let mounted = true;

    const loadPulse = async (): Promise<void> => {
      try {
        const [counts, rent, categories, occupancy] = await Promise.all([
          Promise.all(
            sources.map(async (source) => {
              const rows = await apiGet<unknown[]>(source.endpoint);
              return {
                label: source.label,
                value: rows.length,
                accent: source.accent
              } satisfies PulseMetric;
            })
          ),
          apiGet<DataRow>("/api/reports/rent-stats"),
          apiGet<DataRow[]>("/api/reports/student-category-counts"),
          apiGet<DataRow[]>("/api/reports/hall-place-counts")
        ]);

        if (mounted) {
          setMetrics(counts);
          setRentStats(rent);
          setCategoryCounts(categories);
          setOccupancyData(occupancy);
        }
      } catch {
        if (mounted) {
          pushToast({
            tone: "error",
            title: "Pulse board offline",
            description: "Could not load metrics. Ensure backend and database are running."
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadPulse();

    return () => {
      mounted = false;
    };
  }, [pushToast]);

  const maxValue = useMemo(() => {
    if (metrics.length === 0) {
      return 1;
    }
    return Math.max(...metrics.map((metric) => metric.value), 1);
  }, [metrics]);

  const totalRecords = metrics.reduce((sum, metric) => sum + metric.value, 0);

  return (
    <div className="space-y-6 pb-8">
      <section className="glass-panel overflow-hidden p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-heading text-xs font-black uppercase tracking-[0.2em] text-cyan-700">Live Pulse Matrix</p>
            <h2 className="mt-2 font-heading text-3xl font-black text-slate-900 md:text-4xl">Operational heatmap across all core modules</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
              These metrics are fetched directly from the API in real time, giving you a live record-flow signal for accommodation operations.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-300 bg-cyan-100 px-4 py-3 text-right shadow-mint">
            <p className="font-heading text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Total live records</p>
            <p className="font-heading text-4xl font-black text-slate-900">{loading ? "..." : totalRecords}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric, index) => {
          const pct = Math.max(6, Math.round((metric.value / maxValue) * 100));

          return (
            <motion.article
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="glass-panel p-4"
            >
              <div className={`mb-3 h-2 rounded-full bg-gradient-to-r ${metric.accent}`} />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-xs font-black uppercase tracking-[0.17em] text-slate-500">{metric.label}</p>
                  <p className="mt-2 font-heading text-3xl font-black text-slate-900">{loading ? "..." : metric.value}</p>
                </div>
                <Activity className="h-5 w-5 text-slate-500" />
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/80">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${metric.accent}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.55, delay: 0.08 + index * 0.06 }}
                />
              </div>
            </motion.article>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-xl font-black text-slate-900">Student diversity</h3>
              <p className="mt-1 text-sm text-slate-600">Breakdown by enrollment category</p>
            </div>
            <div className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-600">
              Live Mix
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {loading ? (
              <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
            ) : categoryCounts.length > 0 ? (
              categoryCounts.map((item, idx) => {
                const count = item.student_count as number;
                const total = categoryCounts.reduce((acc, curr) => acc + (curr.student_count as number), 0);
                const pct = Math.round((count / total) * 100);

                return (
                  <div key={item.category as string} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                      <span>{item.category as string}</span>
                      <span>{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-rose-400"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-8 text-center text-sm italic text-slate-400">No student category data available.</p>
            )}
          </div>
        </article>

        <article className="glass-panel p-5">
          <h3 className="font-heading text-xl font-black text-slate-900">Rent signal</h3>
          <p className="mt-1 text-sm text-slate-600">Calculated from the hall room rent distribution report.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { key: "min_rent", label: "Minimum", icon: Waves },
              { key: "avg_rent", label: "Average", icon: Flame },
              { key: "max_rent", label: "Maximum", icon: Activity }
            ].map((item) => {
              const Icon = item.icon;
              const raw = rentStats?.[item.key];
              const value = typeof raw === "number" ? raw.toFixed(2) : "--";

              return (
                <div key={item.key} className="rounded-2xl border border-white/70 bg-white/75 p-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Icon className="h-4 w-4" />
                    <span className="font-heading text-xs font-black uppercase tracking-[0.14em]">{item.label}</span>
                  </div>
                  <p className="mt-2 font-heading text-2xl font-black text-slate-900">{value}</p>
                </div>
              );
            })}
          </div>
        </article>

        <article className="glass-panel p-5">
          <h3 className="font-heading text-xl font-black text-slate-900">Operation tips</h3>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            <li className="rounded-xl border border-white/70 bg-white/75 p-3">Use Entity Forge when importing or correcting master records.</li>
            <li className="rounded-xl border border-white/70 bg-white/75 p-3">Use Report Reactor for assignment outputs and compliance checks.</li>
            <li className="rounded-xl border border-white/70 bg-white/75 p-3">Refresh Pulse Board after bulk CRUD operations to verify data movement.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
