import type { Candle, Lesson, Module, QuizQuestion } from "@/types";

const DAY = 86400;
const T0 = 1_700_000_000;
const t = (i: number) => T0 + i * DAY;
const c = (i: number, o: number, h: number, l: number, cl: number): Candle => ({
  time: t(i),
  open: o,
  high: h,
  low: l,
  close: cl,
});

function q(
  id: string,
  prompt: string,
  options: [string, string][],
  correct: string[],
  explanation: string
): QuizQuestion {
  return {
    id,
    type: "single",
    prompt,
    explanation,
    options: options.map(([oid, text]) => ({ id: oid, text })),
    correct,
    points: 1,
  };
}

// Bullish OB: last down candle (index 3) before strong rally, then return to mitigate.
const bullishOB: Candle[] = [
  c(0, 101, 101.4, 100.4, 100.7),
  c(1, 100.7, 100.9, 100, 100.2),
  c(2, 100.2, 100.4, 99.4, 99.6),
  c(3, 99.6, 99.8, 98.8, 99.0), // <-- bullish order block (last down candle)
  c(4, 99.0, 102.2, 98.95, 102.0), // displacement up (BOS)
  c(5, 102.0, 103.4, 101.8, 103.1),
  c(6, 103.1, 103.3, 99.4, 99.6), // return to OB (mitigation)
  c(7, 99.6, 104.0, 99.3, 103.8), // continuation
];

const bullishOBZone = [
  {
    id: "ob-bull",
    type: "order-block" as const,
    startTime: t(3),
    endTime: t(7),
    top: 99.8,
    bottom: 98.8,
    color: "#26a69a",
    label: "Bullish Order Block",
  },
];
const bullishOBMarkers = [
  { id: "ob-entry", time: t(6), price: 99.6, kind: "entry" as const, text: "Entry", color: "#2962ff" },
  { id: "ob-sl", time: t(6), price: 98.8, kind: "sl" as const, text: "SL", color: "#ef5350" },
  { id: "ob-tp", time: t(7), price: 104.0, kind: "tp" as const, text: "TP", color: "#26a69a" },
];

const lessons: Lesson[] = [
  {
    id: "ob-bullish",
    moduleId: "order-block",
    title: "Bullish & Bearish Order Blocks",
    summary: "The last opposite candle before displacement.",
    minutes: 9,
    content: [
      { kind: "paragraph", text: "An Order Block (OB) is the last opposite-color candle before an impulsive move that breaks structure. A bullish OB is the last down-candle before a strong rally; a bearish OB is the last up-candle before a strong drop. Price often returns to mitigate the OB before continuing." },
      { kind: "list", items: [
        "Mark the OB candle's body (some use the full range incl. wick).",
        "Entry: on the return into the OB (limit or confirmation).",
        "Stop: beyond the far side of the OB.",
        "Target: the next liquidity pool / opposing OB.",
      ] },
      { kind: "callout", tone: "bull", title: "Valid OB checklist", text: "Last opposite candle + displacement/BOS away from it + unmitigated (price hasn't returned yet)." },
    ],
    examples: [
      { title: "Bullish OB → mitigation → continuation", candles: bullishOB, zones: bullishOBZone, markers: bullishOBMarkers, caption: "Price returns to the last down-candle, then rallies. Entry/SL/TP shown." },
    ],
    quiz: [
      q("ob-b-1", "A bullish order block is:", [["a", "The last up-candle before a drop"], ["b", "The last down-candle before a strong rally"], ["c", "Any green candle"], ["d", "A doji"]], ["b"], "Bullish OB = last down candle before bullish displacement."),
      q("ob-b-2", "Where do you place the stop on a bullish OB trade?", [["a", "Above the OB"], ["b", "At entry"], ["c", "Below the far (low) side of the OB"], ["d", "At equilibrium"]], ["c"], "Stop goes beyond the OB low so a true invalidation closes you out."),
    ],
  },
  {
    id: "ob-mitigation-breaker",
    moduleId: "order-block",
    title: "Mitigation & Breaker Blocks",
    summary: "Re-using zones and trading their failure.",
    minutes: 8,
    content: [
      { kind: "heading", text: "Mitigation Block" },
      { kind: "paragraph", text: "When price returns to an order block to 'mitigate' trapped orders before continuing, that re-test zone is the mitigation block. It offers a refined entry in the trend direction." },
      { kind: "heading", text: "Breaker Block" },
      { kind: "paragraph", text: "A breaker forms when an order block FAILS. Price breaks through it; the broken zone then flips role (old support becomes resistance) and offers an entry in the new direction." },
      { kind: "callout", tone: "warning", title: "OB vs Breaker", text: "An order block works WITH its original move; a breaker works AGAINST it (after the OB is violated)." },
    ],
    quiz: [
      q("ob-mb-1", "A breaker block forms when:", [["a", "An OB holds perfectly"], ["b", "An OB fails and the broken zone flips role"], ["c", "Volume dries up"], ["d", "A doji appears"]], ["b"], "A breaker is a failed OB whose zone flips to the opposite role."),
    ],
  },
];

export const orderBlockModule: Module = {
  id: "order-block",
  order: 4,
  title: "Order Blocks",
  subtitle: "Institutional footprints",
  description:
    "Identify bullish/bearish order blocks and trade mitigation and breaker blocks with precise entries, stops and targets.",
  icon: "🟦",
  level: "intermediate",
  lessons,
};
