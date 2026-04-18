/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState, type ReactNode } from "react";
import {
  createHashRouter,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AppLayout from "./components/layout-new/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import BotsPage from "./pages/BotsPage";
import MessagesPage from "./pages/MessagesPage";
import ContactsPage from "./pages/ContactsPage";
import SchedulesPage from "./pages/SchedulesPage";
import NapCatPage from "./pages/NapCatPage";
import NcLogsPage from "./pages/NcLogsPage";
import ConsolePage from "./pages/ConsolePage";
import ServerLogsPage from "./pages/ServerLogsPage";
import LogsPage from "./pages/LogsPage";
import LoginPage from "./pages/LoginPage";
import SetupPage from "./pages/SetupPage";
import SettingsPage from "./pages/SettingsPage";
import { apiCall, getAdminToken } from "./api/client";

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

function AnimatedOutlet() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="h-full"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

interface AuthStatus {
  initialized: boolean;
}

/**
 * 全局鉴权门禁（套在所有路由最外层）：
 *  - 首次挂载查询 /api/auth/status
 *  - initialized=false → 强制跳 /setup（已在 /setup 不跳）
 *  - initialized=true 且无 token 且当前不在 /login/setup → 跳 /login
 *  - 其它情况原样渲染 children
 */
function AuthGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await apiCall<AuthStatus>("GET", "/api/auth/status");
      if (cancelled) return;
      const initialized = data?.initialized ?? false;
      const token = getAdminToken();
      const path = location.pathname;
      if (!initialized) {
        if (path !== "/setup") navigate("/setup", { replace: true });
      } else if (!token) {
        if (path !== "/login" && path !== "/setup")
          navigate("/login", { replace: true });
      } else {
        // 已登录却停留在 /login 或 /setup → 回仪表盘
        if (path === "/login" || path === "/setup")
          navigate("/dashboard", { replace: true });
      }
      setChecked(true);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[var(--color-text-muted)]">
        加载中…
      </div>
    );
  }
  return <>{children}</>;
}

function RootShell() {
  return (
    <AuthGate>
      <Outlet />
    </AuthGate>
  );
}

export const router = createHashRouter([
  {
    element: <RootShell />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "setup", element: <SetupPage /> },
      {
        element: <AppLayout />,
        children: [
          {
            element: <AnimatedOutlet />,
            children: [
              { index: true, element: <Navigate to="/dashboard" replace /> },
              { path: "dashboard", element: <DashboardPage /> },
              { path: "bots", element: <BotsPage /> },
              { path: "messages", element: <MessagesPage /> },
              { path: "contacts", element: <ContactsPage /> },
              { path: "schedules", element: <SchedulesPage /> },
              { path: "napcat", element: <NapCatPage /> },
              { path: "nc-logs", element: <NcLogsPage /> },
              { path: "console", element: <ConsolePage /> },
              { path: "server-logs", element: <ServerLogsPage /> },
              { path: "logs", element: <LogsPage /> },
              { path: "settings", element: <SettingsPage /> },
              { path: "*", element: <Navigate to="/dashboard" replace /> },
            ],
          },
        ],
      },
    ],
  },
]);
