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

// Sweep low -> MSS yuqoriga -> FVG'ga retrace -> long
const sweepMss: Candle[] = [
  c(0, 102, 102.4, 101.4, 101.6),
  c(1, 101.6, 101.8, 100.6, 100.8),
  c(2, 100.8, 101.0, 99.2, 99.5), // swing low
  c(3, 99.5, 99.7, 98.4, 98.7), // low ostidan sweep (SSL grab)
  c(4, 98.7, 102.0, 98.6, 101.9), // yuqoriga displacement = MSS / CHoCH
  c(5, 101.9, 102.2, 100.4, 100.6), // FVG'ga retrace
  c(6, 100.6, 103.6, 100.5, 103.4), // davom etish
];
const sweepMssMarkers = [
  { id: "sm-sweep", time: t(3), price: 98.4, kind: "sweep" as const, text: "Sweep SSL", color: "#f5b041" },
  { id: "sm-mss", time: t(4), price: 102.0, kind: "choch" as const, text: "MSS", color: "#2962ff" },
  { id: "sm-entry", time: t(5), price: 100.6, kind: "entry" as const, text: "Kirish (FVG)", color: "#2962ff" },
];
const sweepMssZones = [
  { id: "sm-fvg", type: "fvg" as const, startTime: t(4), endTime: t(6), top: 100.6, bottom: 99.7, color: "#2962ff", label: "FVG kirish" },
];

const lessons: Lesson[] = [
  {
    id: "em-sweep-mss",
    moduleId: "entry-models",
    title: "Liquidity Sweep + MSS",
    summary: "Asosiy ICT reversal kirishi.",
    minutes: 10,
    content: [
      { kind: "paragraph", text: "ICT'ning asosiy modeli: narx likvidlik to'plamini sweep qiladi (stop'larni ishga tushiradi), keyin Market Structure Shift (displacement bilan agressiv CHoCH) chizadi. Siz hosil bo'lgan FVG yoki order block'ga retrace'da kirasiz." },
      { kind: "list", items: [
        "1. Olinishi kerak bo'lgan likvidlikni aniqlang (teng low'lar / swing low).",
        "2. Sweep + displacement (MSS) ni kuting.",
        "3. Displacement qoldirgan FVG / OB'ni belgilang.",
        "4. Retrace'da kiring; stop'ni sweep ortidan qo'ying; qarama-qarshi likvidlikni nishonlang.",
      ] },
    ],
    examples: [
      { title: "Sweep low → MSS → FVG kirish", candles: sweepMss, zones: sweepMssZones, markers: sweepMssMarkers, caption: "Low ostidagi stop'lar sweep qilinadi, struktura yuqoriga o'zgaradi, FVG retrace'da kirish." },
    ],
    quiz: [
      q("em-sm-1", "Sweep+MSS long'da stop qayerga qo'yiladi?", [["a", "Equilibrium'da"], ["b", "Sweep low ostida"], ["c", "Kirish ustida"], ["d", "FVG cho'qqisida"]], ["b"], "Stop sweep low'idan narida turadi — bu bekor qilish nuqtasi."),
    ],
  },
  {
    id: "em-ob-fvg",
    moduleId: "entry-models",
    title: "Order Block va FVG Kirishlari",
    summary: "Displacement'dan ikkita aniq kirish zonasi.",
    minutes: 8,
    content: [
      { kind: "paragraph", text: "Struktura o'zgarishidan keyin displacement order block va ko'pincha FVG qoldiradi. Ikkalasi ham to'g'ri kirish zonalari. FVG biroz chuqurroq, ko'pincha yaxshiroq narxli kirish beradi; OB esa strukturaviy kirish beradi. Ko'p treyderlar eng yuqori ehtimolli kirish uchun OB + FVG ustma-ustligidan foydalanadi." },
    ],
    quiz: [
      q("em-of-1", "Eng yuqori ehtimolli kirish zonasi ko'pincha qayerda?", [["a", "Tasodifiy retrace"], ["b", "OB va FVG ustma-ust tushgan joyda"], ["c", "High'da"], ["d", "Faqat equilibrium'da"]], ["b"], "OB + FVG confluence narx o'sha yerda reversal qilishining ikki sababini birlashtiradi."),
    ],
  },
  {
    id: "em-smt-judas",
    moduleId: "entry-models",
    title: "SMT Divergence va Judas Swing",
    summary: "Bozolararo divergensiya va sessiya manipulyatsiyasi.",
    minutes: 9,
    content: [
      { kind: "heading", text: "SMT Divergence" },
      { kind: "paragraph", text: "Ikki o'zaro bog'liq bozorni solishtiring (masalan, ES vs NQ yoki EURUSD vs GBPUSD). Biri higher high qilib, bog'liq bo'lgani buni qila olmasa, bu divergensiya zaif momentum va ehtimoliy reversaldan dalolat beradi — ko'pincha likvidlik sweep'ida." },
      { kind: "heading", text: "Judas Swing" },
      { kind: "paragraph", text: "Sessiya boshida (ko'pincha London) treyderlarni tuzoqqa solish uchun likvidlikni NOTO'G'RI yo'nalishda yuradigan, keyin kunlik haqiqiy yo'nalishga reversal qiladigan soxta harakat." },
    ],
    quiz: [
      q("em-sj-1", "Judas Swing bu:", [["a", "Tasdiqlangan trend"], ["b", "Treyderlarni tuzoqqa soluvchi soxta erta-sessiya harakati"], ["c", "Order block turi"], ["d", "Risk modeli"]], ["b"], "Judas swing = haqiqiy harakatdan oldin likvidlik olish uchun soxta sessiya harakati."),
    ],
  },
  {
    id: "em-killzones",
    moduleId: "entry-models",
    title: "London va New York Kill Zone'lar",
    summary: "Likvidlik va volatillik cho'qqida bo'lganda savdo qiling.",
    minutes: 7,
    content: [
      { kind: "list", items: [
        "London Kill Zone: ~02:00–05:00 EST — ko'pincha kun yo'nalishini belgilaydi.",
        "New York Kill Zone: ~07:00–10:00 EST — kuchli davom etish yoki reversal.",
        "Yangi kirishlar uchun past likvidlikli davrlardan (tushlik, kech sessiya) saqlaning.",
      ] },
      { kind: "callout", tone: "info", title: "Vaqt + narx", text: "ICT setuplari to'g'ri VAQT (kill zone) ni to'g'ri NARX (PD array: premium/discount'dagi OB/FVG) bilan birlashtiradi." },
    ],
    quiz: [
      q("em-kz-1", "Kill zone'lar nima uchun qimmatli?", [["a", "Past volatillik taklif qiladi"], ["b", "Jamlangan likvidlik va volatillik oynalari taklif qiladi"], ["c", "Kafolatlangan foyda"], ["d", "Spread yo'q"]], ["b"], "Kill zone'lar likvidlik va volatillikni ma'lum oynalarga jamlaydi."),
    ],
  },
];

export const entryModelsModule: Module = {
  id: "entry-models",
  order: 7,
  title: "ICT Entry Modellari",
  subtitle: "Bo'laklarni birlashtirish",
  description:
    "Likvidlik, struktura o'zgarishlari, order block'lar va FVG'larni takrorlanadigan kirish modellariga birlashtiring — SMT, Judas swing va kill zone'lar bilan.",
  icon: "🎯",
  level: "advanced",
  lessons,
};
