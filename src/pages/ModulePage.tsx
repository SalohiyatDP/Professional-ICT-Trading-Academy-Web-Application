import { Link, useParams, Navigate } from "react-router-dom";
import { getModule, moduleQuiz } from "@/data/curriculum";
import type { ModuleId } from "@/types";
import { useProgressStore } from "@/store/useProgressStore";
import { Card, ProgressBar, Badge, SectionTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

export function ModulePage() {
  const { moduleId } = useParams<{ moduleId: ModuleId }>();
  const mod = moduleId ? getModule(moduleId) : undefined;
  const completed = useProgressStore((s) => s.completedLessons);
  const best = useProgressStore((s) => s.bestScore);

  if (!mod) return <Navigate to="/" replace />;

  const done = mod.lessons.filter((l) => completed[l.id]).length;
  const pct = Math.round((done / mod.lessons.length) * 100);
  const quizCount = moduleQuiz(mod.id).length;

  return (
    <div className="space-y-6">
      <Link to="/" className="text-sm text-muted hover:text-white">
        ← Dashboard
      </Link>

      <SectionTitle
        title={`${mod.icon} ${mod.title}`}
        subtitle={mod.description}
        right={<Badge tone="accent">{mod.level}</Badge>}
      />

      <Card>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-white">Module progress</span>
          <span className="text-muted">
            {done}/{mod.lessons.length} lessons · best quiz {best(mod.id)}%
          </span>
        </div>
        <ProgressBar value={pct} />
      </Card>

      <div className="space-y-3">
        {mod.lessons.map((lesson, i) => {
          const isDone = Boolean(completed[lesson.id]);
          return (
            <Link key={lesson.id} to={`/module/${mod.id}/lesson/${lesson.id}`}>
              <Card className="flex items-center gap-4 transition-colors hover:border-accent">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    isDone ? "bg-bull text-white" : "bg-bg-soft text-muted"
                  )}
                >
                  {isDone ? "✓" : i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{lesson.title}</p>
                  <p className="text-xs text-muted">{lesson.summary}</p>
                </div>
                <span className="text-xs text-muted">{lesson.minutes} min</span>
              </Card>
            </Link>
          );
        })}
      </div>

      {quizCount > 0 && (
        <Card className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-white">Module quiz</p>
            <p className="text-xs text-muted">{quizCount} questions · best {best(mod.id)}%</p>
          </div>
          <Link to={`/module/${mod.id}/quiz`} className="btn-primary">
            Take quiz
          </Link>
        </Card>
      )}
    </div>
  );
}
