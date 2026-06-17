import type { QuizQuestion } from "@/types";
import { candlePatterns } from "@/lib/candleData";

function q(
  id: string,
  prompt: string,
  options: [string, string][],
  correct: string[],
  explanation: string,
  type: QuizQuestion["type"] = "single"
): QuizQuestion {
  return {
    id,
    type,
    prompt,
    explanation,
    options: options.map(([oid, text]) => ({ id: oid, text })),
    correct,
    points: 1,
  };
}

/** Final certification exam — pulls from every module. */
export const finalExam: QuizQuestion[] = [
  q("fx-1", "An uptrend is defined by:", [["a", "LH + LL"], ["b", "HH + HL"], ["c", "Equal highs"], ["d", "Dojis"]], ["b"], "HH + HL = bullish structure."),
  q("fx-2", "A bullish order block is the:", [["a", "Last up-candle before a drop"], ["b", "Last down-candle before a rally"], ["c", "Biggest green candle"], ["d", "First candle of the day"]], ["b"], "Bullish OB = last down candle before displacement up."),
  q("fx-3", "A Fair Value Gap needs:", [["a", "1 candle"], ["b", "3 candles with non-overlapping wicks"], ["c", "Equal lows"], ["d", "A doji"]], ["b"], "FVG = 3-candle imbalance."),
  q("fx-4", "Buy-side liquidity sits:", [["a", "Below lows"], ["b", "Above highs"], ["c", "At equilibrium"], ["d", "At the open"]], ["b"], "Buy stops rest above highs."),
  q("fx-5", "Equilibrium is at the ___ of a range.", [["a", "0%"], ["b", "50%"], ["c", "79%"], ["d", "100%"]], ["b"], "Equilibrium = 50% of the dealing range."),
  q("fx-6", "A CHoCH in an uptrend is a close:", [["a", "Above the last high"], ["b", "Below the last higher-low"], ["c", "At equilibrium"], ["d", "On high volume"]], ["b"], "First break against trend = below last HL."),
  q("fx-7", "A liquidity sweep is confirmed by:", [["a", "Immediate rejection + structure shift"], ["b", "A slow drift"], ["c", "Low volume"], ["d", "A gap up"]], ["a"], "Sweep + rejection/MSS shows intent."),
  q("fx-8", "Identify this candle: small body on top, long lower wick, after a downtrend.", [["a", "Shooting Star"], ["b", "Hammer"], ["c", "Doji"], ["d", "Hanging Man"]], ["b"], "Long lower wick + small body after a downtrend = Hammer.", "chart-identify"),
  q("fx-9", "At 1:3 R:R the break-even win rate is about:", [["a", "25%"], ["b", "50%"], ["c", "66%"], ["d", "10%"]], ["a"], "1/(1+RR) = 1/4 = 25%."),
  q("fx-10", "A breaker block is:", [["a", "An OB that holds"], ["b", "A failed OB whose zone flips role"], ["c", "A doji cluster"], ["d", "An equal high"]], ["b"], "Failed OB → broken zone flips = breaker."),
  q("fx-11", "An inversion FVG occurs when:", [["a", "Price fills 50%"], ["b", "Price closes through the gap, flipping polarity"], ["c", "Two FVGs touch"], ["d", "Volume spikes"]], ["b"], "Closed-through FVG flips role."),
  q("fx-12", "The Judas Swing is:", [["a", "A risk model"], ["b", "A false early-session move that traps traders"], ["c", "A candlestick"], ["d", "An indicator"]], ["b"], "False session move to grab liquidity."),
  q("fx-13", "Position size formula:", [["a", "Account × Leverage"], ["b", "(Account × Risk%) ÷ Stop distance"], ["c", "Risk% × Target"], ["d", "Fixed lot"]], ["b"], "Size = (Account × Risk%) ÷ stop distance."),
  q("fx-14", "In a bullish trend you should buy in:", [["a", "Premium"], ["b", "Discount with confluence"], ["c", "Equilibrium only"], ["d", "At the high"]], ["b"], "Buy discount + OB/FVG confluence."),
  q("fx-15", "Identify this candle pattern.", [["a", "Bullish Engulfing"], ["b", "Bearish Engulfing"], ["c", "Morning Star"], ["d", "Doji"]], ["a"], "A large up-candle engulfing the prior down-candle body.", "chart-identify"),
];

/** Attach demo candles to chart-identify questions. */
export const finalExamWithCharts: QuizQuestion[] = finalExam.map((question) => {
  if (question.id === "fx-8") return { ...question, candles: candlePatterns.hammer };
  if (question.id === "fx-15") return { ...question, candles: candlePatterns["bullish-engulfing"] };
  return question;
});
