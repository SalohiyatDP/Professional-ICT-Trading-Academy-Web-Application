import type { Candle, ChartMarker } from "@/types";
import { uid } from "./utils";

interface SwingPoint {
  index: number;
  time: number;
  price: number;
  kind: "high" | "low";
}

/** Detect fractal swing highs/lows using a symmetric lookback window. */
export function detectSwings(candles: Candle[], lookback = 2): SwingPoint[] {
  const swings: SwingPoint[] = [];
  for (let i = lookback; i < candles.length - lookback; i++) {
    const c = candles[i];
    let isHigh = true;
    let isLow = true;
    for (let j = i - lookback; j <= i + lookback; j++) {
      if (j === i) continue;
      if (candles[j].high >= c.high) isHigh = false;
      if (candles[j].low <= c.low) isLow = false;
    }
    if (isHigh) swings.push({ index: i, time: c.time, price: c.high, kind: "high" });
    if (isLow) swings.push({ index: i, time: c.time, price: c.low, kind: "low" });
  }
  return swings.sort((a, b) => a.index - b.index);
}

/**
 * Label swings as HH / HL / LH / LL by comparing each high to the previous
 * high and each low to the previous low.
 */
export function labelStructure(candles: Candle[], lookback = 2): ChartMarker[] {
  const swings = detectSwings(candles, lookback);
  const markers: ChartMarker[] = [];
  let lastHigh: number | null = null;
  let lastLow: number | null = null;

  for (const s of swings) {
    if (s.kind === "high") {
      const kind = lastHigh == null ? "HH" : s.price > lastHigh ? "HH" : "LH";
      markers.push({
        id: uid("ms"),
        time: s.time,
        price: s.price,
        kind,
        text: kind,
        color: kind === "HH" ? "#26a69a" : "#ef5350",
      });
      lastHigh = s.price;
    } else {
      const kind = lastLow == null ? "HL" : s.price > lastLow ? "HL" : "LL";
      markers.push({
        id: uid("ms"),
        time: s.time,
        price: s.price,
        kind,
        text: kind,
        color: kind === "HL" ? "#26a69a" : "#ef5350",
      });
      lastLow = s.price;
    }
  }
  return markers;
}

/** Crude trend classification from the last few structure labels. */
export function classifyTrend(candles: Candle[]): "uptrend" | "downtrend" | "range" {
  const markers = labelStructure(candles);
  const recent = markers.slice(-4).map((m) => m.kind);
  const bullish = recent.filter((k) => k === "HH" || k === "HL").length;
  const bearish = recent.filter((k) => k === "LH" || k === "LL").length;
  if (bullish > bearish + 1) return "uptrend";
  if (bearish > bullish + 1) return "downtrend";
  return "range";
}
