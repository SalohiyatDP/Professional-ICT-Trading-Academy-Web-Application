import type { ModuleId, TutorMessage } from "@/types";
import { uid } from "./utils";

/**
 * 100% offline "AI" repetitor.
 * Tanlangan bilim bazasi + kalit so'z baholash dvigateli. Internet yo'q, deterministik.
 */

interface KnowledgeEntry {
  keywords: string[];
  topic: string;
  answer: string;
  related?: { moduleId: ModuleId; lessonId?: string }[];
}

const KB: KnowledgeEntry[] = [
  {
    keywords: ["order block", "ob", "orderblock", "bullish order block", "bearish order block"],
    topic: "Order Block",
    answer:
      "Order Block — strukturani buzadigan impulsiv harakatdan oldingi oxirgi qarama-qarshi rangli sham. Bullish OB — kuchli ko'tarilishdan oldingi oxirgi tushuvchi sham; bearish OB — kuchli tushishdan oldingi oxirgi ko'taruvchi sham. Institutlar u yerda to'ldirilmagan orderlar qoldiradi, shuning uchun narx ko'pincha davom etishdan oldin zonani 'mitigatsiya' qilish uchun qaytadi. Kirish: OB tanasini (yoki 50% / open) belgilang, stop'ni sham soyasidan narida qo'ying va keyingi likvidlik to'plamini nishonlang.",
    related: [{ moduleId: "order-block" }],
  },
  {
    keywords: ["fvg", "fair value gap", "imbalance", "disbalans", "gap", "inversion fvg"],
    topic: "Fair Value Gap (FVG)",
    answer:
      "Fair Value Gap — 3 shamli disbalans bo'lib, unda 1-sham va 3-sham soyalari ustma-ust tushmaydi, samarasizlik qoldiradi. Bullish FVG ko'tarilishlarda shakllanadi (sham-1 high va sham-3 low orasidagi gap); bearish FVG tushishlarda. Narx odatda gapning kamida 50% ini (Consequent Encroachment) to'ldirish uchun qaytadi. Inversion FVG — buzilib, keyin polaritetini ag'darib, qo'llab-quvvatlash/qarshilik vazifasini bajaruvchi gap.",
    related: [{ moduleId: "fvg" }],
  },
  {
    keywords: ["bos", "break of structure", "struktura buzilishi"],
    topic: "Break of Structure (BOS)",
    answer:
      "Break of Structure trend davom etishini tasdiqlaydi: uptrend'da BOS oldingi swing high ustida yopilish; downtrend'da oldingi swing low ostida yopilish. Bu dominant order flow saqlanib qolganini bildiradi. BOS'ni kuting, keyin order block yoki FVG'ga pullback'da kirishni qidiring.",
    related: [{ moduleId: "market-structure" }],
  },
  {
    keywords: ["choch", "change of character", "character", "mss", "market structure shift"],
    topic: "Change of Character (CHoCH / MSS)",
    answer:
      "Change of Character — ehtimoliy reversalning birinchi belgisi: narx mavjud trendga qarshi eng so'nggi qarama-qarshi swing'ni buzadi (masalan, uptrend'da oxirgi higher-low'ni buzadi). Market Structure Shift (MSS) — agressiv CHoCH, odatda likvidlik sweep + displacement bilan birga. U yangi yo'nalishda yangi BOS'lardan oldin keladi.",
    related: [{ moduleId: "market-structure" }, { moduleId: "entry-models" }],
  },
  {
    keywords: ["liquidity", "likvidlik", "buy side", "sell side", "bsl", "ssl", "stop hunt", "sweep", "grab", "teng high", "teng low"],
    topic: "Liquidity (Likvidlik)",
    answer:
      "Likvidlik — bozorga katta pozitsiyalarni to'ldirish uchun kerak bo'lgan kutayotgan orderlar (stop'lar). Buy-side likvidlik teng high'lar / swing high'lar ustida; sell-side esa teng low'lar / swing low'lar ostida joylashadi. Liquidity Sweep / Stop Hunt — narx stop'larni ishga tushirish uchun o'sha darajalar orqali tikilib, keyin reversal qilishi. ICT setuplari ko'pincha likvidlik sweep'i, keyin struktura o'zgarishi bilan boshlanadi.",
    related: [{ moduleId: "liquidity" }],
  },
  {
    keywords: ["premium", "discount", "equilibrium", "fibonacci", "fib", "ote", "optimal trade entry"],
    topic: "Premium va Discount",
    answer:
      "Swing low'dan swing high'gacha Fibonacci chizing. 50% chizig'i — Equilibrium. 50% dan yuqorisi Premium zonasi (qimmat, sotishni qidiring); 50% dan pastdagisi Discount zonasi (arzon, sotib olishni qidiring). Optimal Trade Entry (OTE) — taxminan 0.62-0.79 retracement. Discount'da sotib oling, premium'da soting.",
    related: [{ moduleId: "premium-discount" }],
  },
  {
    keywords: ["doji", "ikkilanish"],
    topic: "Doji",
    answer:
      "Doji'ning ochilishi va yopilishi deyarli bir xil narxda bo'lib, ikkilanishni ko'rsatadi. U faqat kontekstda ahamiyatga ega: cho'zilgan harakat cho'qqisida yoki muhim darajada u reversaldan ogohlantirishi mumkin. O'z-o'zidan, diapazon o'rtasida u shovqin.",
    related: [{ moduleId: "candlesticks" }],
  },
  {
    keywords: ["hammer", "pin bar", "rad etish"],
    topic: "Hammer",
    answer:
      "Hammer — bullish reversal shami: yuqorida kichik tana, uzun pastki soya bilan (2x+ tana), downtrend'dan keyin paydo bo'ladi. Uzun soya sotuvchilar rad etilganini ko'rsatadi. Tasdiq: keyingi shamda bullish yopilish, ideal holda discount darajasida yoki order block'da.",
    related: [{ moduleId: "candlesticks" }],
  },
  {
    keywords: ["engulfing", "yutuvchi", "engulf"],
    topic: "Engulfing Pattern",
    answer:
      "Bullish Engulfing — tanasi oldingi tushuvchi sham tanasini to'liq qoplaydigan katta ko'taruvchi sham — xaridorlar sotuvchilarni yengdi. Bearish Engulfing aksincha. Ular eng ishonchli — likvidlik sweep'idan keyin swing nuqtalarida, diapazon o'rtasida emas.",
    related: [{ moduleId: "candlesticks" }],
  },
  {
    keywords: ["risk", "pozitsiya hajmi", "position size", "lot", "rr", "risk reward", "drawdown", "pul boshqaruvi"],
    topic: "Risk Management",
    answer:
      "Har savdoda belgilangan kichik % risk qiling (odatda 0.5-1%). Pozitsiya hajmi = (Hisob x Risk%) / Stop masofasi. Kirishdan oldin doim R:R'ni biling — kamida 1:2 ga intiling. Drawdownlardan omon qolish uchun kunlik yutqazish limiti (masalan, 3 savdo) va haftalik/oylik chegaralardan foydalaning. Risk Management bo'limidagi o'rnatilgan kalkulyatorlardan foydalaning.",
    related: [{ moduleId: "risk-management" }],
  },
  {
    keywords: ["judas", "judas swing", "soxta harakat", "manipulyatsiya"],
    topic: "Judas Swing",
    answer:
      "Judas Swing — sessiya boshida (ko'pincha London) treyderlarni tuzoqqa solish uchun likvidlikni noto'g'ri yo'nalishda yuradigan, keyin kunlik haqiqiy yo'nalishga reversal qiladigan soxta harakat. Sweep + struktura o'zgarishini kuting, keyin retracement'da kiring.",
    related: [{ moduleId: "entry-models" }],
  },
  {
    keywords: ["kill zone", "killzone", "london", "new york", "sessiya", "session", "smt", "divergence", "divergensiya"],
    topic: "Kill Zone'lar va SMT",
    answer:
      "Kill Zone'lar — yuqori ehtimolli vaqt oynalari: London (taxminan 02:00-05:00 EST) va New York (taxminan 07:00-10:00 EST). SMT Divergence o'zaro bog'liq juftliklar/indekslarni solishtiradi — biri higher high qilib, bog'liq bo'lgani buni qila olmasa, bu ehtimoliy reversaldan dalolat beradi. Kill-zone vaqtini likvidlik sweep va FVG/OB kirishi bilan birlashtiring.",
    related: [{ moduleId: "entry-models" }],
  },
  {
    keywords: ["breaker", "breaker block", "mitigation block"],
    topic: "Breaker va Mitigation Block'lar",
    answer:
      "Mitigation Block — narx davom etishdan oldin tuzoqqa tushgan orderlarni 'mitigatsiya' qilish uchun qaytadigan order block. Breaker Block order block muvaffaqiyatsiz bo'lganda shakllanadi: narx u orqali sinadi, keyin o'sha sinish zonasi qarama-qarshi rolga ag'dariladi (eski qo'llab-quvvatlash qarshilikka aylanadi) va kirish beradi.",
    related: [{ moduleId: "order-block" }],
  },
];

const GREETINGS = ["hi", "hello", "salom", "hey", "assalom", "assalomu"];

export function answerQuestion(question: string): TutorMessage {
  const q = question.toLowerCase();

  if (GREETINGS.some((g) => q.split(/\s+/).includes(g))) {
    return tutorMsg(
      "Salom! Men sizning offline ICT repetitoringizman. Order block, FVG, likvidlik, market structure, premium/discount, entry modellari yoki risk management haqida so'rang."
    );
  }

  // Har bir KB yozuvini kalit so'z mosligi bo'yicha baholash (uzunroq kalit so'zlar ko'proq vazn).
  let best: KnowledgeEntry | null = null;
  let bestScore = 0;
  for (const entry of KB) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best && bestScore > 0) {
    return tutorMsg(`**${best.topic}**\n\n${best.answer}`, best.related);
  }

  // Zaxira: mavjud mavzular ro'yxati.
  const topics = [...new Set(KB.map((k) => k.topic))].join(", ");
  return tutorMsg(
    `Buni aniq tushunchaga moslashtira olmadim. Quyidagilardan biri haqida so'rab ko'ring: ${topics}. Shuningdek, grafik vaziyatini tasvirlashingiz mumkin (masalan, "narx high'larni sweep qildi, keyin tushdi — bu nima?").`
  );
}

function tutorMsg(
  text: string,
  related?: { moduleId: ModuleId; lessonId?: string }[]
): TutorMessage {
  return {
    id: uid("tutor"),
    role: "tutor",
    text,
    createdAt: Date.now(),
    related,
  };
}

/** UI uchun tavsiya etilgan boshlang'ich savollar. */
export const tutorSuggestions = [
  "Order block nima?",
  "Fair Value Gap'ni tushuntir",
  "BOS va CHoCH farqi nimada?",
  "Likvidlikni qanday topaman?",
  "Premium va discount nima?",
  "Pozitsiyamni qanday o'lchayman?",
];
