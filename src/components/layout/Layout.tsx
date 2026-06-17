import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-bg-soft lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-border bg-bg-soft animate-slide-in">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-bg-soft px-4">
          <button
            className="btn-ghost px-2 py-1 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="text-sm font-semibold text-white lg:hidden">ICT Academy</span>
          <div className="ml-auto flex items-center gap-2">
            <OfflineBadge />
          </div>
        </header>

        <main className={cn("flex-1 overflow-y-auto p-4 lg:p-6")}>
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function OfflineBadge() {
  return (
    <span className="badge bg-bull-soft text-bull-strong">
      <span className="h-1.5 w-1.5 rounded-full bg-bull-strong" />
      Offline-ready
    </span>
  );
}
