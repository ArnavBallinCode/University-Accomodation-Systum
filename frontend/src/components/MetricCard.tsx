import { motion } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: string;
  helper: string;
  accent: string;
  index: number;
}

export function MetricCard({ label, value, helper, accent, index }: MetricCardProps): JSX.Element {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.28 }}
      className="glass-panel p-4"
    >
      <div className={`mb-3 h-2 rounded-full bg-gradient-to-r ${accent}`} />
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 font-heading text-3xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{helper}</p>
    </motion.article>
  );
}
