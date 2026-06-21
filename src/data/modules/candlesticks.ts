import type { Lesson, Module, QuizQuestion } from "@/types";
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

const lessons: Lesson[] = [
  {
    id: "cs-anatomy",
    moduleId: "candlesticks",
    title: "Sham anatomiyasi: Tana va Soyalar",
    summary: "Open, high, low, close va tana/soya nimani bildiradi.",
    minutes: 6,
    content: [
      { kind: "paragraph", text: "Har bir shamcha ma'lum vaqt oralig'idagi to'rtta narxni kodlaydi: Open (ochilish), High (eng yuqori), Low (eng past) va Close (yopilish) — qisqacha OHLC. Qalin qism — tana (ochilishdan yopilishgacha), ingichka chiziqlar esa soyalar (yuqori va past narxgacha cho'zilgan)." },
      { kind: "list", items: [
        "Tana = ochilish va yopilish orasidagi masofa.",
        "Yuqori soya = yuqori narxlarning rad etilishi.",
        "Pastki soya = past narxlarning rad etilishi.",
        "Yashil/ko'k tana = ochilishdan yuqorida yopilish (bullish).",
        "Qizil tana = ochilishdan pastda yopilish (bearish).",
      ] },
      { kind: "callout", tone: "info", title: "Kontekst — eng muhimi", text: "Bitta sham kamdan-kam holatda ko'p narsani anglatadi. Shamlarni doim struktura, likvidlik va trendga nisbatan o'qing." },
    ],
    examples: [
      { title: "Kuchli bullish sham", candles: candlePatterns.bullish, caption: "Katta tana, yopilish high'ga yaqin — xaridorlar nazoratda." },
    ],
    quiz: [
      q("cs-anatomy-1", "Shamcha qaysi narxlarni kodlaydi?", [["a", "Faqat open va close"], ["b", "Open, High, Low, Close"], ["c", "Faqat High va Low"], ["d", "Hajm va narx"]], ["b"], "Sham o'z davri uchun OHLC ni kodlaydi."),
    ],
  },
  {
    id: "cs-bullish-bearish",
    moduleId: "candlesticks",
    title: "Bullish va Bearish Shamlar",
    summary: "Tana o'lchami va yopilish joyidan momentumni o'qish.",
    minutes: 6,
    content: [
      { kind: "paragraph", text: "Bullish sham o'z ochilishidan yuqorida yopiladi; bearish sham esa pastda yopiladi. Kichik soyalar bilan katta tanalar kuchli, bir tomonlama momentumni (displacement) bildiradi. Kichik tanalar ikkilanishni bildiradi." },
      { kind: "do-dont", works: [
        "Muhim darajada likvidlik olingandan keyin",
        "Tana aniq displacement (BOS) ko'rsatganda",
        "Yuqori taymfreym trendiga mos kelganda",
      ], fails: [
        "Tor diapazon o'rtasida (shovqin)",
        "Kuchli yuqori taymfreym trendiga qarshi",
        "Hajm/ishonch yo'q bo'lganda",
      ] },
    ],
    examples: [
      { title: "Bullish sham", candles: candlePatterns.bullish, caption: "Yopilish high'ga yaqin = kuchli talab." },
      { title: "Bearish sham", candles: candlePatterns.bearish, caption: "Yopilish low'ga yaqin = kuchli taklif." },
    ],
    quiz: [
      q("cs-bb-1", "Kichik soyali katta bullish tana odatda nimani bildiradi?", [["a", "Ikkilanish"], ["b", "Kuchli xarid momentumi"], ["c", "Reversal kafolatlangan"], ["d", "Past hajm"]], ["b"], "Kichik soyali katta tana yo'nalishli ishonchni (displacement) ko'rsatadi."),
    ],
  },
  {
    id: "cs-doji",
    moduleId: "candlesticks",
    title: "Doji — Ikkilanish",
    summary: "Xaridorlar va sotuvchilar muvozanatga kelganda.",
    minutes: 5,
    content: [
      { kind: "paragraph", text: "Doji deyarli bir xil narxda ochilib yopiladi va juda kichik tana hosil qiladi. U xaridorlar va sotuvchilar o'rtasidagi muvozanatni aks ettiradi. Trend oxirida yoki muhim darajada u to'xtash yoki reversaldan ogohlantirishi mumkin." },
      { kind: "callout", tone: "warning", title: "Doji'ga joylashuv kerak", text: "Diapazon o'rtasidagi doji ma'nosiz. Sweep'dan keyin premium/discount chetidagi doji esa haqiqiy ogohlantirish." },
    ],
    examples: [{ title: "Doji", candles: candlePatterns.doji, caption: "Ochilish ≈ yopilish. Ikkilanish." }],
    quiz: [
      q("cs-doji-1", "Doji asosan nimani bildiradi?", [["a", "Kuchli trend"], ["b", "Ikkilanish / muvozanat"], ["c", "Yuqori hajm"], ["d", "Tasdiqlangan reversal"]], ["b"], "Doji = ochilish va yopilish deyarli teng = ikkilanish."),
    ],
  },
  {
    id: "cs-hammer-family",
    moduleId: "candlesticks",
    title: "Hammer, Inverted Hammer, Hanging Man va Shooting Star",
    summary: "Bitta shamli rad etish oilasi va ularning konteksti.",
    minutes: 9,
    content: [
      { kind: "heading", text: "Bir xil shakllar, turli kontekst" },
      { kind: "list", items: [
        "Hammer: uzun pastki soya, yuqorida kichik tana — downtrend'dan keyin bullish reversal.",
        "Inverted Hammer: downtrend'dan keyin uzun yuqori soya — bullish reversal ehtimoli (tasdiq kerak).",
        "Hanging Man: hammer'ga o'xshaydi, lekin uptrend cho'qqisida — bearish ogohlantirish.",
        "Shooting Star: uptrend cho'qqisida uzun yuqori soya — bearish reversal.",
      ] },
      { kind: "callout", tone: "info", title: "Soya = rad etish", text: "Uzun soya narx ekstremumga itarilib, keyin rad etilganini ko'rsatadi. Ma'no yo'nalishi qayerda shakllanganiga bog'liq." },
    ],
    examples: [
      { title: "Hammer (tub)", candles: candlePatterns.hammer, caption: "Tushishdan keyin uzun pastki soya low'larni rad etadi." },
      { title: "Inverted Hammer", candles: candlePatterns["inverted-hammer"], caption: "Downtrend'dan keyin uzun yuqori soya." },
      { title: "Shooting Star (cho'qqi)", candles: candlePatterns["shooting-star"], caption: "Ko'tarilishdan keyin uzun yuqori soya high'larni rad etadi." },
      { title: "Hanging Man (cho'qqi)", candles: candlePatterns["hanging-man"], caption: "Hammer shakli, lekin cho'qqida — bearish ogohlantirish." },
    ],
    quiz: [
      q("cs-hf-1", "Uptrend CHO'QQISIDAGI uzun pastki soyali sham bu:", [["a", "Hammer"], ["b", "Hanging Man"], ["c", "Shooting Star"], ["d", "Doji"]], ["b"], "Hammer bilan bir xil shakl, lekin cho'qqida = Hanging Man (bearish ogohlantirish)."),
      q("cs-hf-2", "Shooting Star qachon shakllanadi?", [["a", "Downtrend'dan keyin"], ["b", "Uzun yuqori soya bilan uptrend'dan keyin"], ["c", "Faqat diapazonda"], ["d", "Uzun pastki soya bilan"]], ["b"], "Shooting star = uptrend cho'qqisida uzun yuqori soya."),
    ],
  },
  {
    id: "cs-engulfing",
    moduleId: "candlesticks",
    title: "Engulfing (Yutuvchi) Patternlar",
    summary: "Muhim darajalarda ikki shamli momentum o'zgarishi.",
    minutes: 7,
    content: [
      { kind: "paragraph", text: "Bullish Engulfing — tanasi oldingi tushuvchi shamning tanasini to'liq qoplaydigan katta ko'taruvchi sham — talab taklifdan ustun keldi. Bearish Engulfing esa aksincha. Eng ishonchlisi — likvidlik olingandan keyin swing nuqtalarida." },
    ],
    examples: [
      { title: "Bullish Engulfing", candles: candlePatterns["bullish-engulfing"], caption: "Ko'taruvchi sham oldingi tushuvchi sham tanasini yutadi." },
      { title: "Bearish Engulfing", candles: candlePatterns["bearish-engulfing"], caption: "Tushuvchi sham oldingi ko'taruvchi sham tanasini yutadi." },
    ],
    quiz: [
      q("cs-eng-1", "Bullish engulfing eng kuchli bo'ladi, agar u qayerda paydo bo'lsa:", [["a", "Diapazon o'rtasida"], ["b", "Likvidlik sweep'idan keyin swing low'da"], ["c", "Past hajmda"], ["d", "Trendga qarshi tasodifan"]], ["b"], "Joylashuv muhim — swing low/sweep'da u haqiqiy ma'noga ega."),
    ],
  },
  {
    id: "cs-stars",
    moduleId: "candlesticks",
    title: "Morning Star va Evening Star",
    summary: "Uch shamli reversal formatsiyalari.",
    minutes: 7,
    content: [
      { kind: "list", items: [
        "Morning Star (bullish): katta tushuvchi sham, kichik ikkilanish shami, katta ko'taruvchi sham.",
        "Evening Star (bearish): katta ko'taruvchi sham, kichik ikkilanish shami, katta tushuvchi sham.",
        "O'rtadagi 'yulduz' reversal shami tasdiqlanishidan oldin momentum to'xtaganini ko'rsatadi.",
      ] },
    ],
    examples: [
      { title: "Morning Star", candles: candlePatterns["morning-star"], caption: "Tushish → ikkilanish → kuchli ko'tarilish. Bullish reversal." },
      { title: "Evening Star", candles: candlePatterns["evening-star"], caption: "Ko'tarilish → ikkilanish → kuchli tushish. Bearish reversal." },
    ],
    quiz: [
      q("cs-star-1", "Morning Star'ning o'rtadagi shami nimani bildiradi?", [["a", "Kuchli davom etish"], ["b", "Momentum to'xtashi / ikkilanish"], ["c", "Gap"], ["d", "Yuqori hajmli xarid"]], ["b"], "Kichik yulduz shami oldingi momentum to'xtaganini ko'rsatadi."),
    ],
  },
  {
    id: "cs-harami-tweezers",
    moduleId: "candlesticks",
    title: "Harami va Tweezers",
    summary: "Ichki-bar sekinlashuvi va mos ekstremumli reversallar.",
    minutes: 7,
    content: [
      { kind: "list", items: [
        "Harami: tanasi oldingi katta sham tanasi ichida joylashgan kichik sham — momentum sekinlashmoqda.",
        "Tweezer Top: (deyarli) teng high'li ikki sham — bir darajaning ikki marta rad etilishi (bearish).",
        "Tweezer Bottom: (deyarli) teng low'li ikki sham — qo'llab-quvvatlash ikki marta ushlandi (bullish).",
      ] },
      { kind: "callout", tone: "info", title: "Teng high/low = likvidlik", text: "Tweezers ko'pincha likvidlik joylashgan teng high/low'larni belgilaydi — ICT'ning tez-tez nishoni." },
    ],
    examples: [
      { title: "Bullish Harami", candles: candlePatterns["bullish-harami"], caption: "Oldingi bearish tana ichida kichik bullish sham." },
      { title: "Tweezer Bottom", candles: candlePatterns["tweezer-bottom"], caption: "Ikki teng low — qo'llab-quvvatlash himoyalandi." },
    ],
    quiz: [
      q("cs-ht-1", "Tweezer Top nimadan hosil bo'ladi?", [["a", "Ikki teng low"], ["b", "Ikki (deyarli) teng high"], ["c", "Bitta uzun soya"], ["d", "Uch sham"]], ["b"], "Tweezer top = bir darajani rad etuvchi ikki mos high."),
      {
        id: "cs-ht-match",
        type: "drag-match",
        prompt: "Patternni uning ma'nosiga moslang:",
        explanation: "Hammer va Morning Star — bullish reversal; Shooting Star — bearish reversal; Doji — ikkilanish.",
        pairs: [
          { left: "Hammer", right: "Bullish reversal (pastki soya)" },
          { left: "Shooting Star", right: "Bearish reversal (yuqori soya)" },
          { left: "Doji", right: "Ikkilanish / muvozanat" },
          { left: "Morning Star", right: "Uch shamli bullish reversal" },
        ],
        points: 1,
      },
    ],
  },
];

export const candlesticksModule: Module = {
  id: "candlesticks",
  order: 1,
  title: "Yapon Shamchalari",
  subtitle: "Narx harakatini bir shamdan o'qing",
  description:
    "Narx tilini o'rganing: tanalar, soyalar va klassik reversal hamda davom etish patternlari — har doim to'g'ri kontekstda.",
  icon: "🕯️",
  level: "beginner",
  lessons,
};
