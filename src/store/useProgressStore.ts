import { create } from "zustand";
import type { ModuleId, QuizResult } from "@/types";
import { loadJSON, saveJSON } from "@/lib/storage";

const KEY = "ict-progress-v1";

interface PersistedProgress {
  completedLessons: Record<string, number>; // lessonId -> completedAt
  bestQuizScores: Record<string, number>; // moduleId|final -> best %
  holderName: string;
}

interface ProgressState extends PersistedProgress {
  completeLesson: (lessonId: string) => void;
  uncompleteLesson: (lessonId: string) => void;
  isLessonComplete: (lessonId: string) => boolean;
  recordQuiz: (result: QuizResult) => void;
  bestScore: (key: ModuleId | "final") => number;
  setHolderName: (name: string) => void;
  reset: () => void;
}

const initial = loadJSON<PersistedProgress>(KEY, {
  completedLessons: {},
  bestQuizScores: {},
  holderName: "ICT Trader",
});

function persist(state: PersistedProgress) {
  saveJSON(KEY, {
    completedLessons: state.completedLessons,
    bestQuizScores: state.bestQuizScores,
    holderName: state.holderName,
  });
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  ...initial,

  completeLesson: (lessonId) =>
    set((s) => {
      const completedLessons = { ...s.completedLessons, [lessonId]: Date.now() };
      const next = { ...s, completedLessons };
      persist(next);
      return { completedLessons };
    }),

  uncompleteLesson: (lessonId) =>
    set((s) => {
      const completedLessons = { ...s.completedLessons };
      delete completedLessons[lessonId];
      const next = { ...s, completedLessons };
      persist(next);
      return { completedLessons };
    }),

  isLessonComplete: (lessonId) => Boolean(get().completedLessons[lessonId]),

  recordQuiz: (result) =>
    set((s) => {
      const key = result.moduleId;
      const prev = s.bestQuizScores[key] ?? 0;
      const bestQuizScores = {
        ...s.bestQuizScores,
        [key]: Math.max(prev, result.score),
      };
      const next = { ...s, bestQuizScores };
      persist(next);
      return { bestQuizScores };
    }),

  bestScore: (key) => get().bestQuizScores[key] ?? 0,

  setHolderName: (name) =>
    set((s) => {
      const next = { ...s, holderName: name };
      persist(next);
      return { holderName: name };
    }),

  reset: () =>
    set(() => {
      const empty: PersistedProgress = {
        completedLessons: {},
        bestQuizScores: {},
        holderName: "ICT Trader",
      };
      persist(empty);
      return empty;
    }),
}));
