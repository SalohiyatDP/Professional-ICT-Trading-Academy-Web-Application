import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { getModule, moduleQuiz } from "@/data/curriculum";
import type { ModuleId } from "@/types";
import { QuizEngine } from "@/components/quiz/QuizEngine";

export function QuizPage() {
  const { moduleId } = useParams<{ moduleId: ModuleId }>();
  const navigate = useNavigate();
  const mod = moduleId ? getModule(moduleId) : undefined;
  if (!mod) return <Navigate to="/" replace />;

  const questions = moduleQuiz(mod.id);

  return (
    <div className="space-y-4">
      <Link to={`/module/${mod.id}`} className="text-sm text-muted hover:text-white">
        ← {mod.title}
      </Link>
      <h1 className="text-2xl font-bold text-white">{mod.title} — Test</h1>
      <QuizEngine
        moduleId={mod.id}
        questions={questions}
        title={`${mod.title} testi`}
        onExit={() => navigate(`/module/${mod.id}`)}
      />
    </div>
  );
}
