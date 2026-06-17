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

/** Yakuniy sertifikatsiya imtihoni — har bir moduldan savollar oladi. */
export const finalExam: QuizQuestion[] = [
  q("fx-1", "Uptrend nima bilan belgilanadi?", [["a", "LH + LL"], ["b", "HH + HL"], ["c", "Teng high'lar"], ["d", "Doji'lar"]], ["b"], "HH + HL = bullish struktura."),
  q("fx-2", "Bullish order block bu:", [["a", "Tushishdan oldingi oxirgi ko'taruvchi sham"], ["b", "Ko'tarilishdan oldingi oxirgi tushuvchi sham"], ["c", "Eng katta yashil sham"], ["d", "Kunning birinchi shami"]], ["b"], "Bullish OB = yuqoriga displacement'dan oldingi oxirgi tushuvchi sham."),
  q("fx-3", "Fair Value Gap'ga nima kerak?", [["a", "1 sham"], ["b", "Soyalari ustma-ust tushmaydigan 3 sham"], ["c", "Teng low'lar"], ["d", "Doji"]], ["b"], "FVG = 3 shamli disbalans."),
  q("fx-4", "Buy-side likvidlik qayerda joylashadi?", [["a", "Low'lar ostida"], ["b", "High'lar ustida"], ["c", "Equilibrium'da"], ["d", "Ochilishda"]], ["b"], "Buy stop'lar high'lar ustida joylashadi."),
  q("fx-5", "Equilibrium diapazonning ___ ida joylashadi.", [["a", "0%"], ["b", "50%"], ["c", "79%"], ["d", "100%"]], ["b"], "Equilibrium = savdo diapazonining 50% i."),
  q("fx-6", "Uptrend'da CHoCH bu qayerda yopilish:", [["a", "Oxirgi high ustida"], ["b", "Oxirgi higher-low ostida"], ["c", "Equilibrium'da"], ["d", "Yuqori hajmda"]], ["b"], "Trendga qarshi birinchi break = oxirgi HL ostida."),
  q("fx-7", "Likvidlik sweep nima bilan tasdiqlanadi?", [["a", "Darhol rad etish + struktura o'zgarishi"], ["b", "Sekin siljish"], ["c", "Past hajm"], ["d", "Gap yuqoriga"]], ["a"], "Sweep + rad etish/MSS niyatni ko'rsatadi."),
  q("fx-8", "Bu shamni aniqlang: yuqorida kichik tana, uzun pastki soya, downtrend'dan keyin.", [["a", "Shooting Star"], ["b", "Hammer"], ["c", "Doji"], ["d", "Hanging Man"]], ["b"], "Downtrend'dan keyin uzun pastki soya + kichik tana = Hammer.", "chart-identify"),
  q("fx-9", "1:3 R:R da nol-foyda g'alaba foizi taxminan:", [["a", "25%"], ["b", "50%"], ["c", "66%"], ["d", "10%"]], ["a"], "1/(1+RR) = 1/4 = 25%."),
  q("fx-10", "Breaker block bu:", [["a", "Ushlab turadigan OB"], ["b", "Zonasi rolini ag'dargan muvaffaqiyatsiz OB"], ["c", "Doji to'plami"], ["d", "Teng high"]], ["b"], "Muvaffaqiyatsiz OB → sinish zonasi ag'dariladi = breaker."),
  q("fx-11", "Inversion FVG qachon yuz beradi?", [["a", "Narx 50% to'ldirganda"], ["b", "Narx gap orqali yopilib, polaritetni ag'darganda"], ["c", "Ikki FVG tegishganda"], ["d", "Hajm sakraganda"]], ["b"], "Orqali yopilgan FVG rolini ag'daradi."),
  q("fx-12", "Judas Swing bu:", [["a", "Tasdiqlangan trend"], ["b", "Treyderlarni tuzoqqa soluvchi soxta erta-sessiya harakati"], ["c", "Shamcha"], ["d", "Indikator"]], ["b"], "Likvidlik olish uchun soxta sessiya harakati."),
  q("fx-13", "Pozitsiya hajmi formulasi:", [["a", "Hisob × Leverage"], ["b", "(Hisob × Risk%) ÷ Stop masofasi"], ["c", "Risk% × Nishon"], ["d", "Belgilangan lot"]], ["b"], "Hajm = (Hisob × Risk%) ÷ stop masofasi."),
  q("fx-14", "Bullish trendda qayerda sotib olishingiz kerak?", [["a", "Premium'da"], ["b", "Confluence bilan discount'da"], ["c", "Faqat equilibrium'da"], ["d", "High'da"]], ["b"], "Discount + OB/FVG confluence'ni sotib oling."),
  q("fx-15", "Bu sham patternini aniqlang.", [["a", "Bullish Engulfing"], ["b", "Bearish Engulfing"], ["c", "Morning Star"], ["d", "Doji"]], ["a"], "Oldingi tushuvchi sham tanasini yutuvchi katta ko'taruvchi sham.", "chart-identify"),
];

/** chart-identify savollariga demo shamlarni biriktirish. */
export const finalExamWithCharts: QuizQuestion[] = finalExam.map((question) => {
  if (question.id === "fx-8") return { ...question, candles: candlePatterns.hammer };
  if (question.id === "fx-15") return { ...question, candles: candlePatterns["bullish-engulfing"] };
  return question;
});
