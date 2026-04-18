import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * 应用主布局：侧边栏 + 顶栏 + 内容区
 */
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* 装饰性光晕，极低强度 */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full opacity-[0.18] blur-[120px]"
          style={{
            background: "radial-gradient(circle, #5a7dff 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full opacity-[0.12] blur-[120px]"
          style={{
            background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
          }}
        />
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
