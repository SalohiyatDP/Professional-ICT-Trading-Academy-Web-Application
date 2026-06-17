import { useState } from "react";
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

  const dataset = replayDatasets.find((d) => d.id === datasetId) ?? replayDatasets[0];
  const markers = showStructureLabels ? labelStructure(dataset.candles) : [];

  const addLevel = () => {
    const mid = dataset.candles[dataset.candles.length - 1].close;
    setLevels((l) => [...l, { price: mid, color: "#f5b041", title: `Level ${l.length + 1}` }]);
  };

  const types: ChartType[] = ["candlestick", "bar", "line"];

  return (
    <div className="space-y-4">
      <SectionTitle title="📉 Chart Lab" subtitle="TradingView-style chart engine: candlestick / bar / line, structure labels, drawing tools" />

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
            {showVolume ? "✓ " : ""}Volume
          </button>
          <button
            onClick={toggleStructureLabels}
            className={cn("btn-ghost text-xs py-1.5", showStructureLabels && "text-white")}
          >
            {showStructureLabels ? "✓ " : ""}Structure (HH/HL/LH/LL)
          </button>
          <button onClick={addLevel} className="btn-ghost text-xs py-1.5">
            ＋ Horizontal line
          </button>
          {levels.length > 0 && (
            <button onClick={() => setLevels([])} className="btn-ghost text-xs py-1.5">
              Clear lines
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
          priceLines={levels}
          showVolume={showVolume}
          height={460}
        />
      </Card>

      <Card>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <Badge tone="bull">HH / HL</Badge>
          <Badge tone="bear">LH / LL</Badge>
          <span>Auto-detected swing structure. Use the toolbar to switch chart modes, toggle volume, and drop horizontal levels. Scroll / drag on the chart to zoom & pan.</span>
        </div>
      </Card>
    </div>
  );
}
