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

// Equal highs then a sweep above them and reversal.
const equalHighsSweep: Candle[] = [
  c(0, 100, 101, 99.5, 100.8),
  c(1, 100.8, 103, 100.5, 102.8), // high ~103
  c(2, 102.8, 103.05, 101, 101.4), // equal high ~103
  c(3, 101.4, 103.02, 100.8, 102.6), // equal high ~103
  c(4, 102.6, 104.4, 102.4, 102.7), // sweep above equal highs
  c(5, 102.7, 102.9, 99.6, 99.9), // reversal down
  c(6, 99.9, 100.2, 97.8, 98.1),
];

const equalHighsMarkers = [
  { id: "eqh-sweep", time: t(4), price: 104.4, kind: "sweep" as const, text: "Sweep BSL", color: "#f5b041" },
];
const equalHighsZones = [
  {
    id: "bsl",
    type: "liquidity" as const,
    startTime: t(1),
    endTime: t(4),
    top: 103.1,
    bottom: 102.9,
    color: "#f5b041",
    label: "Buy-side liquidity (equal highs)",
  },
];

const lessons: Lesson[] = [
  {
    id: "lq-what",
    moduleId: "liquidity",
    title: "What Is Liquidity?",
    summary: "Resting orders the market needs to fill big positions.",
    minutes: 7,
    content: [
      { kind: "paragraph", text: "Liquidity is clusters of resting orders — mostly stop-losses and pending orders. Large players need this liquidity to fill size without excessive slippage, so price is repeatedly drawn toward it." },
      { kind: "list", items: [
        "Buy-side liquidity (BSL): buy stops resting ABOVE highs (short stops, breakout buys).",
        "Sell-side liquidity (SSL): sell stops resting BELOW lows (long stops, breakout sells).",
      ] },
      { kind: "callout", tone: "info", title: "Think like the bank", text: "Ask: where are the obvious stops? Price often travels there before reversing." },
    ],
    quiz: [
      q("lq-w-1", "Buy-side liquidity rests:", [["a", "Below swing lows"], ["b", "Above swing highs"], ["c", "At the open"], ["d", "Mid-range"]], ["b"], "Buy stops rest above highs = buy-side liquidity."),
    ],
  },
  {
    id: "lq-equal",
    moduleId: "liquidity",
    title: "Equal Highs & Equal Lows",
    summary: "Obvious liquidity magnets.",
    minutes: 6,
    content: [
      { kind: "paragraph", text: "When price prints two or more highs (or lows) at the same level, stops pile up just beyond them. These equal highs/lows are high-probability liquidity targets." },
    ],
    examples: [
      { title: "Equal highs → sweep", candles: equalHighsSweep, zones: equalHighsZones, markers: equalHighsMarkers, caption: "Stops above the equal highs are swept, then price reverses." },
    ],
    quiz: [
      q("lq-e-1", "Equal highs attract price because:", [["a", "They are random"], ["b", "Stops accumulate just above them"], ["c", "Volume is low"], ["d", "They are support"]], ["b"], "Equal highs = obvious resting buy-side liquidity above them."),
    ],
  },
  {
    id: "lq-sweep",
    moduleId: "liquidity",
    title: "Liquidity Grab, Sweep & Stop Hunt",
    summary: "The spike-and-reverse that starts ICT setups.",
    minutes: 8,
    content: [
      { kind: "paragraph", text: "A liquidity sweep (a.k.a. grab or stop hunt) is when price briefly trades through a high/low to trigger stops, then sharply reverses. The wick beyond the level — with an immediate rejection — is the tell." },
      { kind: "do-dont", works: [
        "Sweep into a higher-timeframe level / order block",
        "Sweep followed by an immediate CHoCH / displacement",
        "Sweep during a kill zone",
      ], fails: [
        "Treating every wick as a sweep",
        "Fading a sweep with no structure shift",
        "Ignoring the higher-timeframe trend",
      ] },
    ],
    examples: [
      { title: "Stop hunt above equal highs", candles: equalHighsSweep, zones: equalHighsZones, markers: equalHighsMarkers, caption: "Price spikes above liquidity, then reverses hard." },
    ],
    quiz: [
      q("lq-s-1", "A liquidity sweep is best confirmed by:", [["a", "A close far beyond the level"], ["b", "An immediate rejection + structure shift"], ["c", "Low volume"], ["d", "A doji days later"]], ["b"], "Sweep + immediate rejection and CHoCH/displacement confirms intent."),
      q("lq-s-2", "A stop hunt below a swing low targets:", [["a", "Buy-side liquidity"], ["b", "Sell-side liquidity"], ["c", "Equilibrium"], ["d", "The open"]], ["b"], "Below lows sit sell stops = sell-side liquidity."),
    ],
  },
];

export const liquidityModule: Module = {
  id: "liquidity",
  order: 3,
  title: "Liquidity",
  subtitle: "Where the stops live",
  description:
    "Find buy-side and sell-side liquidity, spot equal highs/lows, and recognise sweeps and stop hunts.",
  icon: "💧",
  level: "intermediate",
  lessons,
};
