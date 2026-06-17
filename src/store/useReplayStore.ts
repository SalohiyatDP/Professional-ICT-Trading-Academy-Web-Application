import { create } from "zustand";
import type {
  Candle,
  ReplaySession,
  ReplayStats,
  ReplayTrade,
  TradeDirection,
} from "@/types";
import { getReplayDataset } from "@/lib/candleData";
import { dbPut, dbGetAll, dbDelete } from "@/lib/db";
import { riskReward } from "@/lib/riskCalc";
import { round, uid } from "@/lib/utils";

interface ReplayState {
  session: ReplaySession | null;
  candles: Candle[];
  loadDataset: (datasetId: string) => void;
  next: () => void;
  back: () => void;
  jump: (count: number) => void;
  openTrade: (
    direction: TradeDirection,
    entry: number,
    stopLoss: number,
    takeProfit: number
  ) => void;
  evaluateTrades: () => void;
  visibleCandles: () => Candle[];
  stats: () => ReplayStats;
  saveSession: () => Promise<void>;
  history: ReplaySession[];
  loadHistory: () => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
}

function computeStats(trades: ReplayTrade[]): ReplayStats {
  const closed = trades.filter((t) => t.status !== "open");
  const wins = closed.filter((t) => t.status === "win").length;
  const losses = closed.filter((t) => t.status === "loss").length;
  const breakeven = closed.filter((t) => t.status === "breakeven").length;
  const rs = closed.map((t) => t.rMultiple);
  const totalR = round(rs.reduce((a, b) => a + b, 0), 2);
  return {
    totalTrades: closed.length,
    wins,
    losses,
    breakeven,
    winRate: closed.length ? round((wins / closed.length) * 100, 1) : 0,
    avgR: closed.length ? round(totalR / closed.length, 2) : 0,
    totalR,
    bestR: rs.length ? round(Math.max(...rs), 2) : 0,
    worstR: rs.length ? round(Math.min(...rs), 2) : 0,
  };
}

export const useReplayStore = create<ReplayState>((set, get) => ({
  session: null,
  candles: [],
  history: [],

  loadDataset: (datasetId) => {
    const dataset = getReplayDataset(datasetId);
    const startReveal = Math.min(30, dataset.candles.length - 1);
    set({
      candles: dataset.candles,
      session: {
        id: uid("replay"),
        datasetId,
        createdAt: Date.now(),
        trades: [],
        revealedIndex: startReveal,
      },
    });
  },

  next: () =>
    set((s) => {
      if (!s.session) return s;
      const revealedIndex = Math.min(s.session.revealedIndex + 1, s.candles.length - 1);
      const session = { ...s.session, revealedIndex };
      return { session };
    }),

  back: () =>
    set((s) => {
      if (!s.session) return s;
      const revealedIndex = Math.max(s.session.revealedIndex - 1, 1);
      return { session: { ...s.session, revealedIndex } };
    }),

  jump: (count) =>
    set((s) => {
      if (!s.session) return s;
      const revealedIndex = Math.min(
        Math.max(s.session.revealedIndex + count, 1),
        s.candles.length - 1
      );
      return { session: { ...s.session, revealedIndex } };
    }),

  openTrade: (direction, entry, stopLoss, takeProfit) =>
    set((s) => {
      if (!s.session) return s;
      const trade: ReplayTrade = {
        id: uid("trade"),
        direction,
        entry,
        stopLoss,
        takeProfit,
        entryTime: s.candles[s.session.revealedIndex].time,
        status: "open",
        rMultiple: 0,
        riskRewardPlanned: riskReward(entry, stopLoss, takeProfit),
      };
      return { session: { ...s.session, trades: [...s.session.trades, trade] } };
    }),

  /** Walk forward from each open trade's entry to resolve SL/TP hits. */
  evaluateTrades: () =>
    set((s) => {
      if (!s.session) return s;
      const upto = s.session.revealedIndex;
      const trades = s.session.trades.map((trade) => {
        if (trade.status !== "open") return trade;
        const startIdx = s.candles.findIndex((c) => c.time === trade.entryTime);
        for (let i = startIdx + 1; i <= upto; i++) {
          const candle = s.candles[i];
          const risk = Math.abs(trade.entry - trade.stopLoss);
          if (trade.direction === "long") {
            if (candle.low <= trade.stopLoss) {
              return finalize(trade, "loss", trade.stopLoss, candle.time, -1);
            }
            if (candle.high >= trade.takeProfit) {
              const r = risk ? round((trade.takeProfit - trade.entry) / risk, 2) : 0;
              return finalize(trade, "win", trade.takeProfit, candle.time, r);
            }
          } else {
            if (candle.high >= trade.stopLoss) {
              return finalize(trade, "loss", trade.stopLoss, candle.time, -1);
            }
            if (candle.low <= trade.takeProfit) {
              const r = risk ? round((trade.entry - trade.takeProfit) / risk, 2) : 0;
              return finalize(trade, "win", trade.takeProfit, candle.time, r);
            }
          }
        }
        return trade;
      });
      return { session: { ...s.session, trades } };
    }),

  visibleCandles: () => {
    const { session, candles } = get();
    if (!session) return [];
    return candles.slice(0, session.revealedIndex + 1);
  },

  stats: () => computeStats(get().session?.trades ?? []),

  saveSession: async () => {
    const { session } = get();
    if (!session) return;
    await dbPut("replaySessions", session);
    await get().loadHistory();
  },

  loadHistory: async () => {
    const all = await dbGetAll<ReplaySession>("replaySessions");
    set({ history: all.sort((a, b) => b.createdAt - a.createdAt) });
  },

  deleteSession: async (id) => {
    await dbDelete("replaySessions", id);
    await get().loadHistory();
  },
}));

function finalize(
  trade: ReplayTrade,
  status: ReplayTrade["status"],
  exitPrice: number,
  exitTime: number,
  rMultiple: number
): ReplayTrade {
  return { ...trade, status, exitPrice, exitTime, rMultiple };
}
