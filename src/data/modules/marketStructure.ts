import type { ChartMarker, Lesson, Module, QuizQuestion } from "@/types";
import { uptrendSeries, downtrendSeries, rangeSeries } from "@/lib/candleData";
import { labelStructure } from "@/lib/marketStructure";
import { uid } from "@/lib/utils";

const up = uptrendSeries();
const down = downtrendSeries();
const range = rangeSeries();

const upMarkers = labelStructure(up);
const downMarkers = labelStructure(down);

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

// Uptrend misoli uchun BOS marker: oldingi swing high'dan yuqorida yopiladigan shamni belgilash.
const bosMarker: ChartMarker[] = (() => {
  const highs = upMarkers.filter((m) => m.kind === "HH");
  if (highs.length < 2) return [];
  const ref = highs[highs.length - 2];
  const broken = up.find((c) => c.time > ref.time && c.close > ref.price);
  return broken
    ? [{ id: uid("bos"), time: broken.time, price: broken.high, kind: "bos", text: "BOS", color: "#2962ff" }]
    : [];
})();

const lessons: Lesson[] = [
  {
    id: "ms-swings",
    moduleId: "market-structure",
    title: "Swing Nuqtalari: HH, HL, LH, LL",
    summary: "Market structure'ning to'rtta asosiy elementi.",
    minutes: 8,
    content: [
      { kind: "paragraph", text: "Bozor to'lqinlar bilan harakatlanadi. Har bir to'lqinni o'z turidagi oldingisiga nisbatan nomlash trendni belgilaydi:" },
      { kind: "list", items: [
        "Higher High (HH) — oldingi high'dan yuqori swing high.",
        "Higher Low (HL) — oldingi low'dan yuqori swing low.",
        "Lower High (LH) — oldingi high'dan past swing high.",
        "Lower Low (LL) — oldingi low'dan past swing low.",
      ] },
      { kind: "callout", tone: "bull", title: "Uptrend = HH + HL", text: "Ketma-ket higher high va higher low'lar bullish strukturani belgilaydi." },
      { kind: "callout", tone: "bear", title: "Downtrend = LH + LL", text: "Ketma-ket lower high va lower low'lar bearish strukturani belgilaydi." },
    ],
    examples: [
      { title: "Uptrend strukturasi (avto-belgilangan)", candles: up, markers: upMarkers, caption: "Higher high va higher low'lar yuqoriga taxlanadi." },
    ],
    quiz: [
      q("ms-sw-1", "Uptrend nima bilan belgilanadi?", [["a", "LH va LL"], ["b", "HH va HL"], ["c", "Teng high'lar"], ["d", "Tasodifiy to'lqinlar"]], ["b"], "Uptrend = higher high'lar + higher low'lar."),
      q("ms-sw-2", "Oldingi swing low'dan yuqoridagi swing low bu:", [["a", "Lower Low"], ["b", "Higher Low"], ["c", "Lower High"], ["d", "Higher High"]], ["b"], "Bu Higher Low (HL)."),
    ],
  },
  {
    id: "ms-trends",
    moduleId: "market-structure",
    title: "Trendlar: Uptrend, Downtrend, Range",
    summary: "Savdo qilishdan oldin muhitni aniqlang.",
    minutes: 7,
    content: [
      { kind: "paragraph", text: "Har bir grafik uchta holatdan birida bo'ladi. Avval uni aniqlang — sizning biasingiz va setuplaringiz shunga bog'liq." },
      { kind: "list", items: [
        "Uptrend: discount'ga (HL hududlari) pullback'larda sotib oling.",
        "Downtrend: premium'ga (LH hududlari) ko'tarilishlarda soting.",
        "Range: chetlardan savdo qiling (high'larni soting / low'larni soting) to break bo'lguncha.",
      ] },
    ],
    examples: [
      { title: "Downtrend", candles: down, markers: downMarkers, caption: "Lower high va lower low'lar." },
      { title: "Range", candles: range, caption: "Narx gorizontal chegaralar orasida tebranadi." },
    ],
    quiz: [
      q("ms-tr-1", "Toza downtrend'da nima qilishni afzal ko'rasiz?", [["a", "Tushishlarda sotib olish"], ["b", "Premium'ga ko'tarilishlarda sotish"], ["c", "Long'larni ushlab turish"], ["d", "Barcha savdolardan qochish"]], ["b"], "Trend bilan savdo qiling — premium'ga (LH) ko'tarilishlarda soting."),
    ],
  },
  {
    id: "ms-bos-choch",
    moduleId: "market-structure",
    title: "BOS va CHoCH",
    summary: "Davom etish vs reversalning birinchi belgisi.",
    minutes: 9,
    content: [
      { kind: "heading", text: "Break of Structure (BOS)" },
      { kind: "paragraph", text: "BOS davom etishni tasdiqlaydi: uptrend'da sham oldingi swing high'dan yuqorida yopiladi. Bu dominant order flow saqlanib qolganini bildiradi." },
      { kind: "heading", text: "Change of Character (CHoCH)" },
      { kind: "paragraph", text: "CHoCH — trendga qarshi birinchi break: uptrend'da narx eng so'nggi higher-low'dan pastda yopiladi. Bu trend tugashi mumkinligidan ogohlantiradi va ko'pincha reversaldan oldin keladi." },
      { kind: "callout", tone: "info", title: "Ketma-ketlik", text: "Reversallar odatda shunday kechadi: likvidlik sweep → CHoCH (MSS) → pullback → yangi yo'nalishda yangi BOS." },
    ],
    examples: [
      { title: "Uptrend'da BOS", candles: up, markers: [...upMarkers, ...bosMarker], caption: "Oldingi swing high'dan yuqorida yopilish davom etishni tasdiqlaydi." },
    ],
    quiz: [
      q("ms-bc-1", "Uptrend'da CHoCH bu:", [["a", "Oxirgi high'dan yuqorida yopilish"], ["b", "Oxirgi higher-low'dan pastda yopilish"], ["c", "Doji"], ["d", "Yangi HH"]], ["b"], "CHoCH = trendga qarshi birinchi break (oxirgi HL'dan past)."),
      q("ms-bc-2", "BOS nimani bildiradi?", [["a", "Reversal"], ["b", "Trend davom etishi"], ["c", "Ikkilanish"], ["d", "Past likvidlik"]], ["b"], "BOS trend davom etayotganini tasdiqlaydi."),
    ],
  },
  {
    id: "ms-internal-external",
    moduleId: "market-structure",
    title: "Internal vs External Struktura",
    summary: "Fraktal struktura: to'lqinlar ichidagi to'lqinlar.",
    minutes: 7,
    content: [
      { kind: "paragraph", text: "External (tashqi) struktura — asosiy swing high'dan low'gacha bo'lgan diapazon (yuqori taymfreym harakati). Internal (ichki) struktura — o'sha diapazon ichida shakllanadigan kichikroq pullback strukturasi." },
      { kind: "list", items: [
        "Internal struktura o'zgarishlarini external struktura yo'nalishida savdo qiling.",
        "Discount zonasi ichidagi internal CHoCH keyingi external ko'tarilish to'lqinini bildirishi mumkin.",
        "Market Shift = internal struktura ag'darilib, external strukturani harakatga keltirish uchun moslashganda.",
      ] },
    ],
    quiz: [
      q("ms-ie-1", "Internal struktura nimaga ishora qiladi?", [["a", "Asosiy HTF swing diapazoniga"], ["b", "Asosiy diapazon ichidagi kichikroq pullback strukturasiga"], ["c", "Hajm profiliga"], ["d", "Kunlik ochilishga"]], ["b"], "Internal = kattaroq external swing ichidagi kichikroq struktura."),
    ],
  },
];

export const marketStructureModule: Module = {
  id: "market-structure",
  order: 2,
  title: "Market Structure",
  subtitle: "Narx aslida qanday harakatlanadi",
  description:
    "To'lqinlarni o'qing, trendlarni aniqlang va Break of Structure hamda Change of Character bilan kirishni rejalashtiring.",
  icon: "📈",
  level: "beginner",
  lessons,
};
