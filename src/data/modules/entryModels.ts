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

// Sweep low -> MSS up -> retrace to FVG -> long
const sweepMss: Candle[] = [
  c(0, 102, 102.4, 101.4, 101.6),
  c(1, 101.6, 101.8, 100.6, 100.8),
  c(2, 100.8, 101.0, 99.2, 99.5), // swing low
  c(3, 99.5, 99.7, 98.4, 98.7), // sweep below the low (SSL grab)
  c(4, 98.7, 102.0, 98.6, 101.9), // displacement up = MSS / CHoCH
  c(5, 101.9, 102.2, 100.4, 100.6), // retrace into FVG
  c(6, 100.6, 103.6, 100.5, 103.4), // continuation
];
const sweepMssMarkers = [
  { id: "sm-sweep", time: t(3), price: 98.4, kind: "sweep" as const, text: "Sweep SSL", color: "#f5b041" },
  { id: "sm-mss", time: t(4), price: 102.0, kind: "choch" as const, text: "MSS", color: "#2962ff" },
  { id: "sm-entry", time: t(5), price: 100.6, kind: "entry" as const, text: "Entry (FVG)", color: "#2962ff" },
];
const sweepMssZones = [
  { id: "sm-fvg", type: "fvg" as const, startTime: t(4), endTime: t(6), top: 100.6, bottom: 99.7, color: "#2962ff", label: "FVG entry" },
];

const lessons: Lesson[] = [
  {
    id: "em-sweep-mss",
    moduleId: "entry-models",
    title: "Liquidity Sweep + MSS",
    summary: "The core ICT reversal entry.",
    minutes: 10,
    content: [
      { kind: "paragraph", text: "The bread-and-butter ICT model: price sweeps a liquidity pool (runs stops), then prints a Market Structure Shift (an aggressive CHoCH with displacement). You enter on the retracement into the resulting FVG or order block." },
      { kind: "list", items: [
        "1. Identify the liquidity to be taken (equal lows / swing low).",
        "2. Wait for the sweep + displacement (MSS).",
        "3. Mark the FVG / OB left by the displacement.",
        "4. Enter on the retrace; stop beyond the sweep; target opposing liquidity.",
      ] },
    ],
    examples: [
      { title: "Sweep low → MSS → FVG entry", candles: sweepMss, zones: sweepMssZones, markers: sweepMssMarkers, caption: "Stops below the low are swept, structure shifts up, entry on the FVG retrace." },
    ],
    quiz: [
      q("em-sm-1", "In a sweep+MSS long, the stop goes:", [["a", "At equilibrium"], ["b", "Below the sweep low"], ["c", "Above the entry"], ["d", "At the FVG top"]], ["b"], "Stop sits beyond the sweep low — that's the invalidation."),
    ],
  },
  {
    id: "em-ob-fvg",
    moduleId: "entry-models",
    title: "Order Block & FVG Entries",
    summary: "Two precise entry zones from displacement.",
    minutes: 8,
    content: [
      { kind: "paragraph", text: "After a structure shift, the displacement leaves behind an order block and often an FVG. Both are valid entry zones. The FVG gives a slightly deeper, often better-priced entry; the OB gives a structural one. Many traders use the overlap of OB + FVG for the highest-probability entry." },
    ],
    quiz: [
      q("em-of-1", "The highest-probability entry zone is often:", [["a", "A random retrace"], ["b", "Where an OB and FVG overlap"], ["c", "At the high"], ["d", "At equilibrium only"]], ["b"], "OB + FVG confluence stacks two reasons price reverses there."),
    ],
  },
  {
    id: "em-smt-judas",
    moduleId: "entry-models",
    title: "SMT Divergence & Judas Swing",
    summary: "Inter-market divergence and session manipulation.",
    minutes: 9,
    content: [
      { kind: "heading", text: "SMT Divergence" },
      { kind: "paragraph", text: "Compare two correlated markets (e.g. ES vs NQ, or EURUSD vs GBPUSD). When one makes a higher high but the correlated one fails to, that divergence signals weak momentum and a likely reversal — often at a liquidity sweep." },
      { kind: "heading", text: "Judas Swing" },
      { kind: "paragraph", text: "A false move at the start of a session (commonly London) that runs liquidity the WRONG way to trap traders, before reversing into the true daily direction." },
    ],
    quiz: [
      q("em-sj-1", "A Judas Swing is:", [["a", "A confirmed trend"], ["b", "A false early-session move that traps traders"], ["c", "A type of order block"], ["d", "A risk model"]], ["b"], "Judas swing = false session move to grab liquidity before the real move."),
    ],
  },
  {
    id: "em-killzones",
    moduleId: "entry-models",
    title: "London & New York Kill Zones",
    summary: "Trade when liquidity and volatility peak.",
    minutes: 7,
    content: [
      { kind: "list", items: [
        "London Kill Zone: ~02:00–05:00 EST — often sets the day's direction.",
        "New York Kill Zone: ~07:00–10:00 EST — strong continuation or reversal.",
        "Avoid low-liquidity periods (lunch, late session) for fresh entries.",
      ] },
      { kind: "callout", tone: "info", title: "Time + price", text: "ICT setups combine the right TIME (kill zone) with the right PRICE (PD array: OB/FVG in premium/discount)." },
    ],
    quiz: [
      q("em-kz-1", "Kill zones are valuable because they offer:", [["a", "Lower volatility"], ["b", "Concentrated liquidity & volatility windows"], ["c", "Guaranteed profits"], ["d", "No spreads"]], ["b"], "Kill zones concentrate liquidity and volatility into known windows."),
    ],
  },
];

export const entryModelsModule: Module = {
  id: "entry-models",
  order: 7,
  title: "ICT Entry Models",
  subtitle: "Putting the pieces together",
  description:
    "Combine liquidity, structure shifts, order blocks and FVGs into repeatable entry models — plus SMT, Judas swing and kill zones.",
  icon: "🎯",
  level: "advanced",
  lessons,
};
