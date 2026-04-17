/* eslint-disable react-refresh/only-export-components */
import {
  createHashRouter,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
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
import { useState } from "react";

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

function BackgroundEffect() {
  return (
    <div
      className="fixed inset-0 w-full h-full -z-10 overflow-hidden transition-colors duration-500"
      style={{
        background:
          "linear-gradient(to bottom right, var(--bg-from), var(--bg-via), var(--bg-to))",
      }}
    >
      <div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] transition-colors duration-500"
        style={{ backgroundColor: "var(--orb1-color)" }}
      />
      <div
        className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[90px] transition-colors duration-500"
        style={{ backgroundColor: "var(--orb2-color)" }}
      />
      <div
        className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full blur-[110px] transition-colors duration-500"
        style={{ backgroundColor: "var(--orb3-color)" }}
      />
    </div>
  );
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <BackgroundEffect />
      <div className="flex h-screen overflow-hidden relative">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar onMenuToggle={() => setSidebarOpen((s) => !s)} />
          <main className="flex-1 overflow-y-auto p-6">
            <AnimatedOutlet />
          </main>
        </div>
      </div>
    </>
  );
}

export const router = createHashRouter([
  {
    element: <Layout />,
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
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
