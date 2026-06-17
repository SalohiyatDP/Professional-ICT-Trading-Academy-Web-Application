import type { ChartMarker, Lesson, Module, QuizQuestion } from "@/types";
import { uptrendSeries, downtrendSeries, rangeSeries } from "@/lib/candleData";
import { labelStructure } from "@/lib/marketStructure";
import { uid } from "@/lib/utils";

const up = uptrendSeries();
const down = downtrendSeries();
const range = rangeSeries();

const upMarkers = labelStructure(up);
const downMarkers = labelStructure(down);

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

// Build a simple BOS marker for the uptrend example: mark the candle that closes
// above the previous swing high.
const bosMarker: ChartMarker[] = (() => {
  const highs = upMarkers.filter((m) => m.kind === "HH");
  if (highs.length < 2) return [];
  const ref = highs[highs.length - 2];
  const broken = up.find((c) => c.time > ref.time && c.close > ref.price);
  return broken
    ? [{ id: uid("bos"), time: broken.time, price: broken.high, kind: "bos", text: "BOS", color: "#2962ff" }]
    : [];
})();

const lessons: Lesson[] = [
  {
    id: "ms-swings",
    moduleId: "market-structure",
    title: "Swing Points: HH, HL, LH, LL",
    summary: "The four building blocks of market structure.",
    minutes: 8,
    content: [
      { kind: "paragraph", text: "Markets move in swings. Naming each swing relative to the previous one of its type defines the trend:" },
      { kind: "list", items: [
        "Higher High (HH) — a swing high above the prior high.",
        "Higher Low (HL) — a swing low above the prior low.",
        "Lower High (LH) — a swing high below the prior high.",
        "Lower Low (LL) — a swing low below the prior low.",
      ] },
      { kind: "callout", tone: "bull", title: "Uptrend = HH + HL", text: "A series of higher highs and higher lows defines a bullish structure." },
      { kind: "callout", tone: "bear", title: "Downtrend = LH + LL", text: "A series of lower highs and lower lows defines a bearish structure." },
    ],
    examples: [
      { title: "Uptrend structure (auto-labelled)", candles: up, markers: upMarkers, caption: "Higher highs and higher lows stack upward." },
    ],
    quiz: [
      q("ms-sw-1", "An uptrend is defined by:", [["a", "LH and LL"], ["b", "HH and HL"], ["c", "Equal highs"], ["d", "Random swings"]], ["b"], "Uptrend = higher highs + higher lows."),
      q("ms-sw-2", "A swing low above the previous swing low is a:", [["a", "Lower Low"], ["b", "Higher Low"], ["c", "Lower High"], ["d", "Higher High"]], ["b"], "That is a Higher Low (HL)."),
    ],
  },
  {
    id: "ms-trends",
    moduleId: "market-structure",
    title: "Trends: Uptrend, Downtrend, Range",
    summary: "Classify the environment before you trade.",
    minutes: 7,
    content: [
      { kind: "paragraph", text: "Every chart is in one of three states. Identify it first — your bias and setups depend on it." },
      { kind: "list", items: [
        "Uptrend: buy pullbacks into discount (HL areas).",
        "Downtrend: sell rallies into premium (LH areas).",
        "Range: fade the edges (sell highs / buy lows) until a break.",
      ] },
    ],
    examples: [
      { title: "Downtrend", candles: down, markers: downMarkers, caption: "Lower highs and lower lows." },
      { title: "Range", candles: range, caption: "Price oscillates between horizontal boundaries." },
    ],
    quiz: [
      q("ms-tr-1", "In a clean downtrend you should prefer to:", [["a", "Buy dips"], ["b", "Sell rallies into premium"], ["c", "Hold longs"], ["d", "Avoid all trades"]], ["b"], "Trade with the trend — sell rallies into premium (LH)."),
    ],
  },
  {
    id: "ms-bos-choch",
    moduleId: "market-structure",
    title: "BOS & CHoCH",
    summary: "Continuation vs the first sign of reversal.",
    minutes: 9,
    content: [
      { kind: "heading", text: "Break of Structure (BOS)" },
      { kind: "paragraph", text: "A BOS confirms continuation: in an uptrend, a candle closes above the prior swing high. It says the dominant order flow is intact." },
      { kind: "heading", text: "Change of Character (CHoCH)" },
      { kind: "paragraph", text: "A CHoCH is the first break against the trend — in an uptrend, price closes below the most recent higher-low. It warns the trend may be ending and often precedes a reversal." },
      { kind: "callout", tone: "info", title: "Sequence", text: "Reversals usually go: liquidity sweep → CHoCH (MSS) → pullback → new BOS in the new direction." },
    ],
    examples: [
      { title: "BOS in an uptrend", candles: up, markers: [...upMarkers, ...bosMarker], caption: "Close above the prior swing high confirms continuation." },
    ],
    quiz: [
      q("ms-bc-1", "A CHoCH in an uptrend is:", [["a", "A close above the last high"], ["b", "A close below the last higher-low"], ["c", "A doji"], ["d", "A new HH"]], ["b"], "CHoCH = first break against the trend (below the last HL)."),
      q("ms-bc-2", "A BOS signals:", [["a", "Reversal"], ["b", "Trend continuation"], ["c", "Indecision"], ["d", "Low liquidity"]], ["b"], "BOS confirms the trend is continuing."),
    ],
  },
  {
    id: "ms-internal-external",
    moduleId: "market-structure",
    title: "Internal vs External Structure",
    summary: "Fractal structure: the swings inside the swings.",
    minutes: 7,
    content: [
      { kind: "paragraph", text: "External structure is the major swing high-to-low range (the higher-timeframe move). Internal structure is the smaller pullback structure that forms inside that range." },
      { kind: "list", items: [
        "Trade internal structure shifts in the direction of external structure.",
        "An internal CHoCH inside a discount zone can signal the next external leg up.",
        "Market Shift = when internal structure flips and aligns to drive external structure.",
      ] },
    ],
    quiz: [
      q("ms-ie-1", "Internal structure refers to:", [["a", "The major HTF swing range"], ["b", "Smaller pullback structure inside the major range"], ["c", "Volume profile"], ["d", "The daily open"]], ["b"], "Internal = the smaller structure inside the larger external swing."),
    ],
  },
];

export const marketStructureModule: Module = {
  id: "market-structure",
  order: 2,
  title: "Market Structure",
  subtitle: "How price actually moves",
  description:
    "Read swings, classify trends, and time entries with Break of Structure and Change of Character.",
  icon: "📈",
  level: "beginner",
  lessons,
};
