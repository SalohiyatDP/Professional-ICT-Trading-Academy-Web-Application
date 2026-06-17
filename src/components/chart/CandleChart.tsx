import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type SeriesMarker,
  type Time,
  type IPriceLine,
} from "lightweight-charts";
import type { Candle, ChartMarker, ChartType, ChartZone } from "@/types";

export interface PriceLineDef {
  price: number;
  color: string;
  title: string;
  lineStyle?: 0 | 1 | 2 | 3 | 4;
}

interface CandleChartProps {
  candles: Candle[];
  type?: ChartType;
  zones?: ChartZone[];
  markers?: ChartMarker[];
  priceLines?: PriceLineDef[];
  height?: number;
  showVolume?: boolean;
  fitContent?: boolean;
  autoFit?: boolean;
  className?: string;
}

const UP = "#26a69a";
const DOWN = "#ef5350";

function markerFor(m: ChartMarker): SeriesMarker<Time> {
  const above = ["HH", "LH", "sl", "tp", "sweep", "bos"].includes(m.kind);
  const colorMap: Record<string, string> = {
    HH: UP,
    HL: UP,
    LH: DOWN,
    LL: DOWN,
    entry: "#2962ff",
    sl: DOWN,
    tp: UP,
    sweep: "#f5b041",
    bos: "#2962ff",
    choch: "#f5b041",
    note: "#8b949e",
  };
  return {
    time: m.time as Time,
    position: above ? "aboveBar" : "belowBar",
    color: m.color ?? colorMap[m.kind] ?? "#8b949e",
    shape: above ? "arrowDown" : "arrowUp",
    text: m.text ?? m.kind,
  };
}

export function CandleChart({
  candles,
  type = "candlestick",
  zones = [],
  markers = [],
  priceLines = [],
  height = 380,
  showVolume = true,
  autoFit = true,
  className,
}: CandleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<"Candlestick" | "Bar" | "Line"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const priceLineRefs = useRef<IPriceLine[]>([]);
  const [zoneBoxes, setZoneBoxes] = useState<
    { id: string; left: number; top: number; width: number; height: number; color: string; label?: string }[]
  >([]);

  // Create chart once.
  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "#0e1117" },
        textColor: "#8b949e",
        fontFamily: "Inter, sans-serif",
      },
      grid: {
        vertLines: { color: "#1a212b" },
        horzLines: { color: "#1a212b" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: "#2a313c" },
      timeScale: { borderColor: "#2a313c", timeVisible: false, secondsVisible: false },
    });
    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
      mainSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);

  // (Re)build series when chart type or volume visibility changes.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    if (mainSeriesRef.current) {
      chart.removeSeries(mainSeriesRef.current);
      mainSeriesRef.current = null;
    }
    if (volumeSeriesRef.current) {
      chart.removeSeries(volumeSeriesRef.current);
      volumeSeriesRef.current = null;
    }

    if (type === "line") {
      mainSeriesRef.current = chart.addLineSeries({ color: "#2962ff", lineWidth: 2 });
    } else if (type === "bar") {
      mainSeriesRef.current = chart.addBarSeries({ upColor: UP, downColor: DOWN });
    } else {
      mainSeriesRef.current = chart.addCandlestickSeries({
        upColor: UP,
        downColor: DOWN,
        borderUpColor: UP,
        borderDownColor: DOWN,
        wickUpColor: UP,
        wickDownColor: DOWN,
      });
    }

    if (showVolume) {
      const vol = chart.addHistogramSeries({
        priceFormat: { type: "volume" },
        priceScaleId: "vol",
      });
      vol.priceScale().applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });
      volumeSeriesRef.current = vol;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, showVolume]);

  // Push data.
  useEffect(() => {
    const series = mainSeriesRef.current;
    const chart = chartRef.current;
    if (!series || !chart) return;

    if (type === "line") {
      series.setData(candles.map((c) => ({ time: c.time as Time, value: c.close })));
    } else {
      series.setData(
        candles.map((c) => ({
          time: c.time as Time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }))
      );
    }

    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.setData(
        candles.map((c) => ({
          time: c.time as Time,
          value: c.volume ?? 0,
          color: c.close >= c.open ? "#26a69a55" : "#ef535055",
        }))
      );
    }

    if (autoFit) chart.timeScale().fitContent();
  }, [candles, type, autoFit]);

  // Markers.
  useEffect(() => {
    const series = mainSeriesRef.current;
    if (!series) return;
    series.setMarkers(markers.map(markerFor));
  }, [markers, type]);

  // Price lines (entry / SL / TP / horizontals).
  useEffect(() => {
    const series = mainSeriesRef.current;
    if (!series) return;
    priceLineRefs.current.forEach((pl) => series.removePriceLine(pl));
    priceLineRefs.current = priceLines.map((pl) =>
      series.createPriceLine({
        price: pl.price,
        color: pl.color,
        lineWidth: 2,
        lineStyle: pl.lineStyle ?? 2,
        axisLabelVisible: true,
        title: pl.title,
      })
    );
  }, [priceLines, type]);

  // Zones overlay — recompute pixel boxes on every render / range change.
  useEffect(() => {
    const chart = chartRef.current;
    const series = mainSeriesRef.current;
    if (!chart || !series) return;

    const update = () => {
      const boxes = zones
        .map((z) => {
          const x1 = chart.timeScale().timeToCoordinate(z.startTime as Time);
          const x2 = chart.timeScale().timeToCoordinate(z.endTime as Time);
          const yTop = series.priceToCoordinate(z.top);
          const yBottom = series.priceToCoordinate(z.bottom);
          if (x1 == null || x2 == null || yTop == null || yBottom == null) return null;
          return {
            id: z.id,
            left: Math.min(x1, x2),
            top: Math.min(yTop, yBottom),
            width: Math.max(2, Math.abs(x2 - x1)),
            height: Math.max(2, Math.abs(yBottom - yTop)),
            color: z.color,
            label: z.label,
          };
        })
        .filter(Boolean) as typeof zoneBoxes;
      setZoneBoxes(boxes);
    };

    update();
    chart.timeScale().subscribeVisibleTimeRangeChange(update);
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      chart.timeScale().unsubscribeVisibleTimeRangeChange(update);
      ro.disconnect();
    };
  }, [zones, candles, type]);

  return (
    <div className={className} style={{ position: "relative", height }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
      <div
        ref={overlayRef}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}
      >
        {zoneBoxes.map((b) => (
          <div
            key={b.id}
            style={{
              position: "absolute",
              left: b.left,
              top: b.top,
              width: b.width,
              height: b.height,
              background: `${b.color}22`,
              border: `1px solid ${b.color}`,
              borderRadius: 3,
            }}
          >
            {b.label && (
              <span
                style={{
                  position: "absolute",
                  top: -18,
                  left: 0,
                  fontSize: 10,
                  fontWeight: 600,
                  color: b.color,
                  whiteSpace: "nowrap",
                }}
              >
                {b.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
