import { useMemo, useState } from "react";
import { CandleChart, type PriceLineDef } from "@/components/chart/CandleChart";
import { replayDatasets } from "@/lib/candleData";
import { labelStructure } from "@/lib/marketStructure";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Card, SectionTitle, Badge } from "@/components/ui";
import type { ChartType } from "@/types";
import { cn } from "@/lib/utils";

export function ChartLabPage() {
  const { chartType, setChartType, showVolume, toggleVolume, showStructureLabels, toggleStructureLabels } =
    useSettingsStore();
  const [datasetId, setDatasetId] = useState(replayDatasets[0].id);
  const [levels, setLevels] = useState<PriceLineDef[]>([]);
  const [showFib, setShowFib] = useState(false);

  const dataset = replayDatasets.find((d) => d.id === datasetId) ?? replayDatasets[0];
  const markers = showStructureLabels ? labelStructure(dataset.candles) : [];

  const addLevel = () => {
    const mid = dataset.candles[dataset.candles.length - 1].close;
    setLevels((l) => [...l, { price: mid, color: "#f5b041", title: `Daraja ${l.length + 1}` }]);
  };

  // Fibonacci retracement — dataset'ning swing low/high oralig'ida.
  const fibLevels: PriceLineDef[] = useMemo(() => {
    if (!showFib) return [];
    const low = Math.min(...dataset.candles.map((c) => c.low));
    const high = Math.max(...dataset.candles.map((c) => c.high));
    const range = high - low;
    const ratios: [number, string][] = [
      [0, "#8b949e"],
      [0.236, "#26a69a"],
      [0.382, "#2962ff"],
      [0.5, "#f5b041"],
      [0.618, "#2962ff"],
      [0.705, "#9b59b6"],
      [0.79, "#26a69a"],
      [1, "#8b949e"],
    ];
    return ratios.map(([r, color]) => ({
      price: Math.round((low + r * range) * 100) / 100,
      color,
      title: `Fib ${r}`,
      lineStyle: 2 as const,
    }));
  }, [showFib, dataset]);

  const allPriceLines = [...levels, ...fibLevels];

  const types: ChartType[] = ["candlestick", "bar", "line"];

  return (
    <div className="space-y-4">
      <SectionTitle title="📉 Grafik Laboratoriya" subtitle="TradingView uslubidagi grafik dvigateli: candlestick / bar / line, struktura belgilari, chizish vositalari" />

      <Card className="p-3">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-lg border border-border">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setChartType(t)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium capitalize",
                  chartType === t ? "bg-accent text-white" : "bg-bg-soft text-muted hover:text-white"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <button onClick={toggleVolume} className={cn("btn-ghost text-xs py-1.5", showVolume && "text-white")}>
            {showVolume ? "✓ " : ""}Hajm
          </button>
          <button
            onClick={toggleStructureLabels}
            className={cn("btn-ghost text-xs py-1.5", showStructureLabels && "text-white")}
          >
            {showStructureLabels ? "✓ " : ""}Struktura (HH/HL/LH/LL)
          </button>
          <button onClick={addLevel} className="btn-ghost text-xs py-1.5">
            ＋ Gorizontal chiziq
          </button>
          <button
            onClick={() => setShowFib((v) => !v)}
            className={cn("btn-ghost text-xs py-1.5", showFib && "text-white")}
          >
            {showFib ? "✓ " : ""}Fibonacci
          </button>
          {levels.length > 0 && (
            <button onClick={() => setLevels([])} className="btn-ghost text-xs py-1.5">
              Chiziqlarni tozalash
            </button>
          )}

          <select
            value={datasetId}
            onChange={(e) => setDatasetId(e.target.value)}
            className="ml-auto rounded-lg border border-border bg-bg-soft px-3 py-1.5 text-xs text-white outline-none"
          >
            {replayDatasets.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <CandleChart
          candles={dataset.candles}
          type={chartType}
          markers={markers}
          priceLines={allPriceLines}
          showVolume={showVolume}
          height={460}
        />
      </Card>

      <Card>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <Badge tone="bull">HH / HL</Badge>
          <Badge tone="bear">LH / LL</Badge>
          <span>Avtomatik aniqlangan swing strukturasi. Grafik rejimlarini almashtirish, hajmni yoqish/o'chirish va gorizontal darajalar qo'yish uchun asboblar panelidan foydalaning. Zoom va pan uchun grafikda scroll / drag qiling.</span>
        </div>
      </Card>
    </div>
  );
}
