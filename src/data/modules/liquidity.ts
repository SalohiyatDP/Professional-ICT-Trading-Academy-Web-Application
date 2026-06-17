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

// Teng high'lar, keyin ular ustidan sweep va reversal.
const equalHighsSweep: Candle[] = [
  c(0, 100, 101, 99.5, 100.8),
  c(1, 100.8, 103, 100.5, 102.8), // high ~103
  c(2, 102.8, 103.05, 101, 101.4), // teng high ~103
  c(3, 101.4, 103.02, 100.8, 102.6), // teng high ~103
  c(4, 102.6, 104.4, 102.4, 102.7), // teng high'lar ustidan sweep
  c(5, 102.7, 102.9, 99.6, 99.9), // pastga reversal
  c(6, 99.9, 100.2, 97.8, 98.1),
];

const equalHighsMarkers = [
  { id: "eqh-sweep", time: t(4), price: 104.4, kind: "sweep" as const, text: "Sweep BSL", color: "#f5b041" },
];
const equalHighsZones = [
  {
    id: "bsl",
    type: "liquidity" as const,
    startTime: t(1),
    endTime: t(4),
    top: 103.1,
    bottom: 102.9,
    color: "#f5b041",
    label: "Buy-side likvidlik (teng high'lar)",
  },
];

const lessons: Lesson[] = [
  {
    id: "lq-what",
    moduleId: "liquidity",
    title: "Likvidlik nima?",
    summary: "Yirik pozitsiyalarni to'ldirish uchun bozorga kerak bo'lgan kutayotgan orderlar.",
    minutes: 7,
    content: [
      { kind: "paragraph", text: "Likvidlik — kutayotgan orderlar to'plami, asosan stop-loss va pending orderlar. Yirik o'yinchilar katta hajmni ortiqcha slippage'siz to'ldirish uchun shu likvidlikka muhtoj, shuning uchun narx doimo unga tortiladi." },
      { kind: "list", items: [
        "Buy-side likvidlik (BSL): high'lar USTIDA joylashgan buy stop'lar (short stop'lar, breakout buy'lar).",
        "Sell-side likvidlik (SSL): low'lar OSTIDA joylashgan sell stop'lar (long stop'lar, breakout sell'lar).",
      ] },
      { kind: "callout", tone: "info", title: "Bank kabi fikrlang", text: "So'rang: aniq stop'lar qayerda? Narx ko'pincha reversal qilishdan oldin o'sha yerga boradi." },
    ],
    quiz: [
      q("lq-w-1", "Buy-side likvidlik qayerda joylashadi?", [["a", "Swing low'lar ostida"], ["b", "Swing high'lar ustida"], ["c", "Ochilishda"], ["d", "Diapazon o'rtasida"]], ["b"], "Buy stop'lar high'lar ustida joylashadi = buy-side likvidlik."),
    ],
  },
  {
    id: "lq-equal",
    moduleId: "liquidity",
    title: "Teng High'lar va Teng Low'lar",
    summary: "Aniq likvidlik magnitlari.",
    minutes: 6,
    content: [
      { kind: "paragraph", text: "Narx bir xil darajada ikki yoki undan ortiq high (yoki low) chizganida, stop'lar ulardan sal narida to'planadi. Bu teng high/low'lar yuqori ehtimolli likvidlik nishonlaridir." },
    ],
    examples: [
      { title: "Teng high'lar → sweep", candles: equalHighsSweep, zones: equalHighsZones, markers: equalHighsMarkers, caption: "Teng high'lar ustidagi stop'lar sweep qilinadi, keyin narx reversal qiladi." },
    ],
    quiz: [
      q("lq-e-1", "Teng high'lar narxni nima uchun jalb qiladi?", [["a", "Ular tasodifiy"], ["b", "Ularning ustida stop'lar to'planadi"], ["c", "Hajm past"], ["d", "Ular qo'llab-quvvatlash"]], ["b"], "Teng high'lar = ularning ustida joylashgan aniq buy-side likvidlik."),
    ],
  },
  {
    id: "lq-sweep",
    moduleId: "liquidity",
    title: "Liquidity Grab, Sweep va Stop Hunt",
    summary: "ICT setuplarini boshlaydigan tikan-va-reversal.",
    minutes: 8,
    content: [
      { kind: "paragraph", text: "Likvidlik sweep (ya'ni grab yoki stop hunt) — narx stop'larni ishga tushirish uchun high/low orqali qisqa muddat o'tib, keyin keskin reversal qilishi. Daraja ortidagi soya — darhol rad etish bilan — bu uning belgisi." },
      { kind: "do-dont", works: [
        "Yuqori taymfreym darajasiga / order block'ga sweep",
        "Darhol CHoCH / displacement bilan kuzatilgan sweep",
        "Kill zone davomidagi sweep",
      ], fails: [
        "Har bir soyani sweep deb hisoblash",
        "Struktura o'zgarishisiz sweep'ni fade qilish",
        "Yuqori taymfreym trendini e'tiborsiz qoldirish",
      ] },
    ],
    examples: [
      { title: "Teng high'lar ustida stop hunt", candles: equalHighsSweep, zones: equalHighsZones, markers: equalHighsMarkers, caption: "Narx likvidlik ustiga tikiladi, keyin qattiq reversal qiladi." },
    ],
    quiz: [
      q("lq-s-1", "Likvidlik sweep eng yaxshi nima bilan tasdiqlanadi?", [["a", "Darajadan ancha narida yopilish"], ["b", "Darhol rad etish + struktura o'zgarishi"], ["c", "Past hajm"], ["d", "Bir necha kundan keyin doji"]], ["b"], "Sweep + darhol rad etish va CHoCH/displacement niyatni tasdiqlaydi."),
      q("lq-s-2", "Swing low ostidagi stop hunt nimani nishonga oladi?", [["a", "Buy-side likvidlik"], ["b", "Sell-side likvidlik"], ["c", "Equilibrium"], ["d", "Ochilish"]], ["b"], "Low'lar ostida sell stop'lar joylashadi = sell-side likvidlik."),
    ],
  },
];

export const liquidityModule: Module = {
  id: "liquidity",
  order: 3,
  title: "Liquidity (Likvidlik)",
  subtitle: "Stop'lar qayerda yashaydi",
  description:
    "Buy-side va sell-side likvidlikni toping, teng high/low'larni aniqlang va sweep hamda stop hunt'larni taning.",
  icon: "💧",
  level: "intermediate",
  lessons,
};
