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

// Bullish FVG: sham1 high < sham3 low -> ular orasida gap.
const bullishFVG: Candle[] = [
  c(0, 100, 100.4, 99.6, 100.1),
  c(1, 100.1, 100.6, 99.8, 100.3), // 1-sham: high = 100.6
  c(2, 100.5, 103.2, 100.4, 103.0), // 2-sham: displacement
  c(3, 103.0, 103.6, 101.2, 103.2), // 3-sham: low = 101.2 (> 100.6 => gap)
  c(4, 103.2, 103.4, 100.7, 101.0), // FVG'ni to'ldirish uchun qaytadi
  c(5, 101.0, 104.2, 100.9, 104.0), // yuqoriga davom etish
];
// FVG zonasi = sham1.high (100.6) va sham3.low (101.2) orasida
const bullishFVGZone = [
  {
    id: "fvg-bull",
    type: "fvg" as const,
    startTime: t(1),
    endTime: t(5),
    top: 101.2,
    bottom: 100.6,
    color: "#2962ff",
    label: "Bullish FVG",
  },
];

const lessons: Lesson[] = [
  {
    id: "fvg-basics",
    moduleId: "fvg",
    title: "Fair Value Gap nima?",
    summary: "Bozor muvozanatga keltirmoqchi bo'lgan 3 shamli disbalans.",
    minutes: 8,
    content: [
      { kind: "paragraph", text: "Fair Value Gap (FVG) — 3 shamli pattern bo'lib, unda birinchi va uchinchi shamlarning soyalari ustma-ust tushmaydi, bu agressiv, bir tomonlama harakat (displacement) yaratgan narx bo'shlig'ini qoldiradi." },
      { kind: "list", items: [
        "Bullish FVG: sham-1 high va sham-3 low orasidagi gap (ko'tarilishlarda shakllanadi).",
        "Bearish FVG: sham-1 low va sham-3 high orasidagi gap (tushishlarda shakllanadi).",
        "Narx ko'pincha kamida 50% ni (Consequent Encroachment) to'ldirish uchun qaytadi.",
      ] },
      { kind: "callout", tone: "info", title: "Nima uchun muhim", text: "FVG samarasizlikni belgilaydi. Bozor narxni 'adolatli' yetkazish uchun unga qaytishga moyil bo'lib, sizga kirish zonasini beradi." },
    ],
    examples: [
      { title: "Bullish FVG → to'ldirish → davom etish", candles: bullishFVG, zones: bullishFVGZone, caption: "Sham-1 high va sham-3 low orasidagi gap; narx to'ldirish uchun qaytadi, keyin yuqoriga davom etadi." },
    ],
    quiz: [
      q("fvg-b-1", "Fair Value Gap nimadan hosil bo'ladi?", [["a", "1 shamdan"], ["b", "2 shamdan"], ["c", "Soyalari ustma-ust tushmaydigan 3 shamdan"], ["d", "5 shamdan"]], ["c"], "FVG = sham 1 va 3 soyalari ustma-ust tushmaydigan 3 shamli disbalans."),
      q("fvg-b-2", "Bullish FVG qaysilar orasidagi gap?", [["a", "Sham-1 low va sham-3 high"], ["b", "Sham-1 high va sham-3 low"], ["c", "Ikki teng high"], ["d", "Open va close"]], ["b"], "Bullish FVG = sham-1 high'dan sham-3 low'gacha."),
    ],
  },
  {
    id: "fvg-inversion",
    moduleId: "fvg",
    title: "Inversion FVG",
    summary: "Gap buzilib, polaritetini ag'darganda.",
    minutes: 6,
    content: [
      { kind: "paragraph", text: "Inversion FVG (IFVG) — FVG orqali savdo qilinib, undan narida yopilganda, uni bekor qilganda yuz beradi. Keyin gap rolini ag'daradi: muvaffaqiyatsiz bullish FVG qarshilikka (endi bearish) aylanadi va aksincha." },
      { kind: "callout", tone: "warning", title: "Tasdiq muhim", text: "FVG'ni invertirlangan deb hisoblashdan oldin sham tanasi gap orqali yopilishini kuting — faqat soya yetarli emas." },
    ],
    quiz: [
      q("fvg-i-1", "Inversion FVG qachon yuz beradi?", [["a", "Narx gapning 50% ni to'ldirganda"], ["b", "Narx gap orqali yopilib, uning rolini ag'darganda"], ["c", "Hajm sakraganda"], ["d", "Ikki FVG ustma-ust tushganda"]], ["b"], "Buzilgan (orqali yopilgan) FVG polaritetini ag'daradi = inversion FVG."),
    ],
  },
];

export const fvgModule: Module = {
  id: "fvg",
  order: 5,
  title: "Fair Value Gap (FVG)",
  subtitle: "Bozor samarasizligini savdo qilish",
  description:
    "Bullish/bearish FVG'larni aniqlang, 50% to'ldirishni tushuning va gaplar polaritetini ag'darganda inversion FVG'larni savdo qiling.",
  icon: "🟪",
  level: "intermediate",
  lessons,
};
