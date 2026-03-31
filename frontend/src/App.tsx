import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import { AnimatedBackdrop } from "./components/AnimatedBackdrop";
import { TopNav } from "./components/TopNav";
import { EntityStudioPage } from "./pages/EntityStudioPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { PulseBoardPage } from "./pages/PulseBoardPage";
import { ReportsPage } from "./pages/ReportsPage";
import { useAuth } from "./providers/AuthProvider";

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

function AppBootSplash(): JSX.Element {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackdrop />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">
        <div className="glass-panel w-full p-8 text-center">
          <p className="font-heading text-xs font-black uppercase tracking-[0.2em] text-cyan-700">Session check</p>
          <h2 className="mt-3 font-heading text-3xl font-black text-slate-900">Preparing command universe...</h2>
        </div>
      </div>
    </div>
  );
}

function RequireAuth(): JSX.Element {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return <AppBootSplash />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  return <Outlet />;
}

function LoginOnly(): JSX.Element {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <AppBootSplash />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function FallbackRoute(): JSX.Element {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/" : "/login"} replace />;
}

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<LoginOnly />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<Shell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/studio" element={<EntityStudioPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/pulse" element={<PulseBoardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<FallbackRoute />} />
    </Routes>
  );
}
