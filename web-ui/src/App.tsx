/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  createHashRouter,
  Navigate,
  Outlet,
  useLocation,
  useOutlet,
} from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "./components/layout-new/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import BotsPage from "./pages/BotsPage";
import MessagesPage from "./pages/MessagesPage";
import ContactsPage from "./pages/ContactsPage";
import SchedulesPage from "./pages/SchedulesPage";
import NapCatPage from "./pages/NapCatPage";
import NcLogsPage from "./pages/NcLogsPage";
import NcLoginPage from "./pages/NcLoginPage";
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
  const outlet = useOutlet();
  return (
    <motion.div
      key={location.pathname}
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className="h-full"
    >
      {outlet}
    </motion.div>
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
  const location = useLocation();
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [failed, setFailed] = useState(false);
  const load = useCallback(async () => {
    setStatus(null);
    setFailed(false);
    const data = await apiCall<AuthStatus>(
      "GET",
      "/api/auth/status",
      undefined,
      { silent: true },
    );
    if (data) setStatus(data);
    else setFailed(true);
  }, []);
  useEffect(() => {
    let cancelled = false;
    void apiCall<AuthStatus>("GET", "/api/auth/status", undefined, {
      silent: true,
    }).then((data) => {
      if (cancelled) return;
      if (data) setStatus(data);
      else setFailed(true);
    });
    const changed = () => {
      void load();
    };
    window.addEventListener("qqbot-auth-changed", changed);
    return () => {
      cancelled = true;
      window.removeEventListener("qqbot-auth-changed", changed);
    };
  }, [load]);
  if (!status)
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center text-sm text-[var(--color-text-secondary)]">
        {failed ? (
          <>
            暂时无法连接服务。
            <button
              onClick={() => {
                void load();
              }}
              className="underline"
            >
              重试连接
            </button>
          </>
        ) : (
          "加载中…"
        )}
      </div>
    );
  const token = getAdminToken();
  const path = location.pathname;
  // 先决定鉴权路由，再挂载页面，避免未初始化时页面请求的 401 抢先跳到登录页。
  if (!status.initialized && path !== "/setup")
    return <Navigate to="/setup" replace />;
  if (status.initialized && !token && path !== "/login")
    return <Navigate to="/login" replace />;
  if (status.initialized && token && (path === "/login" || path === "/setup"))
    return <Navigate to="/dashboard" replace />;
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
              { path: "nc-login", element: <NcLoginPage /> },
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
