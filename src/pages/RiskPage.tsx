import { useMemo, useState } from "react";
import { calculateRisk, riskEnvelope, expectancy } from "@/lib/riskCalc";
import { Card, StatCard, SectionTitle } from "@/components/ui";
import { formatMoney } from "@/lib/utils";

function NumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wide text-muted">{label}</span>
      <input
        type="number"
        value={Number.isNaN(value) ? "" : value}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full rounded-lg border border-border bg-bg-soft px-3 py-2 font-mono text-sm text-white outline-none focus:border-accent"
      />
    </label>
  );
}

export function RiskPage() {
  const [balance, setBalance] = useState(10000);
  const [riskPct, setRiskPct] = useState(1);
  const [entry, setEntry] = useState(1.105);
  const [stop, setStop] = useState(1.1);
  const [target, setTarget] = useState(1.118);
  const [contract, setContract] = useState(100000);
  const [winRate, setWinRate] = useState(45);

  const result = useMemo(
    () =>
      calculateRisk({
        accountBalance: balance,
        riskPercent: riskPct,
        entryPrice: entry,
        stopLossPrice: stop,
        takeProfitPrice: target,
        contractSize: contract,
      }),
    [balance, riskPct, entry, stop, target, contract]
  );

  const envelope = useMemo(() => riskEnvelope(balance, riskPct), [balance, riskPct]);
  const exp = useMemo(
    () => expectancy(winRate, result.riskRewardRatio ?? 0, riskPct),
    [winRate, result.riskRewardRatio, riskPct]
  );

  return (
    <div className="space-y-6">
      <SectionTitle title="🧮 Risk Kalkulyatorlari" subtitle="Lot hajmi, risk, R:R va to'liq drawdown envelope" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold text-white">Kirish ma'lumotlari</h2>
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Hisob balansi" value={balance} onChange={setBalance} step={100} />
            <NumberField label="Risk %" value={riskPct} onChange={setRiskPct} step={0.1} />
            <NumberField label="Kirish narxi" value={entry} onChange={setEntry} step={0.0001} />
            <NumberField label="Stop loss" value={stop} onChange={setStop} step={0.0001} />
            <NumberField label="Take profit" value={target} onChange={setTarget} step={0.0001} />
            <NumberField label="Kontrakt hajmi" value={contract} onChange={setContract} step={1000} />
            <NumberField label="Taxminiy g'alaba %" value={winRate} onChange={setWinRate} step={1} />
          </div>
        </Card>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Risk miqdori" value={formatMoney(result.riskAmount)} tone="bear" />
            <StatCard
              label="R : R"
              value={result.riskRewardRatio ? `1:${result.riskRewardRatio}` : "—"}
              tone="accent"
            />
            <StatCard label="Pozitsiya hajmi" value={result.positionSize.toLocaleString()} sub="birlik" />
            <StatCard label="Lot hajmi" value={result.lotSize} sub="standart lot" tone="gold" />
            <StatCard
              label="Potensial foyda"
              value={result.rewardAmount ? formatMoney(result.rewardAmount) : "—"}
              tone="bull"
            />
            <StatCard label="Stop masofasi" value={result.stopDistance} sub="narx" />
          </div>

          <Card>
            <h3 className="mb-2 font-semibold text-white">Expectancy (kutilma)</h3>
            <p className="text-sm text-gray-300">
              {winRate}% g'alaba foizi va 1:{result.riskRewardRatio ?? 0} R:R da expectancy{" "}
              <span className={exp >= 0 ? "text-bull-strong" : "text-bear-strong"}>
                {exp >= 0 ? "+" : ""}
                {exp}% har savdoda
              </span>
              .{" "}
              {exp >= 0 ? "Musbat ustunlik ✅" : "Manfiy ustunlik — R:R yoki g'alaba foizini yaxshilang."}
            </p>
          </Card>
        </div>
      </div>

      <Card>
        <h2 className="mb-3 font-semibold text-white">Drawdown envelope</h2>
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Kunlik yutqazish limiti" value={formatMoney(envelope.dailyLossLimit)} tone="bear" />
          <StatCard label="Haftalik risk chegarasi" value={formatMoney(envelope.weeklyRisk)} tone="gold" />
          <StatCard label="Oylik risk chegarasi" value={formatMoney(envelope.monthlyRisk)} />
        </div>
      </Card>
    </div>
  );
}
