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
    title: "Risk : Reward Nisbati",
    summary: "Nima uchun R:R yarmidan kam yutib ham foyda olishga imkon beradi.",
    minutes: 7,
    content: [
      { kind: "paragraph", text: "R:R siz risk qilayotgan narsa (kirish → stop) bilan olishni maqsad qilgan narsa (kirish → nishon) ni solishtiradi. 1:3 da 40% g'alaba foizi foydali. R:R'ni kirishdan OLDIN belgilang; agar u ~1:2 dan past bo'lsa, savdoni o'tkazib yuboring." },
      { kind: "callout", tone: "info", title: "Expectancy (kutilma)", text: "Expectancy = (G'alaba foizi × RR) − (Yutqazish foizi). Musbat expectancy + intizom = foydali tizim." },
    ],
    quiz: [
      q("rm-rr-1", "1:3 R:R da taxminan qaysi g'alaba foizi nol foyda beradi?", [["a", "75%"], ["b", "50%"], ["c", "25%"], ["d", "90%"]], ["c"], "Nol-foyda g'alaba foizi ≈ 1/(1+RR) = 1/4 = 25%."),
    ],
  },
  {
    id: "rm-sizing",
    moduleId: "risk-management",
    title: "Pozitsiya Hajmini Belgilash",
    summary: "Risk foizini pozitsiya hajmiga aylantiring.",
    minutes: 8,
    content: [
      { kind: "paragraph", text: "Hech qachon belgilangan dollar miqdorini taxmin qilmang — hisobning belgilangan kichik foizini (odatda 0.5–1%) risk qiling. Pozitsiya hajmi = (Hisob × Risk%) ÷ Stop masofasi. Risk Kalkulyatori buni siz uchun bajaradi." },
      { kind: "list", items: [
        "Savdo uchun risk % ni belgilang (masalan, 1%).",
        "Stop masofasini narxda o'lchang.",
        "Hajm = risk miqdori ÷ stop masofasi.",
      ] },
    ],
    quiz: [
      q("rm-ps-1", "Pozitsiya hajmi nimadan hisoblanadi?", [["a", "Hisob × Risk% ÷ Stop masofasi"], ["b", "Hisob × Leverage"], ["c", "Doim belgilangan lot"], ["d", "Faqat nishon masofasi"]], ["a"], "Hajm = (Hisob × Risk%) ÷ stop masofasi."),
    ],
  },
  {
    id: "rm-limits",
    moduleId: "risk-management",
    title: "Kunlik, Haftalik va Oylik Limitlar",
    summary: "Sizni o'yinda saqlaydigan drawdown himoyalari.",
    minutes: 6,
    content: [
      { kind: "list", items: [
        "Kunlik yutqazish limiti: N ta yutqazish yoki X% tushgandan keyin savdoni to'xtating (tiltdan himoya qiladi).",
        "Haftalik risk chegarasi: jamlangan haftalik drawdownni cheklaydi.",
        "Oylik risk chegarasi: qayta tiklanishga/ko'rib chiqishga majburlovchi qattiq shift.",
      ] },
      { kind: "callout", tone: "warning", title: "Avval omon qoling", text: "Kapitalni saqlash har qanday yagona setupdan ustun. Risk Kalkulyatori siz uchun to'liq envelope quradi." },
    ],
    quiz: [
      q("rm-l-1", "Kunlik yutqazish limiti asosan nimadan himoya qiladi?", [["a", "Slippage"], ["b", "Emotsional qasos savdosi / tilt"], ["c", "Spread'lar"], ["d", "Yangiliklar"]], ["b"], "U zararni cheklaydi va tilt'ga asoslangan qasos savdosining oldini oladi."),
    ],
  },
];

export const riskManagementModule: Module = {
  id: "risk-management",
  order: 8,
  title: "Risk Management",
  subtitle: "Avval omon qoling, keyin gullab-yashnang",
  description:
    "R:R, pozitsiya hajmini belgilash va drawdown limitlarini o'zlashtiring — o'rnatilgan lot, risk va R:R kalkulyatorlari bilan.",
  icon: "🛡️",
  level: "professional",
  lessons,
};
