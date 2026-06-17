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

// A swing low at ~99 to swing high at ~109. Equilibrium = 104.
const swing: Candle[] = [
  c(0, 99.2, 99.8, 99.0, 99.6),
  c(1, 99.6, 101.5, 99.4, 101.2),
  c(2, 101.2, 103.5, 101.0, 103.2),
  c(3, 103.2, 105.5, 103.0, 105.2),
  c(4, 105.2, 107.4, 105.0, 107.1),
  c(5, 107.1, 109.0, 106.9, 108.8), // swing high ~109
  c(6, 108.8, 109.0, 106.0, 106.2),
  c(7, 106.2, 106.4, 103.6, 103.8), // pullback to equilibrium/discount
];

const low = 99.0;
const high = 109.0;
const eq = (low + high) / 2; // 104
const zones = [
  { id: "premium", type: "premium" as const, startTime: t(0), endTime: t(7), top: high, bottom: eq, color: "#ef5350", label: "Premium (sell)" },
  { id: "discount", type: "discount" as const, startTime: t(0), endTime: t(7), top: eq, bottom: low, color: "#26a69a", label: "Discount (buy)" },
];
const eqLine = [{ price: eq, color: "#f5b041", title: "Equilibrium 50%" }];

const lessons: Lesson[] = [
  {
    id: "pd-fib",
    moduleId: "premium-discount",
    title: "Fibonacci Range & Equilibrium",
    summary: "Split any range into premium and discount.",
    minutes: 8,
    content: [
      { kind: "paragraph", text: "Draw a Fibonacci from a swing low to a swing high. The 50% level is Equilibrium — fair value. Everything above is Premium (expensive); everything below is Discount (cheap)." },
      { kind: "list", items: [
        "Premium zone (above 50%): look for SELLS.",
        "Discount zone (below 50%): look for BUYS.",
        "Equilibrium (50%): neutral — avoid initiating here.",
      ] },
      { kind: "callout", tone: "info", title: "OTE", text: "The Optimal Trade Entry is the 0.62–0.79 retracement — a deep discount (for longs) inside the range." },
    ],
    examples: [
      { title: "Premium / Discount split", candles: swing, zones, caption: "Above equilibrium = premium (sell); below = discount (buy)." },
    ],
    quiz: [
      q("pd-f-1", "Equilibrium is the:", [["a", "0% level"], ["b", "50% of the range"], ["c", "100% level"], ["d", "0.79 retracement"]], ["b"], "Equilibrium = the 50% midpoint of the dealing range."),
      q("pd-f-2", "In the discount zone you should look to:", [["a", "Sell"], ["b", "Buy"], ["c", "Do nothing"], ["d", "Close all trades"]], ["b"], "Discount = cheap = look for buys (in a bullish context)."),
    ],
  },
  {
    id: "pd-application",
    moduleId: "premium-discount",
    title: "Applying Premium & Discount",
    summary: "Combine with structure and order blocks.",
    minutes: 6,
    content: [
      { kind: "paragraph", text: "Premium/discount is a filter, not a signal on its own. Combine it: in a bullish trend, wait for price to pull back into discount AND tag an order block / FVG before buying." },
      { kind: "do-dont", works: [
        "Buying a discount order block in an uptrend",
        "Selling a premium FVG in a downtrend",
        "Using equilibrium as a partial-target",
      ], fails: [
        "Buying in premium in an uptrend (chasing)",
        "Ignoring higher-timeframe range boundaries",
        "Forcing trades at equilibrium",
      ] },
    ],
    quiz: [
      q("pd-a-1", "Best practice in a bullish trend is to buy:", [["a", "In premium"], ["b", "At equilibrium"], ["c", "In discount at an OB/FVG"], ["d", "At the high"]], ["c"], "Buy discount + confluence (OB/FVG) for a low-risk entry."),
    ],
  },
];

export { eqLine };

export const premiumDiscountModule: Module = {
  id: "premium-discount",
  order: 6,
  title: "Premium & Discount",
  subtitle: "Buy cheap, sell expensive",
  description:
    "Use Fibonacci, equilibrium and premium/discount zones to only take trades at favourable prices.",
  icon: "⚖️",
  level: "advanced",
  lessons,
};
