/**
 * Core domain types for the ICT Trading Academy.
 * Everything is plain data so it can be persisted to IndexedDB / localStorage.
 */

/* ------------------------------------------------------------------ */
/* Market data                                                         */
/* ------------------------------------------------------------------ */

/** A single OHLC candle. `time` is a UNIX timestamp in seconds. */
export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export type ChartType = "candlestick" | "bar" | "line";

/** A rectangular zone drawn on the chart (order block, FVG, premium/discount). */
export interface ChartZone {
  id: string;
  type: "order-block" | "fvg" | "liquidity" | "premium" | "discount" | "equilibrium";
  startTime: number;
  endTime: number;
  top: number;
  bottom: number;
  color: string;
  label?: string;
}

/** A price marker / annotation (entry, SL, TP, swing point). */
export interface ChartMarker {
  id: string;
  time: number;
  price: number;
  kind: "HH" | "HL" | "LH" | "LL" | "entry" | "sl" | "tp" | "sweep" | "bos" | "choch" | "note";
  text?: string;
  color?: string;
}

/** Horizontal level / trend line drawn by the user. */
export interface DrawnLine {
  id: string;
  type: "horizontal" | "trend" | "ray";
  points: { time: number; price: number }[];
  color: string;
  width: number;
}

/* ------------------------------------------------------------------ */
/* Curriculum                                                          */
/* ------------------------------------------------------------------ */

export type ModuleId =
  | "candlesticks"
  | "market-structure"
  | "liquidity"
  | "order-block"
  | "fvg"
  | "premium-discount"
  | "entry-models"
  | "risk-management";

export type CertificationLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "professional";

export interface LessonExample {
  title: string;
  candles: Candle[];
  zones?: ChartZone[];
  markers?: ChartMarker[];
  lines?: DrawnLine[];
  /** Horizontal reference levels (e.g. equilibrium, entry/SL/TP). */
  priceLines?: { price: number; color: string; title: string }[];
  caption: string;
}

export interface Lesson {
  id: string;
  moduleId: ModuleId;
  title: string;
  /** Short one-line summary shown in lists. */
  summary: string;
  /** Estimated minutes to complete. */
  minutes: number;
  /** Rich content blocks rendered in order. */
  content: LessonBlock[];
  /** Optional interactive chart examples with animated formation. */
  examples?: LessonExample[];
  /** Quiz questions specific to this lesson. */
  quiz?: QuizQuestion[];
}

export type LessonBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "callout"; tone: "info" | "bull" | "bear" | "warning"; title: string; text: string }
  | { kind: "do-dont"; works: string[]; fails: string[] }
  | { kind: "example"; exampleIndex: number };

export interface Module {
  id: ModuleId;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  level: CertificationLevel;
  lessons: Lesson[];
}

/* ------------------------------------------------------------------ */
/* Quiz engine                                                         */
/* ------------------------------------------------------------------ */

export type QuizQuestionType =
  | "single"
  | "multiple"
  | "true-false"
  | "drag-match"
  | "chart-identify";

export interface QuizOption {
  id: string;
  text: string;
}

export interface DragPair {
  left: string;
  right: string;
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  explanation: string;
  /** Options for single/multiple/true-false/chart-identify. */
  options?: QuizOption[];
  /** Correct option id(s). */
  correct?: string[];
  /** For drag-match questions. */
  pairs?: DragPair[];
  /** Optional candles to render for chart-identify questions. */
  candles?: Candle[];
  points?: number;
}

export interface QuizResult {
  moduleId: ModuleId | "final";
  score: number; // 0..100
  correct: number;
  total: number;
  takenAt: number;
  durationSec: number;
  perQuestion: { questionId: string; correct: boolean }[];
}

/* ------------------------------------------------------------------ */
/* Replay simulator                                                    */
/* ------------------------------------------------------------------ */

export type TradeDirection = "long" | "short";

export interface ReplayTrade {
  id: string;
  direction: TradeDirection;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  entryTime: number;
  exitTime?: number;
  exitPrice?: number;
  status: "open" | "win" | "loss" | "breakeven";
  rMultiple: number;
  riskRewardPlanned: number;
}

export interface ReplaySession {
  id: string;
  datasetId: string;
  createdAt: number;
  trades: ReplayTrade[];
  /** Index of the last revealed candle. */
  revealedIndex: number;
}

export interface ReplayStats {
  totalTrades: number;
  wins: number;
  losses: number;
  breakeven: number;
  winRate: number;
  avgR: number;
  totalR: number;
  bestR: number;
  worstR: number;
}

/* ------------------------------------------------------------------ */
/* Progress & certification                                            */
/* ------------------------------------------------------------------ */

export interface LessonProgress {
  lessonId: string;
  moduleId: ModuleId;
  completed: boolean;
  completedAt?: number;
}

export interface ModuleProgress {
  moduleId: ModuleId;
  lessonsCompleted: number;
  lessonsTotal: number;
  bestQuizScore: number; // 0..100
}

export interface Certificate {
  id: string;
  level: CertificationLevel;
  score: number;
  issuedAt: number;
  holderName: string;
}

export interface SkillStat {
  moduleId: ModuleId;
  label: string;
  /** Mastery 0..100 derived from lessons + quiz score. */
  mastery: number;
}

/* ------------------------------------------------------------------ */
/* Risk management                                                     */
/* ------------------------------------------------------------------ */

export interface RiskCalcInput {
  accountBalance: number;
  riskPercent: number;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice?: number;
  pipValue?: number;
  contractSize?: number;
}

export interface RiskCalcResult {
  riskAmount: number;
  stopDistance: number;
  positionSize: number;
  lotSize: number;
  rewardAmount?: number;
  riskRewardRatio?: number;
}

/* ------------------------------------------------------------------ */
/* AI Tutor                                                            */
/* ------------------------------------------------------------------ */

export interface TutorMessage {
  id: string;
  role: "user" | "tutor";
  text: string;
  createdAt: number;
  /** Optional related lesson/module the answer points to. */
  related?: { moduleId: ModuleId; lessonId?: string }[];
}
