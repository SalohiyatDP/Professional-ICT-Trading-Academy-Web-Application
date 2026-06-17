import { useEffect, useRef, useState } from "react";
import type { Candle, ChartMarker, ChartZone } from "@/types";
import { CandleChart } from "./CandleChart";
import { useSettingsStore } from "@/store/useSettingsStore";

interface AnimatedChartProps {
  candles: Candle[];
  zones?: ChartZone[];
  markers?: ChartMarker[];
  height?: number;
  /** ms between revealing each candle */
  speed?: number;
  showVolume?: boolean;
}

/**
 * Reveals candles one-by-one to visualise pattern "formation".
 * Honors the global animations setting and offers replay controls.
 */
export function AnimatedChart({
  candles,
  zones = [],
  markers = [],
  height = 320,
  speed = 280,
  showVolume = false,
}: AnimatedChartProps) {
  const animationsEnabled = useSettingsStore((s) => s.animationsEnabled);
  const [revealed, setRevealed] = useState(animationsEnabled ? 1 : candles.length);
  const [playing, setPlaying] = useState(animationsEnabled);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setRevealed(animationsEnabled ? 1 : candles.length);
    setPlaying(animationsEnabled);
  }, [candles, animationsEnabled]);

  useEffect(() => {
    if (!playing) return;
    if (revealed >= candles.length) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(() => setRevealed((r) => r + 1), speed);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [playing, revealed, candles.length, speed]);

  const visibleCandles = candles.slice(0, revealed);
  // Only show markers/zones once their anchor candle is revealed.
  const lastTime = visibleCandles[visibleCandles.length - 1]?.time ?? 0;
  const visibleMarkers = markers.filter((m) => m.time <= lastTime);
  const visibleZones = zones.filter((z) => z.startTime <= lastTime);

  const replay = () => {
    setRevealed(1);
    setPlaying(true);
  };
  const done = revealed >= candles.length;

  return (
    <div>
      <CandleChart
        candles={visibleCandles}
        zones={visibleZones}
        markers={visibleMarkers}
        height={height}
        showVolume={showVolume}
        autoFit
      />
      <div className="mt-2 flex items-center gap-2">
        <button onClick={replay} className="btn-ghost text-xs py-1 px-3">
          {done ? "↻ Qayta ko'rish" : "↻ Boshidan"}
        </button>
        {!done && (
          <button
            onClick={() => setPlaying((p) => !p)}
            className="btn-ghost text-xs py-1 px-3"
          >
            {playing ? "⏸ To'xtatish" : "▶ Davom etish"}
          </button>
        )}
        <button
          onClick={() => {
            setPlaying(false);
            setRevealed(candles.length);
          }}
          className="btn-ghost text-xs py-1 px-3"
        >
          ⏭ Hammasini ko'rsatish
        </button>
        <div className="ml-auto text-xs text-muted">
          {Math.min(revealed, candles.length)} / {candles.length} sham
        </div>
      </div>
    </div>
  );
}
