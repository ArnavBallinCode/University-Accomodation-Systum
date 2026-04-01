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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ 
        delay: index * 0.05, 
        duration: 0.4,
        type: "spring",
        stiffness: 260,
        damping: 20 
      }}
      className="glass-panel relative overflow-hidden p-5"
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5 blur-3xl transition-colors group-hover:bg-white/10" />
      <div className={`mb-4 h-1.5 w-12 rounded-full bg-gradient-to-r ${accent} shadow-sm`} />
      
      <p className="font-heading text-[10px] font-black uppercase tracking-[0.25em] text-slate-500/80">
        {label}
      </p>
      
      <div className="mt-3 flex items-baseline gap-2">
        <p className="font-heading text-4xl font-black tracking-tight text-slate-900">
          {value}
        </p>
        <div className="h-1 w-1 rounded-full bg-slate-200" />
      </div>

      <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">
        {helper}
      </p>

      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r opacity-40 transition-all duration-500 group-hover:w-full" />
    </motion.article>
  );
}
