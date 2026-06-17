import type { RiskCalcInput, RiskCalcResult } from "@/types";
import { round } from "./utils";

/**
 * Compute position size and R:R from account risk parameters.
 * Generic across asset classes via `contractSize` / `pipValue`.
 */
export function calculateRisk(input: RiskCalcInput): RiskCalcResult {
  const {
    accountBalance,
    riskPercent,
    entryPrice,
    stopLossPrice,
    takeProfitPrice,
    contractSize = 1,
  } = input;

  const riskAmount = round((accountBalance * riskPercent) / 100, 2);
  const stopDistance = round(Math.abs(entryPrice - stopLossPrice), 5);

  // Units of the instrument such that loss at SL == riskAmount.
  const perUnitLoss = stopDistance * contractSize;
  const positionSize = perUnitLoss > 0 ? round(riskAmount / perUnitLoss, 4) : 0;

  // Treat 100,000 units as a standard lot (FX convention) for the lot read-out.
  const lotSize = round(positionSize / 100_000, 4);

  let rewardAmount: number | undefined;
  let riskRewardRatio: number | undefined;
  if (takeProfitPrice != null && stopDistance > 0) {
    const rewardDistance = Math.abs(takeProfitPrice - entryPrice);
    rewardAmount = round(rewardDistance * contractSize * positionSize, 2);
    riskRewardRatio = round(rewardDistance / stopDistance, 2);
  }

  return {
    riskAmount,
    stopDistance,
    positionSize,
    lotSize,
    rewardAmount,
    riskRewardRatio,
  };
}

/** Simple R:R ratio from three prices. */
export function riskReward(
  entry: number,
  stop: number,
  target: number
): number {
  const risk = Math.abs(entry - stop);
  const reward = Math.abs(target - entry);
  return risk > 0 ? round(reward / risk, 2) : 0;
}

/** Project balance after N trades at a fixed win rate and R:R (expectancy). */
export function expectancy(
  winRate: number,
  rrRatio: number,
  riskPercent: number
): number {
  const p = winRate / 100;
  // Expected R per trade
  const expR = p * rrRatio - (1 - p);
  return round(expR * riskPercent, 3);
}

export interface DrawdownPlan {
  dailyLossLimit: number;
  weeklyRisk: number;
  monthlyRisk: number;
}

/** Standard prop-firm style risk envelope from a per-trade risk %. */
export function riskEnvelope(
  balance: number,
  riskPercent: number,
  tradesPerDay = 3
): DrawdownPlan {
  const perTrade = (balance * riskPercent) / 100;
  return {
    dailyLossLimit: round(perTrade * tradesPerDay, 2),
    weeklyRisk: round(perTrade * tradesPerDay * 5 * 0.6, 2),
    monthlyRisk: round(perTrade * tradesPerDay * 20 * 0.4, 2),
  };
}
