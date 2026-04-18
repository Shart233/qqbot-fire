/* eslint-disable react-refresh/only-export-components */
import {
  createHashRouter,
  Navigate,
  Outlet,
  useLocation,
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

function LayoutWithTransition() {
  return <AppLayout />;
}

export const router = createHashRouter([
  {
    element: <LayoutWithTransition />,
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
          { path: "*", element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
]);
