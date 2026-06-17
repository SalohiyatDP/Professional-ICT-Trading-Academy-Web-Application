import { useMemo } from "react";
import type { ModuleId, QuizQuestion } from "@/types";
import { useQuizStore } from "@/store/useQuizStore";
import { CandleChart } from "@/components/chart/CandleChart";
import { Card, ProgressBar, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

interface QuizEngineProps {
  moduleId: ModuleId | "final";
  questions: QuizQuestion[];
  title: string;
  onExit?: () => void;
}

export function QuizEngine({ moduleId, questions, title, onExit }: QuizEngineProps) {
  const store = useQuizStore();
  const active = store.moduleId === moduleId && store.questions.length > 0;

  if (!active && !store.finished) {
    return (
      <Card>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-muted">
          {questions.length} questions. Answer all, then submit to score.
        </p>
        <button
          className="btn-primary mt-4"
          onClick={() => store.start(moduleId, questions)}
        >
          Start quiz
        </button>
      </Card>
    );
  }

  if (store.finished && store.lastResult) {
    return <QuizResultView onRetry={() => store.start(moduleId, questions)} onExit={onExit} />;
  }

  return <QuizRunner />;
}


function QuizRunner() {
  const { questions, current, answers, answer, next, prev, goto, submit } = useQuizStore();
  const q = questions[current];
  const selected = answers[q.id] ?? [];
  const answeredCount = Object.keys(answers).length;

  const toggle = (optId: string) => {
    if (q.type === "multiple") {
      const set = new Set(selected);
      set.has(optId) ? set.delete(optId) : set.add(optId);
      answer(q.id, [...set]);
    } else {
      answer(q.id, [optId]);
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge tone="accent">
          Question {current + 1} / {questions.length}
        </Badge>
        <span className="text-xs text-muted">{answeredCount} answered</span>
      </div>
      <ProgressBar value={((current + 1) / questions.length) * 100} />

      <h3 className="text-lg font-semibold text-white">{q.prompt}</h3>

      {q.candles && (
        <div className="card p-2">
          <CandleChart candles={q.candles} height={240} showVolume={false} autoFit />
        </div>
      )}

      <div className="grid gap-2">
        {q.options?.map((opt) => {
          const isSel = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => toggle(opt.id)}
              className={cn(
                "rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                isSel
                  ? "border-accent bg-accent-soft text-white"
                  : "border-border bg-bg-soft text-gray-300 hover:border-border-soft"
              )}
            >
              <span className="font-mono text-xs text-muted mr-2">{opt.id.toUpperCase()}</span>
              {opt.text}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button className="btn-ghost" onClick={prev} disabled={current === 0}>
          ← Prev
        </button>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => goto(i)}
              className={cn(
                "h-2 w-2 rounded-full",
                i === current
                  ? "bg-accent"
                  : answers[questions[i].id]
                    ? "bg-bull"
                    : "bg-border"
              )}
              aria-label={`Go to question ${i + 1}`}
            />
          ))}
        </div>
        {current < questions.length - 1 ? (
          <button className="btn-ghost" onClick={next}>
            Next →
          </button>
        ) : (
          <button className="btn-primary" onClick={() => submit()}>
            Submit
          </button>
        )}
      </div>
    </Card>
  );
}


function QuizResultView({
  onRetry,
  onExit,
}: {
  onRetry: () => void;
  onExit?: () => void;
}) {
  const { lastResult, questions } = useQuizStore();
  const result = lastResult!;
  const passed = result.score >= 70;

  const byId = useMemo(
    () => Object.fromEntries(questions.map((q) => [q.id, q])),
    [questions]
  );

  return (
    <div className="space-y-4">
      <Card className="text-center">
        <p className="text-sm uppercase tracking-wide text-muted">Your score</p>
        <p
          className={cn(
            "my-2 text-6xl font-bold font-mono",
            passed ? "text-bull-strong" : "text-bear-strong"
          )}
        >
          {result.score}%
        </p>
        <p className="text-sm text-gray-300">
          {result.correct} / {result.total} correct ·{" "}
          {passed ? "Passed 🎉" : "Keep practicing"}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <button className="btn-primary" onClick={onRetry}>
            Retake
          </button>
          {onExit && (
            <button className="btn-ghost" onClick={onExit}>
              Done
            </button>
          )}
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="font-semibold text-white">Review</h3>
        {result.perQuestion.map((pq, i) => {
          const q = byId[pq.questionId];
          return (
            <div
              key={pq.questionId}
              className={cn(
                "rounded-lg border p-3",
                pq.correct ? "border-bull/40 bg-bull-soft" : "border-bear/40 bg-bear-soft"
              )}
            >
              <p className="text-sm font-medium text-white">
                {i + 1}. {q.prompt} {pq.correct ? "✓" : "✕"}
              </p>
              <p className="mt-1 text-xs text-gray-300">{q.explanation}</p>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
