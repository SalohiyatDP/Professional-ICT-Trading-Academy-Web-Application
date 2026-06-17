import { create } from "zustand";
import type { ModuleId, QuizQuestion, QuizResult } from "@/types";
import { dbPut, dbGetAll } from "@/lib/db";
import { useProgressStore } from "./useProgressStore";

interface QuizState {
  moduleId: ModuleId | "final" | null;
  questions: QuizQuestion[];
  current: number;
  answers: Record<string, string[]>; // questionId -> selected option ids
  startedAt: number;
  finished: boolean;
  lastResult: QuizResult | null;
  history: QuizResult[];

  start: (moduleId: ModuleId | "final", questions: QuizQuestion[]) => void;
  answer: (questionId: string, optionIds: string[]) => void;
  goto: (index: number) => void;
  next: () => void;
  prev: () => void;
  submit: () => QuizResult;
  loadHistory: () => Promise<void>;
}

function isCorrect(q: QuizQuestion, given: string[] | undefined): boolean {
  if (!given) return false;
  if (q.type === "drag-match") {
    // For drag-match, answers stored as `${left}=>${right}` ids matched to pairs.
    if (!q.pairs) return false;
    const expected = new Set(q.pairs.map((p) => `${p.left}=>${p.right}`));
    if (given.length !== expected.size) return false;
    return given.every((g) => expected.has(g));
  }
  const correct = new Set(q.correct ?? []);
  if (correct.size !== given.length) return false;
  return given.every((g) => correct.has(g));
}

export const useQuizStore = create<QuizState>((set, get) => ({
  moduleId: null,
  questions: [],
  current: 0,
  answers: {},
  startedAt: 0,
  finished: false,
  lastResult: null,
  history: [],

  start: (moduleId, questions) =>
    set({
      moduleId,
      questions,
      current: 0,
      answers: {},
      startedAt: Date.now(),
      finished: false,
      lastResult: null,
    }),

  answer: (questionId, optionIds) =>
    set((s) => ({ answers: { ...s.answers, [questionId]: optionIds } })),

  goto: (index) =>
    set((s) => ({ current: Math.max(0, Math.min(index, s.questions.length - 1)) })),

  next: () =>
    set((s) => ({ current: Math.min(s.current + 1, s.questions.length - 1) })),

  prev: () => set((s) => ({ current: Math.max(s.current - 1, 0) })),

  submit: () => {
    const { questions, answers, moduleId, startedAt } = get();
    const perQuestion = questions.map((q) => ({
      questionId: q.id,
      correct: isCorrect(q, answers[q.id]),
    }));
    const correct = perQuestion.filter((p) => p.correct).length;
    const total = questions.length;
    const result: QuizResult = {
      moduleId: moduleId ?? "final",
      score: total ? Math.round((correct / total) * 100) : 0,
      correct,
      total,
      takenAt: Date.now(),
      durationSec: Math.round((Date.now() - startedAt) / 1000),
      perQuestion,
    };

    set({ finished: true, lastResult: result });

    // Persist + reflect into progress.
    void dbPut("quizResults", { ...result, id: result.takenAt });
    useProgressStore.getState().recordQuiz(result);

    return result;
  },

  loadHistory: async () => {
    const all = await dbGetAll<QuizResult>("quizResults");
    set({ history: all.sort((a, b) => b.takenAt - a.takenAt) });
  },
}));
