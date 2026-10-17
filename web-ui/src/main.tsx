import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toast } from "@heroui/react";
import { router } from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
        <Toast.Provider placement="bottom end" />
      </MotionConfig>
    </ThemeProvider>
  </React.StrictMode>,
);
