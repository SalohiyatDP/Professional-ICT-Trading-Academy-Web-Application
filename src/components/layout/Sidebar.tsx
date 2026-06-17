import { NavLink } from "react-router-dom";
import { modules } from "@/data/curriculum";
import { useProgressStore } from "@/store/useProgressStore";
import { cn } from "@/lib/utils";

const mainNav = [
  { to: "/", label: "Dashboard", icon: "📊", end: true },
  { to: "/replay", label: "Replay Simulator", icon: "⏯" },
  { to: "/chart-lab", label: "Chart Lab", icon: "📉" },
  { to: "/risk", label: "Risk Calculators", icon: "🧮" },
  { to: "/exam", label: "Final Exam", icon: "🏆" },
  { to: "/tutor", label: "AI Tutor", icon: "🤖" },
  { to: "/certificates", label: "Certificates", icon: "🎓" },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const completed = useProgressStore((s) => s.completedLessons);

  return (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto p-3">
      <div className="px-2 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🕯️</span>
          <div>
            <p className="text-sm font-bold leading-tight text-white">ICT Trading</p>
            <p className="text-xs leading-tight text-muted">Academy</p>
          </div>
        </div>
      </div>

      {mainNav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) => cn("nav-link", isActive && "nav-link-active")}
        >
          <span className="w-5 text-center">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}

      <p className="px-3 pt-5 pb-1 text-xs font-semibold uppercase tracking-wide text-muted">
        Curriculum
      </p>

      {modules.map((m) => {
        const done = m.lessons.filter((l) => completed[l.id]).length;
        return (
          <NavLink
            key={m.id}
            to={`/module/${m.id}`}
            onClick={onNavigate}
            className={({ isActive }) => cn("nav-link", isActive && "nav-link-active")}
          >
            <span className="w-5 text-center">{m.icon}</span>
            <span className="flex-1 truncate">{m.title}</span>
            <span
              className={cn(
                "text-[10px] font-mono",
                done === m.lessons.length ? "text-bull-strong" : "text-muted"
              )}
            >
              {done}/{m.lessons.length}
            </span>
          </NavLink>
        );
      })}

      <div className="mt-auto px-2 pt-4">
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className={({ isActive }) => cn("nav-link", isActive && "nav-link-active")}
        >
          <span className="w-5 text-center">⚙️</span>
          <span>Settings</span>
        </NavLink>
      </div>
    </nav>
  );
}
