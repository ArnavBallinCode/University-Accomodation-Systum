import { AnimatePresence, motion } from "framer-motion";
import { createContext, type ReactNode, useContext, useMemo, useRef, useState } from "react";

type ToastTone = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
}

interface ToastContextValue {
  pushToast: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toneClass: Record<ToastTone, string> = {
  success: "border-emerald-300 bg-emerald-50 text-emerald-900",
  error: "border-rose-300 bg-rose-50 text-rose-900",
  info: "border-cyan-300 bg-cyan-50 text-cyan-900"
};

export function ToastProvider({ children }: { children: ReactNode }): JSX.Element {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const counterRef = useRef(1);

  const pushToast = (toast: ToastInput): void => {
    const id = counterRef.current;
    counterRef.current += 1;

    const next: ToastMessage = {
      id,
      tone: toast.tone ?? "info",
      title: toast.title,
      description: toast.description
    };

    setToasts((current) => [...current, next]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((entry) => entry.id !== id));
    }, 4400);
  };

  const value = useMemo<ToastContextValue>(() => ({ pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.95 }}
              transition={{ duration: 0.24 }}
              className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-glow backdrop-blur ${toneClass[toast.tone]}`}
            >
              <p className="font-heading text-sm font-extrabold uppercase tracking-[0.16em]">{toast.title}</p>
              {toast.description && <p className="mt-1 text-sm leading-relaxed">{toast.description}</p>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
