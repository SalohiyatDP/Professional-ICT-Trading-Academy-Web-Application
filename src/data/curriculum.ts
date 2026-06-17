import type { CertificationLevel, Lesson, Module, ModuleId, QuizQuestion } from "@/types";
import { candlesticksModule } from "./modules/candlesticks";
import { marketStructureModule } from "./modules/marketStructure";
import { liquidityModule } from "./modules/liquidity";
import { orderBlockModule } from "./modules/orderBlock";
import { fvgModule } from "./modules/fvg";
import { premiumDiscountModule } from "./modules/premiumDiscount";
import { entryModelsModule } from "./modules/entryModels";
import { riskManagementModule } from "./modules/riskManagement";

export const modules: Module[] = [
  candlesticksModule,
  marketStructureModule,
  liquidityModule,
  orderBlockModule,
  fvgModule,
  premiumDiscountModule,
  entryModelsModule,
  riskManagementModule,
].sort((a, b) => a.order - b.order);

export function getModule(id: ModuleId): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function getLesson(moduleId: ModuleId, lessonId: string): Lesson | undefined {
  return getModule(moduleId)?.lessons.find((l) => l.id === lessonId);
}

export const allLessons: Lesson[] = modules.flatMap((m) => m.lessons);

export function totalLessons(): number {
  return allLessons.length;
}

/** All quiz questions for a module (aggregated from its lessons). */
export function moduleQuiz(moduleId: ModuleId): QuizQuestion[] {
  const mod = getModule(moduleId);
  if (!mod) return [];
  return mod.lessons.flatMap((l) => l.quiz ?? []);
}

export const levelOrder: CertificationLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
  "professional",
];

export const levelMeta: Record<
  CertificationLevel,
  { label: string; color: string; minScore: number }
> = {
  beginner: { label: "Boshlang'ich", color: "#26a69a", minScore: 60 },
  intermediate: { label: "O'rta", color: "#2962ff", minScore: 70 },
  advanced: { label: "Yuqori", color: "#9b59b6", minScore: 80 },
  professional: { label: "Professional ICT Treyder", color: "#f5b041", minScore: 85 },
};
