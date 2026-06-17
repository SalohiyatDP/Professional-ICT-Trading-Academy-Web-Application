import { useEffect, useMemo, useState } from "react";
import { useReplayStore } from "@/store/useReplayStore";
import { replayDatasets } from "@/lib/candleData";
import { CandleChart, type PriceLineDef } from "@/components/chart/CandleChart";
import { Card, StatCard, SectionTitle, Badge } from "@/components/ui";
import type { TradeDirection } from "@/types";
import { cn } from "@/lib/utils";

export function ReplayPage() {
  const {
    session,
    loadDataset,
    next,
    back,
    jump,
    openTrade,
    evaluateTrades,
    visibleCandles,
    stats,
    saveSession,
  } = useReplayStore();

  const candles = visibleCandles();
  const stat = stats();
  const last = candles[candles.length - 1];

  const [direction, setDirection] = useState<TradeDirection>("long");
  const [entry, setEntry] = useState("");
  const [sl, setSl] = useState("");
  const [tp, setTp] = useState("");

  // Re-evaluate open trades whenever new candles are revealed.
  useEffect(() => {
    if (session) evaluateTrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.revealedIndex]);

  useEffect(() => {
    if (last) setEntry(String(last.close));
  }, [last?.time]);

  const priceLines: PriceLineDef[] = useMemo(() => {
    const lines: PriceLineDef[] = [];
    const e = parseFloat(entry);
    const s = parseFloat(sl);
    const t = parseFloat(tp);
    if (!Number.isNaN(e)) lines.push({ price: e, color: "#2962ff", title: "Entry" });
    if (!Number.isNaN(s)) lines.push({ price: s, color: "#ef5350", title: "SL" });
    if (!Number.isNaN(t)) lines.push({ price: t, color: "#26a69a", title: "TP" });
    return lines;
  }, [entry, sl, tp]);

  const placeTrade = () => {
    const e = parseFloat(entry);
    const s = parseFloat(sl);
    const t = parseFloat(tp);
    if ([e, s, t].some(Number.isNaN)) return;
    openTrade(direction, e, s, t);
    setSl("");
    setTp("");
  };

  if (!session) {
    return (
      <div className="space-y-6">
        <SectionTitle title="⏯ Replay Simulyator" subtitle="Shamlarni bittalab oching va jonli savdo qilgandek savdo qiling" />
        <div className="grid gap-4 sm:grid-cols-3">
          {replayDatasets.map((d) => (
            <Card key={d.id} className="flex flex-col">
              <h3 className="font-semibold text-white">{d.name}</h3>
              <p className="mb-4 mt-1 flex-1 text-xs text-muted">{d.description}</p>
              <button className="btn-primary" onClick={() => loadDataset(d.id)}>
                Sessiyani boshlash
              </button>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle title="⏯ Replay Simulyator" subtitle="Keyingi shamni taxmin qiling, keyin savdoga kiring" />
        <button className="btn-ghost" onClick={() => loadDataset(session.datasetId)}>
          ↻ Qayta boshlash
        </button>
      </div>

      <Card className="p-2">
        <CandleChart candles={candles} markers={tradeMarkers(session.trades)} priceLines={priceLines} height={400} />
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <button className="btn-ghost" onClick={() => jump(-5)}>« -5</button>
        <button className="btn-ghost" onClick={back}>‹ Orqaga</button>
        <button className="btn-primary" onClick={next}>Keyingi sham ›</button>
        <button className="btn-ghost" onClick={() => jump(5)}>+5 »</button>
        {last && (
          <Badge tone="accent" className="ml-2 font-mono">
            yopilish {last.close}
          </Badge>
        )}
        <button className="btn-ghost ml-auto" onClick={() => void saveSession()}>
          💾 Sessiyani saqlash
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <h3 className="mb-3 font-semibold text-white">Savdo qo'yish</h3>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <button
              className={cn("btn", direction === "long" ? "btn-bull" : "btn-ghost")}
              onClick={() => setDirection("long")}
            >
              Long
            </button>
            <button
              className={cn("btn", direction === "short" ? "btn-bear" : "btn-ghost")}
              onClick={() => setDirection("short")}
            >
              Short
            </button>
          </div>
          <div className="space-y-2">
            <PriceInput label="Kirish" value={entry} onChange={setEntry} />
            <PriceInput label="Stop loss" value={sl} onChange={setSl} />
            <PriceInput label="Take profit" value={tp} onChange={setTp} />
          </div>
          <button className="btn-primary mt-3 w-full" onClick={placeTrade}>
            Savdoni ochish
          </button>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Savdolar" value={stat.totalTrades} />
            <StatCard label="G'alaba foizi" value={`${stat.winRate}%`} tone="bull" />
            <StatCard label="Jami R" value={stat.totalR} tone={stat.totalR >= 0 ? "bull" : "bear"} />
            <StatCard label="O'rtacha R" value={stat.avgR} tone="accent" />
          </div>
          <Card>
            <h3 className="mb-2 font-semibold text-white">Savdolar jurnali</h3>
            {session.trades.length === 0 ? (
              <p className="text-sm text-muted">Hali savdo yo'q. Boshlash uchun bittasini qo'ying.</p>
            ) : (
              <div className="space-y-1 text-sm">
                {session.trades.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-lg bg-bg-soft px-3 py-2"
                  >
                    <span className={cn("font-semibold", t.direction === "long" ? "text-bull-strong" : "text-bear-strong")}>
                      {t.direction.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-muted">
                      @{t.entry} · SL {t.stopLoss} · TP {t.takeProfit}
                    </span>
                    <StatusBadge status={t.status} r={t.rMultiple} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function PriceInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wide text-muted">{label}</span>
      <input
        type="number"
        value={value}
        step="0.01"
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-bg-soft px-3 py-2 font-mono text-sm text-white outline-none focus:border-accent"
      />
    </label>
  );
}

function StatusBadge({ status, r }: { status: string; r: number }) {
  if (status === "open") return <Badge tone="neutral">ochiq</Badge>;
  if (status === "win") return <Badge tone="bull">+{r}R</Badge>;
  if (status === "loss") return <Badge tone="bear">{r}R</Badge>;
  return <Badge tone="neutral">BE</Badge>;
}

function tradeMarkers(trades: { id: string; entryTime: number; entry: number; direction: TradeDirection }[]) {
  return trades.map((t) => ({
    id: t.id,
    time: t.entryTime,
    price: t.entry,
    kind: "entry" as const,
    text: t.direction === "long" ? "▲" : "▼",
    color: t.direction === "long" ? "#26a69a" : "#ef5350",
  }));
}
