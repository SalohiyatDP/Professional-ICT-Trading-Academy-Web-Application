import type { Lesson, Module, QuizQuestion } from "@/types";
import { candlePatterns } from "@/lib/candleData";

function q(
  id: string,
  prompt: string,
  options: [string, string][],
  correct: string[],
  explanation: string,
  type: QuizQuestion["type"] = "single"
): QuizQuestion {
  return {
    id,
    type,
    prompt,
    explanation,
    options: options.map(([oid, text]) => ({ id: oid, text })),
    correct,
    points: 1,
  };
}

const lessons: Lesson[] = [
  {
    id: "cs-anatomy",
    moduleId: "candlesticks",
    title: "Candle Anatomy: Body & Wicks",
    summary: "Open, high, low, close and what the body/wick tell you.",
    minutes: 6,
    content: [
      { kind: "paragraph", text: "Every candlestick encodes four prices for a time period: Open, High, Low and Close (OHLC). The thick part is the body (open-to-close) and the thin lines are wicks (or shadows) reaching the high and low." },
      { kind: "list", items: [
        "Body = distance between open and close.",
        "Upper wick = rejection of higher prices.",
        "Lower wick = rejection of lower prices.",
        "Green/teal body = close above open (bullish).",
        "Red body = close below open (bearish).",
      ] },
      { kind: "callout", tone: "info", title: "Context is everything", text: "A single candle rarely means much. Always read candles relative to structure, liquidity and the trend." },
    ],
    examples: [
      { title: "Strong bullish candle", candles: candlePatterns.bullish, caption: "Large body, close near the high — buyers in control." },
    ],
    quiz: [
      q("cs-anatomy-1", "Which prices does a candlestick encode?", [["a", "Only open and close"], ["b", "Open, High, Low, Close"], ["c", "High and Low only"], ["d", "Volume and price"]], ["b"], "A candle encodes OHLC for its period."),
    ],
  },
  {
    id: "cs-bullish-bearish",
    moduleId: "candlesticks",
    title: "Bullish & Bearish Candles",
    summary: "Reading momentum from body size and close location.",
    minutes: 6,
    content: [
      { kind: "paragraph", text: "A bullish candle closes above its open; a bearish candle closes below. Big bodies with small wicks signal strong, one-directional momentum (displacement). Small bodies signal hesitation." },
      { kind: "do-dont", works: [
        "After a liquidity sweep at a key level",
        "When the body shows clear displacement (BOS)",
        "Aligned with the higher-timeframe trend",
      ], fails: [
        "In the middle of a tight range (noise)",
        "Against a strong higher-timeframe trend",
        "When volume/conviction is absent",
      ] },
    ],
    examples: [
      { title: "Bullish candle", candles: candlePatterns.bullish, caption: "Close near high = strong demand." },
      { title: "Bearish candle", candles: candlePatterns.bearish, caption: "Close near low = strong supply." },
    ],
    quiz: [
      q("cs-bb-1", "A large bullish body with tiny wicks usually means:", [["a", "Indecision"], ["b", "Strong buying momentum"], ["c", "A reversal is guaranteed"], ["d", "Low volume"]], ["b"], "A big body with small wicks shows directional conviction (displacement)."),
    ],
  },
  {
    id: "cs-doji",
    moduleId: "candlesticks",
    title: "Doji — Indecision",
    summary: "When buyers and sellers reach a standstill.",
    minutes: 5,
    content: [
      { kind: "paragraph", text: "A Doji opens and closes at nearly the same price, producing a tiny body. It reflects equilibrium between buyers and sellers. At the end of a trend or at a key level it can warn of a pause or reversal." },
      { kind: "callout", tone: "warning", title: "Doji needs location", text: "A doji mid-range is meaningless. A doji at a premium/discount extreme after a sweep is a genuine warning." },
    ],
    examples: [{ title: "Doji", candles: candlePatterns.doji, caption: "Open ≈ close. Indecision." }],
    quiz: [
      q("cs-doji-1", "A Doji primarily signals:", [["a", "Strong trend"], ["b", "Indecision / equilibrium"], ["c", "High volume"], ["d", "A confirmed reversal"]], ["b"], "Doji = open and close nearly equal = indecision."),
    ],
  },
  {
    id: "cs-hammer-family",
    moduleId: "candlesticks",
    title: "Hammer, Inverted Hammer, Hanging Man & Shooting Star",
    summary: "The single-candle rejection family and their contexts.",
    minutes: 9,
    content: [
      { kind: "heading", text: "Same shapes, different context" },
      { kind: "list", items: [
        "Hammer: long lower wick, small body on top — bullish reversal after a downtrend.",
        "Inverted Hammer: long upper wick after a downtrend — potential bullish reversal (needs confirmation).",
        "Hanging Man: looks like a hammer but at the top of an uptrend — bearish warning.",
        "Shooting Star: long upper wick at the top of an uptrend — bearish reversal.",
      ] },
      { kind: "callout", tone: "info", title: "Wick = rejection", text: "The long wick shows price was pushed to an extreme then rejected. Direction of meaning depends on where it forms." },
    ],
    examples: [
      { title: "Hammer (bottom)", candles: candlePatterns.hammer, caption: "Long lower wick rejects lows after a drop." },
      { title: "Inverted Hammer", candles: candlePatterns["inverted-hammer"], caption: "Long upper wick after a downtrend." },
      { title: "Shooting Star (top)", candles: candlePatterns["shooting-star"], caption: "Long upper wick rejects highs after a rally." },
      { title: "Hanging Man (top)", candles: candlePatterns["hanging-man"], caption: "Hammer shape but at the top — bearish warning." },
    ],
    quiz: [
      q("cs-hf-1", "A long-lower-wick candle at the TOP of an uptrend is a:", [["a", "Hammer"], ["b", "Hanging Man"], ["c", "Shooting Star"], ["d", "Doji"]], ["b"], "Same shape as a hammer but at the top = Hanging Man (bearish warning)."),
      q("cs-hf-2", "A Shooting Star forms:", [["a", "After a downtrend"], ["b", "After an uptrend with a long upper wick"], ["c", "In a range only"], ["d", "With a long lower wick"]], ["b"], "Shooting star = long upper wick at the top of an uptrend."),
    ],
  },
  {
    id: "cs-engulfing",
    moduleId: "candlesticks",
    title: "Engulfing Patterns",
    summary: "Two-candle momentum shifts at key levels.",
    minutes: 7,
    content: [
      { kind: "paragraph", text: "A Bullish Engulfing is a large up-candle whose body fully covers the prior down-candle's body — demand overwhelmed supply. Bearish Engulfing is the mirror image. Most reliable at swing points after liquidity has been taken." },
    ],
    examples: [
      { title: "Bullish Engulfing", candles: candlePatterns["bullish-engulfing"], caption: "Up-candle engulfs prior down-candle body." },
      { title: "Bearish Engulfing", candles: candlePatterns["bearish-engulfing"], caption: "Down-candle engulfs prior up-candle body." },
    ],
    quiz: [
      q("cs-eng-1", "A bullish engulfing is strongest when it appears:", [["a", "Mid-range"], ["b", "At a swing low after a liquidity sweep"], ["c", "On low volume"], ["d", "Against the trend randomly"]], ["b"], "Location matters — at a swing low/sweep it has real meaning."),
    ],
  },
  {
    id: "cs-stars",
    moduleId: "candlesticks",
    title: "Morning Star & Evening Star",
    summary: "Three-candle reversal formations.",
    minutes: 7,
    content: [
      { kind: "list", items: [
        "Morning Star (bullish): big down-candle, small indecision candle, big up-candle.",
        "Evening Star (bearish): big up-candle, small indecision candle, big down-candle.",
        "The middle 'star' shows momentum stalling before the reversal candle confirms.",
      ] },
    ],
    examples: [
      { title: "Morning Star", candles: candlePatterns["morning-star"], caption: "Down → indecision → strong up. Bullish reversal." },
      { title: "Evening Star", candles: candlePatterns["evening-star"], caption: "Up → indecision → strong down. Bearish reversal." },
    ],
    quiz: [
      q("cs-star-1", "The middle candle of a Morning Star represents:", [["a", "Strong continuation"], ["b", "Momentum stalling / indecision"], ["c", "A gap"], ["d", "High volume buying"]], ["b"], "The small star candle shows the prior momentum stalling."),
    ],
  },
  {
    id: "cs-harami-tweezers",
    moduleId: "candlesticks",
    title: "Harami & Tweezers",
    summary: "Inside-bar slowdowns and matched-extreme reversals.",
    minutes: 7,
    content: [
      { kind: "list", items: [
        "Harami: a small candle whose body sits inside the previous large candle's body — momentum slowing.",
        "Tweezer Top: two candles with (nearly) equal highs — rejection of the same level twice (bearish).",
        "Tweezer Bottom: two candles with (nearly) equal lows — support held twice (bullish).",
      ] },
      { kind: "callout", tone: "info", title: "Equal highs/lows = liquidity", text: "Tweezers often mark equal highs/lows where liquidity rests — a frequent ICT target." },
    ],
    examples: [
      { title: "Bullish Harami", candles: candlePatterns["bullish-harami"], caption: "Small bullish candle inside prior bearish body." },
      { title: "Tweezer Bottom", candles: candlePatterns["tweezer-bottom"], caption: "Two equal lows — support defended." },
    ],
    quiz: [
      q("cs-ht-1", "A Tweezer Top is formed by:", [["a", "Two equal lows"], ["b", "Two (nearly) equal highs"], ["c", "A single long wick"], ["d", "Three candles"]], ["b"], "Tweezer top = two matched highs rejecting the same level."),
    ],
  },
];

export const candlesticksModule: Module = {
  id: "candlesticks",
  order: 1,
  title: "Japanese Candlesticks",
  subtitle: "Read price action one candle at a time",
  description:
    "Master the language of price: bodies, wicks, and the classic reversal & continuation patterns — always in the right context.",
  icon: "🕯️",
  level: "beginner",
  lessons,
};
