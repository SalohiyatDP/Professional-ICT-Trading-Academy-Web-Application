import type { ModuleId, TutorMessage } from "@/types";
import { uid } from "./utils";

/**
 * 100% offline "AI" tutor.
 * A curated knowledge base + keyword scoring engine. No network, deterministic.
 */

interface KnowledgeEntry {
  keywords: string[];
  topic: string;
  answer: string;
  related?: { moduleId: ModuleId; lessonId?: string }[];
}

const KB: KnowledgeEntry[] = [
  {
    keywords: ["order block", "ob", "orderblock", "bullish order block", "bearish order block"],
    topic: "Order Block",
    answer:
      "An Order Block is the last opposite-color candle before an impulsive move that breaks structure. A bullish OB is the last down-candle before a strong rally; a bearish OB is the last up-candle before a strong sell-off. Institutions leave unfilled orders there, so price often returns to 'mitigate' the zone before continuing. Entry: mark the OB body (or 50% / open), set stop beyond the candle's wick, and target the next liquidity pool.",
    related: [{ moduleId: "order-block" }],
  },
  {
    keywords: ["fvg", "fair value gap", "imbalance", "gap", "inversion fvg"],
    topic: "Fair Value Gap (FVG)",
    answer:
      "A Fair Value Gap is a 3-candle imbalance where the wicks of candle 1 and candle 3 do not overlap, leaving an inefficiency. Bullish FVG forms in up-moves (gap between candle-1 high and candle-3 low); bearish FVG in down-moves. Price tends to return to fill at least 50% of the gap (the Consequent Encroachment). An Inversion FVG is a gap that gets violated and then flips polarity to act as support/resistance.",
    related: [{ moduleId: "fvg" }],
  },
  {
    keywords: ["bos", "break of structure", "break structure"],
    topic: "Break of Structure (BOS)",
    answer:
      "Break of Structure confirms trend continuation: in an uptrend a BOS is a close above the prior swing high; in a downtrend a close below the prior swing low. It tells you the dominant order flow is intact. Wait for the BOS, then look for an entry on the pullback into an order block or FVG.",
    related: [{ moduleId: "market-structure" }],
  },
  {
    keywords: ["choch", "change of character", "character", "mss", "market structure shift"],
    topic: "Change of Character (CHoCH / MSS)",
    answer:
      "Change of Character is the first sign of a possible reversal: price breaks the most recent opposing swing against the prevailing trend (e.g. in an uptrend it breaks the last higher-low). A Market Structure Shift (MSS) is an aggressive CHoCH, usually paired with a liquidity sweep + displacement. It precedes new BOS prints in the new direction.",
    related: [{ moduleId: "market-structure" }, { moduleId: "entry-models" }],
  },
  {
    keywords: ["liquidity", "buy side", "sell side", "bsl", "ssl", "stop hunt", "sweep", "grab", "equal highs", "equal lows"],
    topic: "Liquidity",
    answer:
      "Liquidity is resting orders (stops) the market needs to fill big positions. Buy-side liquidity sits above equal highs / swing highs; sell-side sits below equal lows / swing lows. A Liquidity Sweep / Stop Hunt is when price spikes through those levels to trigger stops, then reverses. ICT setups often begin with a sweep of liquidity followed by a structure shift.",
    related: [{ moduleId: "liquidity" }],
  },
  {
    keywords: ["premium", "discount", "equilibrium", "fibonacci", "fib", "ote", "optimal trade entry"],
    topic: "Premium & Discount",
    answer:
      "Draw a Fibonacci from a swing low to swing high. The 50% line is Equilibrium. Above 50% is the Premium zone (expensive, look to sell); below 50% is the Discount zone (cheap, look to buy). The Optimal Trade Entry (OTE) is roughly the 0.62-0.79 retracement. Buy in discount, sell in premium.",
    related: [{ moduleId: "premium-discount" }],
  },
  {
    keywords: ["doji", "indecision"],
    topic: "Doji",
    answer:
      "A Doji has an open and close at virtually the same price, showing indecision. It only matters in context: at the top of an extended move or at a key level it can warn of a reversal. On its own, in the middle of a range, it is noise.",
    related: [{ moduleId: "candlesticks" }],
  },
  {
    keywords: ["hammer", "pin bar", "rejection"],
    topic: "Hammer",
    answer:
      "A Hammer is a bullish reversal candle: small body at the top with a long lower wick (2x+ body), appearing after a downtrend. The long wick shows sellers were rejected. Confirmation: a bullish close on the next candle, ideally at a discount level or order block.",
    related: [{ moduleId: "candlesticks" }],
  },
  {
    keywords: ["engulfing", "engulf"],
    topic: "Engulfing Pattern",
    answer:
      "A Bullish Engulfing is a large up-candle whose body fully covers the prior down-candle's body — buyers overwhelmed sellers. Bearish Engulfing is the opposite. They are most reliable at swing points after a liquidity sweep, not mid-range.",
    related: [{ moduleId: "candlesticks" }],
  },
  {
    keywords: ["risk", "position size", "lot", "rr", "risk reward", "drawdown", "money management"],
    topic: "Risk Management",
    answer:
      "Risk a fixed small % per trade (commonly 0.5-1%). Position size = (Account x Risk%) / Stop distance. Always know your R:R before entry — aim for at least 1:2. Use a daily loss limit (e.g. 3 trades) and weekly/monthly caps to survive drawdowns. Use the built-in calculators under Risk Management.",
    related: [{ moduleId: "risk-management" }],
  },
  {
    keywords: ["judas", "judas swing", "false move", "manipulation"],
    topic: "Judas Swing",
    answer:
      "The Judas Swing is a false move at the start of a session (often London) that runs liquidity in the wrong direction to trap traders, before reversing into the true daily direction. Wait for the sweep + structure shift, then enter on the retracement.",
    related: [{ moduleId: "entry-models" }],
  },
  {
    keywords: ["kill zone", "killzone", "london", "new york", "session", "smt", "divergence"],
    topic: "Kill Zones & SMT",
    answer:
      "Kill Zones are high-probability time windows: London (approx 02:00-05:00 EST) and New York (approx 07:00-10:00 EST). SMT Divergence compares correlated pairs/indices — when one makes a higher high but the correlated one fails, it signals a likely reversal. Combine kill-zone timing with a liquidity sweep and FVG/OB entry.",
    related: [{ moduleId: "entry-models" }],
  },
  {
    keywords: ["breaker", "breaker block", "mitigation block"],
    topic: "Breaker & Mitigation Blocks",
    answer:
      "A Mitigation Block is an order block that price returns to in order to 'mitigate' trapped orders before continuing. A Breaker Block forms when an order block fails: price breaks through it, then that broken zone flips to the opposite role (old support becomes resistance) and offers an entry.",
    related: [{ moduleId: "order-block" }],
  },
];

const GREETINGS = ["hi", "hello", "salom", "hey", "assalom"];

export function answerQuestion(question: string): TutorMessage {
  const q = question.toLowerCase();

  if (GREETINGS.some((g) => q.split(/\s+/).includes(g))) {
    return tutorMsg(
      "Salom! I'm your offline ICT tutor. Ask me about order blocks, FVG, liquidity, market structure, premium/discount, entry models, or risk management."
    );
  }

  // Score each KB entry by keyword hits (longer keywords weigh more).
  let best: KnowledgeEntry | null = null;
  let bestScore = 0;
  for (const entry of KB) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best && bestScore > 0) {
    return tutorMsg(`**${best.topic}**\n\n${best.answer}`, best.related);
  }

  // Fallback: list available topics.
  const topics = [...new Set(KB.map((k) => k.topic))].join(", ");
  return tutorMsg(
    `I couldn't match that to a specific concept. Try asking about one of these: ${topics}. You can also describe a chart situation (e.g. "price swept the highs then dropped — what is that?").`
  );
}

function tutorMsg(
  text: string,
  related?: { moduleId: ModuleId; lessonId?: string }[]
): TutorMessage {
  return {
    id: uid("tutor"),
    role: "tutor",
    text,
    createdAt: Date.now(),
    related,
  };
}

/** Suggested starter prompts for the UI. */
export const tutorSuggestions = [
  "What is an order block?",
  "Explain Fair Value Gap",
  "Difference between BOS and CHoCH?",
  "How do I find liquidity?",
  "What is premium and discount?",
  "How should I size my position?",
];
