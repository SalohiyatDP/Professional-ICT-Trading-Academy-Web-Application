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

// Bullish FVG: candle1 high < candle3 low -> gap between them.
const bullishFVG: Candle[] = [
  c(0, 100, 100.4, 99.6, 100.1),
  c(1, 100.1, 100.6, 99.8, 100.3), // candle 1: high = 100.6
  c(2, 100.5, 103.2, 100.4, 103.0), // candle 2: displacement
  c(3, 103.0, 103.6, 101.2, 103.2), // candle 3: low = 101.2 (> 100.6 => gap)
  c(4, 103.2, 103.4, 100.7, 101.0), // returns to fill FVG
  c(5, 101.0, 104.2, 100.9, 104.0), // continuation up
];
// FVG zone = between candle1.high (100.6) and candle3.low (101.2)
const bullishFVGZone = [
  {
    id: "fvg-bull",
    type: "fvg" as const,
    startTime: t(1),
    endTime: t(5),
    top: 101.2,
    bottom: 100.6,
    color: "#2962ff",
    label: "Bullish FVG",
  },
];

const lessons: Lesson[] = [
  {
    id: "fvg-basics",
    moduleId: "fvg",
    title: "What Is a Fair Value Gap?",
    summary: "A 3-candle imbalance the market wants to rebalance.",
    minutes: 8,
    content: [
      { kind: "paragraph", text: "A Fair Value Gap (FVG) is a 3-candle pattern where the first and third candles' wicks do NOT overlap, leaving a price gap created by an aggressive, one-sided move (displacement)." },
      { kind: "list", items: [
        "Bullish FVG: gap between candle-1 high and candle-3 low (forms in up-moves).",
        "Bearish FVG: gap between candle-1 low and candle-3 high (forms in down-moves).",
        "Price often returns to fill at least 50% (the Consequent Encroachment).",
      ] },
      { kind: "callout", tone: "info", title: "Why it matters", text: "An FVG marks inefficiency. The market tends to revisit it to deliver price 'fairly', giving you an entry zone." },
    ],
    examples: [
      { title: "Bullish FVG → fill → continuation", candles: bullishFVG, zones: bullishFVGZone, caption: "Gap between candle-1 high and candle-3 low; price returns to fill, then continues up." },
    ],
    quiz: [
      q("fvg-b-1", "A Fair Value Gap is formed by:", [["a", "1 candle"], ["b", "2 candles"], ["c", "3 candles with non-overlapping wicks"], ["d", "5 candles"]], ["c"], "FVG = 3-candle imbalance where candle 1 and 3 wicks do not overlap."),
      q("fvg-b-2", "A bullish FVG is the gap between:", [["a", "Candle-1 low and candle-3 high"], ["b", "Candle-1 high and candle-3 low"], ["c", "Two equal highs"], ["d", "Open and close"]], ["b"], "Bullish FVG = candle-1 high to candle-3 low."),
    ],
  },
  {
    id: "fvg-inversion",
    moduleId: "fvg",
    title: "Inversion FVG",
    summary: "When a gap is violated and flips polarity.",
    minutes: 6,
    content: [
      { kind: "paragraph", text: "An Inversion FVG (IFVG) occurs when an FVG is traded through and closed beyond, invalidating it. The gap then flips role: a failed bullish FVG becomes resistance (now bearish), and vice-versa." },
      { kind: "callout", tone: "warning", title: "Confirmation matters", text: "Wait for a candle body to close through the FVG before treating it as inverted — a wick alone is not enough." },
    ],
    quiz: [
      q("fvg-i-1", "An inversion FVG happens when:", [["a", "Price fills 50% of the gap"], ["b", "Price closes through the gap, flipping its role"], ["c", "Volume spikes"], ["d", "Two FVGs overlap"]], ["b"], "A violated (closed-through) FVG flips polarity = inversion FVG."),
    ],
  },
];

export const fvgModule: Module = {
  id: "fvg",
  order: 5,
  title: "Fair Value Gap (FVG)",
  subtitle: "Trading market inefficiency",
  description:
    "Spot bullish/bearish FVGs, understand 50% fills, and trade inversion FVGs when gaps flip polarity.",
  icon: "🟪",
  level: "intermediate",
  lessons,
};
