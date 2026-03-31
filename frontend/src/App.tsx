import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import { AnimatedBackdrop } from "./components/AnimatedBackdrop";
import { TopNav } from "./components/TopNav";
import { EntityStudioPage } from "./pages/EntityStudioPage";
import { HomePage } from "./pages/HomePage";
import { PulseBoardPage } from "./pages/PulseBoardPage";
import { ReportsPage } from "./pages/ReportsPage";

function Shell(): JSX.Element {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <AnimatedBackdrop />
      <TopNav />
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/studio" element={<EntityStudioPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/pulse" element={<PulseBoardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
