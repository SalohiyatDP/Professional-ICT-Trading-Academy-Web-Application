import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { getModule, getLesson } from "@/data/curriculum";
import type { ModuleId } from "@/types";
import { useProgressStore } from "@/store/useProgressStore";
import { LessonContent } from "@/components/lesson/LessonContent";
import { Card, Badge } from "@/components/ui";

export function LessonPage() {
  const { moduleId, lessonId } = useParams<{ moduleId: ModuleId; lessonId: string }>();
  const navigate = useNavigate();
  const mod = moduleId ? getModule(moduleId) : undefined;
  const lesson = moduleId && lessonId ? getLesson(moduleId, lessonId) : undefined;
  const isDone = useProgressStore((s) => (lessonId ? s.isLessonComplete(lessonId) : false));
  const complete = useProgressStore((s) => s.completeLesson);
  const uncomplete = useProgressStore((s) => s.uncompleteLesson);

  if (!mod || !lesson) return <Navigate to="/" replace />;

  const idx = mod.lessons.findIndex((l) => l.id === lesson.id);
  const prev = mod.lessons[idx - 1];
  const nextLesson = mod.lessons[idx + 1];

  const onComplete = () => {
    if (!isDone) complete(lesson.id);
    if (nextLesson) navigate(`/module/${mod.id}/lesson/${nextLesson.id}`);
    else navigate(`/module/${mod.id}/quiz`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link to={`/module/${mod.id}`} className="text-sm text-muted hover:text-white">
          ← {mod.title}
        </Link>
        <Badge tone={isDone ? "bull" : "neutral"}>{isDone ? "Tugallandi ✓" : `${lesson.minutes} daqiqa`}</Badge>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-accent">
          {idx + 1}-dars / {mod.lessons.length}
        </p>
        <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
        <p className="text-sm text-muted">{lesson.summary}</p>
      </div>

      <Card>
        <LessonContent lesson={lesson} />
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {prev && (
            <Link to={`/module/${mod.id}/lesson/${prev.id}`} className="btn-ghost">
              ← Oldingi
            </Link>
          )}
          <button
            className="btn-ghost"
            onClick={() => (isDone ? uncomplete(lesson.id) : complete(lesson.id))}
          >
            {isDone ? "Tugallanmagan deb belgilash" : "Tugallangan deb belgilash"}
          </button>
        </div>
        <button className="btn-primary" onClick={onComplete}>
          {nextLesson ? "Tugatish va keyingisi →" : "Tugatish va testni boshlash →"}
        </button>
      </div>
    </div>
  );
}
