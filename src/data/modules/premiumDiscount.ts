import type { Candle, Lesson, Module, QuizQuestion } from "@/types";

const DAY = 86400;
const T0 = 1_700_000_000;
const t = (i: number) => T0 + i * DAY;
const c = (i: number, o: number, h: number, l: number, cl: number): Candle => ({
  time: t(i),
  open: o,
  high: h,
  low: l,
  close: cl,
});

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

// ~99 swing low'dan ~109 swing high'gacha. Equilibrium = 104.
const swing: Candle[] = [
  c(0, 99.2, 99.8, 99.0, 99.6),
  c(1, 99.6, 101.5, 99.4, 101.2),
  c(2, 101.2, 103.5, 101.0, 103.2),
  c(3, 103.2, 105.5, 103.0, 105.2),
  c(4, 105.2, 107.4, 105.0, 107.1),
  c(5, 107.1, 109.0, 106.9, 108.8), // swing high ~109
  c(6, 108.8, 109.0, 106.0, 106.2),
  c(7, 106.2, 106.4, 103.6, 103.8), // equilibrium/discount'ga pullback
];

const low = 99.0;
const high = 109.0;
const eq = (low + high) / 2; // 104
const zones = [
  { id: "premium", type: "premium" as const, startTime: t(0), endTime: t(7), top: high, bottom: eq, color: "#ef5350", label: "Premium (sotish)" },
  { id: "discount", type: "discount" as const, startTime: t(0), endTime: t(7), top: eq, bottom: low, color: "#26a69a", label: "Discount (sotib olish)" },
];
const eqLine = [{ price: eq, color: "#f5b041", title: "Equilibrium 50%" }];

const lessons: Lesson[] = [
  {
    id: "pd-fib",
    moduleId: "premium-discount",
    title: "Fibonacci Diapazoni va Equilibrium",
    summary: "Har qanday diapazonni premium va discount'ga bo'ling.",
    minutes: 8,
    content: [
      { kind: "paragraph", text: "Swing low'dan swing high'gacha Fibonacci chizing. 50% darajasi — Equilibrium, ya'ni adolatli qiymat. Undan yuqorisi hammasi Premium (qimmat); pastdagisi hammasi Discount (arzon)." },
      { kind: "list", items: [
        "Premium zonasi (50% dan yuqori): SOTISH'ni qidiring.",
        "Discount zonasi (50% dan past): SOTIB OLISH'ni qidiring.",
        "Equilibrium (50%): neytral — bu yerda kirishdan saqlaning.",
      ] },
      { kind: "callout", tone: "info", title: "OTE", text: "Optimal Trade Entry — 0.62–0.79 retracement — diapazon ichidagi chuqur discount (long'lar uchun)." },
    ],
    examples: [
      { title: "Premium / Discount bo'linishi", candles: swing, zones, caption: "Equilibrium'dan yuqori = premium (sotish); pastdagisi = discount (sotib olish)." },
    ],
    quiz: [
      q("pd-f-1", "Equilibrium qayerda joylashadi?", [["a", "0% darajada"], ["b", "Diapazonning 50% ida"], ["c", "100% darajada"], ["d", "0.79 retracement'da"]], ["b"], "Equilibrium = savdo diapazonining 50% o'rta nuqtasi."),
      q("pd-f-2", "Discount zonasida nima qilishni qidirasiz?", [["a", "Sotish"], ["b", "Sotib olish"], ["c", "Hech narsa"], ["d", "Barcha savdolarni yopish"]], ["b"], "Discount = arzon = sotib olishni qidiring (bullish kontekstda)."),
    ],
  },
  {
    id: "pd-application",
    moduleId: "premium-discount",
    title: "Premium va Discount'ni qo'llash",
    summary: "Struktura va order block'lar bilan birlashtiring.",
    minutes: 6,
    content: [
      { kind: "paragraph", text: "Premium/discount o'z-o'zidan signal emas, balki filtr. Uni birlashtiring: bullish trendda narx discount'ga qaytib, order block / FVG'ga tegishini kutib, keyin sotib oling." },
      { kind: "do-dont", works: [
        "Uptrend'da discount order block'ni sotib olish",
        "Downtrend'da premium FVG'ni sotish",
        "Equilibrium'ni qisman-nishon sifatida ishlatish",
      ], fails: [
        "Uptrend'da premium'da sotib olish (quvib yurish)",
        "Yuqori taymfreym diapazon chegaralarini e'tiborsiz qoldirish",
        "Equilibrium'da savdoni majburlash",
      ] },
    ],
    quiz: [
      q("pd-a-1", "Bullish trendda eng yaxshi amaliyot qayerda sotib olish?", [["a", "Premium'da"], ["b", "Equilibrium'da"], ["c", "OB/FVG'dagi discount'da"], ["d", "High'da"]], ["c"], "Past riskli kirish uchun discount + confluence (OB/FVG) ni sotib oling."),
    ],
  },
];

export { eqLine };

export const premiumDiscountModule: Module = {
  id: "premium-discount",
  order: 6,
  title: "Premium va Discount",
  subtitle: "Arzon sotib oling, qimmat soting",
  description:
    "Fibonacci, equilibrium va premium/discount zonalaridan foydalanib, faqat qulay narxlarda savdo qiling.",
  icon: "⚖️",
  level: "advanced",
  lessons,
};
