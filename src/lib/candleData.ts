import type { Candle } from "@/types";
import { round, seededRandom } from "./utils";

const DAY = 86400;
const BASE_TIME = 1_700_000_000; // fixed origin so charts are deterministic

/**
 * Generate a realistic random-walk OHLC series.
 * Deterministic for a given seed so lessons/replays are reproducible offline.
 */
export function generateSeries(
  count: number,
  opts: {
    seed?: number;
    start?: number;
    volatility?: number;
    drift?: number;
    startTime?: number;
    interval?: number;
  } = {}
): Candle[] {
  const {
    seed = 7,
    start = 100,
    volatility = 1.4,
    drift = 0,
    startTime = BASE_TIME,
    interval = DAY,
  } = opts;

  const rand = seededRandom(seed);
  const candles: Candle[] = [];
  let prevClose = start;

  for (let i = 0; i < count; i++) {
    const open = prevClose;
    const direction = rand() < 0.5 + drift ? 1 : -1;
    const body = (rand() * volatility + 0.2) * direction;
    const close = round(open + body, 2);
    const wickUp = rand() * volatility * 0.8;
    const wickDown = rand() * volatility * 0.8;
    const high = round(Math.max(open, close) + wickUp, 2);
    const low = round(Math.min(open, close) - wickDown, 2);
    candles.push({
      time: startTime + i * interval,
      open,
      high,
      low,
      close,
      volume: Math.round(500 + rand() * 2000),
    });
    prevClose = close;
  }
  return candles;
}

/** Helper to build an explicit candle quickly. */
function c(
  time: number,
  open: number,
  high: number,
  low: number,
  close: number
): Candle {
  return { time, open, high, low, close };
}

function t(i: number): number {
  return BASE_TIME + i * DAY;
}

/* ------------------------------------------------------------------ */
/* Candlestick pattern example datasets                                */
/* Each returns a short series ending in the named pattern.            */
/* ------------------------------------------------------------------ */

export const candlePatterns: Record<string, Candle[]> = {
  bullish: [
    c(t(0), 100, 101, 99.4, 99.8),
    c(t(1), 99.8, 100.2, 99.2, 99.5),
    c(t(2), 99.5, 103.2, 99.3, 102.9), // strong bullish
  ],
  bearish: [
    c(t(0), 100, 100.6, 99, 100.3),
    c(t(1), 100.3, 101, 100, 100.7),
    c(t(2), 100.7, 100.9, 97.2, 97.5), // strong bearish
  ],
  doji: [
    c(t(0), 100, 100.8, 99.4, 100.2),
    c(t(1), 100.2, 101, 99.3, 100.6),
    c(t(2), 100.6, 102.1, 99.1, 100.62), // indecision doji
  ],
  hammer: [
    c(t(0), 102, 102.3, 101, 101.2),
    c(t(1), 101.2, 101.4, 100, 100.3),
    c(t(2), 100.3, 100.7, 97.6, 100.5), // long lower wick, small body at top
  ],
  "inverted-hammer": [
    c(t(0), 102, 102.2, 100.9, 101),
    c(t(1), 101, 101.2, 99.8, 100),
    c(t(2), 100, 102.6, 99.85, 100.2), // long upper wick after downtrend
  ],
  "shooting-star": [
    c(t(0), 99, 100.2, 98.8, 100),
    c(t(1), 100, 101.4, 99.9, 101.2),
    c(t(2), 101.2, 103.8, 101, 101.3), // long upper wick after uptrend
  ],
  "hanging-man": [
    c(t(0), 99, 100, 98.8, 99.9),
    c(t(1), 99.9, 101, 99.7, 100.8),
    c(t(2), 100.8, 101.1, 98.4, 100.7), // long lower wick at top of uptrend
  ],
  "bullish-engulfing": [
    c(t(0), 101, 101.3, 100.4, 100.6),
    c(t(1), 100.6, 100.8, 99.6, 99.9), // small bearish
    c(t(2), 99.7, 102.4, 99.5, 102.2), // big bullish engulfs prior body
  ],
  "bearish-engulfing": [
    c(t(0), 100, 100.7, 99.7, 100.5),
    c(t(1), 100.5, 101.1, 100.3, 100.9), // small bullish
    c(t(2), 101.1, 101.3, 98.7, 98.9), // big bearish engulfs prior body
  ],
  "morning-star": [
    c(t(0), 103, 103.2, 100.2, 100.4), // big bearish
    c(t(1), 100, 100.2, 99.4, 99.7), // small star (gap down)
    c(t(2), 99.9, 102.9, 99.8, 102.6), // big bullish
  ],
  "evening-star": [
    c(t(0), 99, 102.5, 98.9, 102.3), // big bullish
    c(t(1), 102.7, 103, 102.4, 102.6), // small star (gap up)
    c(t(2), 102.4, 102.5, 99.3, 99.6), // big bearish
  ],
  "bullish-harami": [
    c(t(0), 102, 102.2, 98.9, 99.1), // big bearish
    c(t(1), 99.6, 100.4, 99.4, 100.1), // small bullish inside prior body
  ],
  "bearish-harami": [
    c(t(0), 99, 102.3, 98.8, 102.1), // big bullish
    c(t(1), 101.4, 101.7, 100.8, 101), // small bearish inside prior body
  ],
  "tweezer-top": [
    c(t(0), 99, 101.5, 98.9, 101.4), // bullish to a high
    c(t(1), 101.4, 101.5, 99.5, 99.7), // bearish from same high
  ],
  "tweezer-bottom": [
    c(t(0), 101, 101.2, 99.0, 99.2), // bearish to a low
    c(t(1), 99.2, 101.1, 99.0, 100.9), // bullish from same low
  ],
};

/* ------------------------------------------------------------------ */
/* Market-structure datasets                                           */
/* ------------------------------------------------------------------ */

/** Clean uptrend producing HH / HL sequence. */
export function uptrendSeries(): Candle[] {
  return generateSeries(40, { seed: 21, start: 100, drift: 0.16, volatility: 1.2 });
}
export function downtrendSeries(): Candle[] {
  return generateSeries(40, { seed: 33, start: 130, drift: -0.16, volatility: 1.2 });
}
export function rangeSeries(): Candle[] {
  return generateSeries(40, { seed: 5, start: 110, drift: 0, volatility: 1.0 });
}

/* ------------------------------------------------------------------ */
/* Replay datasets                                                     */
/* ------------------------------------------------------------------ */

export interface ReplayDataset {
  id: string;
  name: string;
  description: string;
  candles: Candle[];
}

export const replayDatasets: ReplayDataset[] = [
  {
    id: "trend-london",
    name: "Trending London Session",
    description: "A clean bullish leg with a liquidity sweep and continuation.",
    candles: generateSeries(160, { seed: 101, start: 100, drift: 0.12, volatility: 1.6 }),
  },
  {
    id: "range-ny",
    name: "Ranging New York Session",
    description: "Choppy consolidation that traps both sides before a break.",
    candles: generateSeries(160, { seed: 202, start: 120, drift: 0, volatility: 1.3 }),
  },
  {
    id: "reversal-asia",
    name: "Asian Reversal",
    description: "A downtrend that shifts character into a reversal.",
    candles: (() => {
      const down = generateSeries(80, { seed: 303, start: 140, drift: -0.18, volatility: 1.5 });
      const lastTime = down[down.length - 1].time;
      const lastClose = down[down.length - 1].close;
      const up = generateSeries(80, {
        seed: 404,
        start: lastClose,
        drift: 0.2,
        volatility: 1.5,
        startTime: lastTime + DAY,
      });
      return [...down, ...up];
    })(),
  },
];

export function getReplayDataset(id: string): ReplayDataset {
  return replayDatasets.find((d) => d.id === id) ?? replayDatasets[0];
}
