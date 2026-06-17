import type { Lesson, Module, QuizQuestion } from "@/types";

function q(
  id: string,
  prompt: string,
  options: [string, string][],
  correct: string[],
  explanation: string
): QuizQuestion {
  return {
    id,
    type: "single",
    prompt,
    explanation,
    options: options.map(([oid, text]) => ({ id: oid, text })),
    correct,
    points: 1,
  };
}

const lessons: Lesson[] = [
  {
    id: "rm-rr",
    moduleId: "risk-management",
    title: "Risk : Reward Ratio",
    summary: "Why R:R lets you win less than half and still profit.",
    minutes: 7,
    content: [
      { kind: "paragraph", text: "R:R compares what you risk (entry → stop) to what you aim to gain (entry → target). At 1:3, a 40% win rate is profitable. Define R:R BEFORE entering; if it's below ~1:2, skip the trade." },
      { kind: "callout", tone: "info", title: "Expectancy", text: "Expectancy = (WinRate × RR) − (LossRate). Positive expectancy + discipline = a profitable system." },
    ],
    quiz: [
      q("rm-rr-1", "At 1:3 R:R, roughly what win rate breaks even?", [["a", "75%"], ["b", "50%"], ["c", "25%"], ["d", "90%"]], ["c"], "Break-even win rate ≈ 1/(1+RR) = 1/4 = 25%."),
    ],
  },
  {
    id: "rm-sizing",
    moduleId: "risk-management",
    title: "Position Sizing",
    summary: "Translate a risk % into a position size.",
    minutes: 8,
    content: [
      { kind: "paragraph", text: "Never risk a fixed dollar guess — risk a fixed small % of the account (commonly 0.5–1%). Position size = (Account × Risk%) ÷ Stop distance. The Risk Calculator does this for you." },
      { kind: "list", items: [
        "Decide risk % per trade (e.g. 1%).",
        "Measure stop distance in price.",
        "Size = risk amount ÷ stop distance.",
      ] },
    ],
    quiz: [
      q("rm-ps-1", "Position size is calculated from:", [["a", "Account × Risk% ÷ Stop distance"], ["b", "Account × Leverage"], ["c", "A fixed lot always"], ["d", "Target distance only"]], ["a"], "Size = (Account × Risk%) ÷ stop distance."),
    ],
  },
  {
    id: "rm-limits",
    moduleId: "risk-management",
    title: "Daily, Weekly & Monthly Limits",
    summary: "Drawdown guards that keep you in the game.",
    minutes: 6,
    content: [
      { kind: "list", items: [
        "Daily loss limit: stop trading after N losses or X% down (protects against tilt).",
        "Weekly risk cap: limits cumulative weekly drawdown.",
        "Monthly risk cap: a hard ceiling that forces a reset/review.",
      ] },
      { kind: "callout", tone: "warning", title: "Survival first", text: "Capital preservation beats any single setup. The Risk Calculator builds a full envelope for you." },
    ],
    quiz: [
      q("rm-l-1", "A daily loss limit mainly protects against:", [["a", "Slippage"], ["b", "Emotional revenge trading / tilt"], ["c", "Spreads"], ["d", "News"]], ["b"], "It caps damage and prevents tilt-driven revenge trading."),
    ],
  },
];

export const riskManagementModule: Module = {
  id: "risk-management",
  order: 8,
  title: "Risk Management",
  subtitle: "Survive, then thrive",
  description:
    "Master R:R, position sizing and drawdown limits — with built-in lot, risk and R:R calculators.",
  icon: "🛡️",
  level: "professional",
  lessons,
};
