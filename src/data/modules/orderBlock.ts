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

// Bullish OB: kuchli ko'tarilishdan oldingi oxirgi tushuvchi sham (3-indeks), keyin mitigatsiya uchun qaytish.
const bullishOB: Candle[] = [
  c(0, 101, 101.4, 100.4, 100.7),
  c(1, 100.7, 100.9, 100, 100.2),
  c(2, 100.2, 100.4, 99.4, 99.6),
  c(3, 99.6, 99.8, 98.8, 99.0), // <-- bullish order block (oxirgi tushuvchi sham)
  c(4, 99.0, 102.2, 98.95, 102.0), // yuqoriga displacement (BOS)
  c(5, 102.0, 103.4, 101.8, 103.1),
  c(6, 103.1, 103.3, 99.4, 99.6), // OB'ga qaytish (mitigatsiya)
  c(7, 99.6, 104.0, 99.3, 103.8), // davom etish
];

const bullishOBZone = [
  {
    id: "ob-bull",
    type: "order-block" as const,
    startTime: t(3),
    endTime: t(7),
    top: 99.8,
    bottom: 98.8,
    color: "#26a69a",
    label: "Bullish Order Block",
  },
];
const bullishOBMarkers = [
  { id: "ob-entry", time: t(6), price: 99.6, kind: "entry" as const, text: "Kirish", color: "#2962ff" },
  { id: "ob-sl", time: t(6), price: 98.8, kind: "sl" as const, text: "SL", color: "#ef5350" },
  { id: "ob-tp", time: t(7), price: 104.0, kind: "tp" as const, text: "TP", color: "#26a69a" },
];

const lessons: Lesson[] = [
  {
    id: "ob-bullish",
    moduleId: "order-block",
    title: "Bullish va Bearish Order Block'lar",
    summary: "Displacement'dan oldingi oxirgi qarama-qarshi sham.",
    minutes: 9,
    content: [
      { kind: "paragraph", text: "Order Block (OB) — strukturani buzadigan impulsiv harakatdan oldingi oxirgi qarama-qarshi rangli sham. Bullish OB — kuchli ko'tarilishdan oldingi oxirgi tushuvchi sham; bearish OB — kuchli tushishdan oldingi oxirgi ko'taruvchi sham. Narx ko'pincha davom etishdan oldin OB'ni mitigatsiya qilish uchun qaytadi." },
      { kind: "list", items: [
        "OB shamining tanasini belgilang (ba'zilar soya bilan to'liq diapazonni ishlatadi).",
        "Kirish: OB'ga qaytishda (limit yoki tasdiq bilan).",
        "Stop: OB'ning narigi tomonidan tashqarida.",
        "Nishon: keyingi likvidlik to'plami / qarama-qarshi OB.",
      ] },
      { kind: "callout", tone: "bull", title: "To'g'ri OB tekshiruvi", text: "Oxirgi qarama-qarshi sham + undan displacement/BOS + mitigatsiya qilinmagan (narx hali qaytmagan)." },
    ],
    examples: [
      { title: "Bullish OB → mitigatsiya → davom etish", candles: bullishOB, zones: bullishOBZone, markers: bullishOBMarkers, caption: "Narx oxirgi tushuvchi shamga qaytadi, keyin ko'tariladi. Kirish/SL/TP ko'rsatilgan." },
    ],
    quiz: [
      q("ob-b-1", "Bullish order block bu:", [["a", "Tushishdan oldingi oxirgi ko'taruvchi sham"], ["b", "Kuchli ko'tarilishdan oldingi oxirgi tushuvchi sham"], ["c", "Har qanday yashil sham"], ["d", "Doji"]], ["b"], "Bullish OB = bullish displacement'dan oldingi oxirgi tushuvchi sham."),
      q("ob-b-2", "Bullish OB savdosida stop'ni qayerga qo'yasiz?", [["a", "OB ustiga"], ["b", "Kirishda"], ["c", "OB'ning narigi (past) tomonidan pastda"], ["d", "Equilibrium'da"]], ["c"], "Stop OB low'idan narida turadi, shunda haqiqiy bekor qilish sizni yopadi."),
    ],
  },
  {
    id: "ob-mitigation-breaker",
    moduleId: "order-block",
    title: "Mitigation va Breaker Block'lar",
    summary: "Zonalarni qayta ishlatish va ularning muvaffaqiyatsizligini savdo qilish.",
    minutes: 8,
    content: [
      { kind: "heading", text: "Mitigation Block" },
      { kind: "paragraph", text: "Narx davom etishdan oldin tuzoqqa tushgan orderlarni 'mitigatsiya' qilish uchun order block'ga qaytganda, o'sha qayta-test zonasi mitigation block hisoblanadi. U trend yo'nalishida aniqroq kirish beradi." },
      { kind: "heading", text: "Breaker Block" },
      { kind: "paragraph", text: "Breaker order block MUVAFFAQIYATSIZ bo'lganda shakllanadi. Narx u orqali sinadi; sinish zonasi keyin rolini ag'daradi (eski qo'llab-quvvatlash qarshilikka aylanadi) va yangi yo'nalishda kirish beradi." },
      { kind: "callout", tone: "warning", title: "OB vs Breaker", text: "Order block o'zining asl harakati BILAN ishlaydi; breaker esa unga QARSHI ishlaydi (OB buzilgandan keyin)." },
    ],
    quiz: [
      q("ob-mb-1", "Breaker block qachon shakllanadi?", [["a", "OB mukammal ushlaganda"], ["b", "OB muvaffaqiyatsiz bo'lib, sinish zonasi rolini ag'darganda"], ["c", "Hajm qurib qolganda"], ["d", "Doji paydo bo'lganda"]], ["b"], "Breaker — zonasi qarama-qarshi rolga ag'darilgan muvaffaqiyatsiz OB."),
    ],
  },
];

export const orderBlockModule: Module = {
  id: "order-block",
  order: 4,
  title: "Order Block'lar",
  subtitle: "Institutsional izlar",
  description:
    "Bullish/bearish order block'larni aniqlang va mitigation hamda breaker block'larni aniq kirish, stop va nishonlar bilan savdo qiling.",
  icon: "🟦",
  level: "intermediate",
  lessons,
};
