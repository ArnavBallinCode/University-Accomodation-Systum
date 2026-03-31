import { motion } from "framer-motion";

export function AnimatedBackdrop(): JSX.Element {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-sheen" />

      <motion.div
        className="absolute -left-20 top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,#ff8a63_0%,#ff8a6300_72%)] blur-2xl"
        animate={{ x: [0, 22, -10, 0], y: [0, -18, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute right-[-4rem] top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,#00b8a9_0%,#00b8a900_70%)] blur-2xl"
        animate={{ x: [0, -18, 16, 0], y: [0, 20, -8, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[-4rem] left-[18%] h-80 w-80 rounded-full bg-[radial-gradient(circle,#ffcf40_0%,#ffcf4000_72%)] blur-2xl"
        animate={{ x: [0, 20, -12, 0], y: [0, -12, 18, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute -right-32 bottom-4 h-72 w-72 animate-spin-slow rounded-full border border-white/60" />
    </div>
  );
}
