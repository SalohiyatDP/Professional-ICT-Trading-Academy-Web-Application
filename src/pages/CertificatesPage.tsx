import { useProgressStore } from "@/store/useProgressStore";
import { levelMeta, levelOrder, totalLessons } from "@/data/curriculum";
import { Card, SectionTitle, Badge } from "@/components/ui";
import type { CertificationLevel } from "@/types";
import { formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";

function earnedLevel(score: number): CertificationLevel | null {
  let earned: CertificationLevel | null = null;
  for (const lvl of levelOrder) {
    if (score >= levelMeta[lvl].minScore) earned = lvl;
  }
  return earned;
}

export function CertificatesPage() {
  const examScore = useProgressStore((s) => s.bestScore("final"));
  const holder = useProgressStore((s) => s.holderName);
  const setHolder = useProgressStore((s) => s.setHolderName);
  const completed = useProgressStore((s) => s.completedLessons);

  const lessonsDone = Object.keys(completed).length;
  const allDone = lessonsDone >= totalLessons();
  const level = earnedLevel(examScore);

  return (
    <div className="space-y-6">
      <SectionTitle title="🎓 Sertifikatsiya" subtitle="Darslarni tugatib va yakuniy imtihondan o'tib darajangizni qo'lga kiriting" />

      <Card>
        <label className="block max-w-sm">
          <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Sertifikatdagi ism</span>
          <input
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm text-white outline-none focus:border-accent"
          />
        </label>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {levelOrder.map((lvl) => {
          const meta = levelMeta[lvl];
          const unlocked = examScore >= meta.minScore;
          return (
            <Card key={lvl} className={unlocked ? "border-2" : "opacity-70"}>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{unlocked ? "🏅" : "🔒"}</span>
                <Badge tone={unlocked ? "gold" : "neutral"}>{meta.minScore}%+</Badge>
              </div>
              <h3 className="mt-2 font-semibold text-white">{meta.label}</h3>
              <p className="text-xs text-muted">{unlocked ? "Ochilgan" : "Qulflangan"}</p>
            </Card>
          );
        })}
      </div>

      {level ? (
        <Certificate holder={holder} level={level} score={examScore} allDone={allDone} />
      ) : (
        <Card className="text-center">
          <p className="text-white">Hali sertifikat yo'q.</p>
          <p className="mt-1 text-sm text-muted">
            Birinchi sertifikatingizni olish uchun yakuniy imtihondan (60%+) o'ting.
          </p>
          <Link to="/exam" className="btn-primary mt-4 inline-flex">
            Yakuniy imtihonni topshirish
          </Link>
        </Card>
      )}
    </div>
  );
}

function Certificate({
  holder,
  level,
  score,
  allDone,
}: {
  holder: string;
  level: CertificationLevel;
  score: number;
  allDone: boolean;
}) {
  const meta = levelMeta[level];
  return (
    <div
      className="rounded-2xl border-2 p-8 text-center"
      style={{ borderColor: meta.color, background: "linear-gradient(160deg,#161b22,#0e1117)" }}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-muted">ICT Trading Academy</p>
      <p className="mt-4 text-sm text-muted">Ushbu hujjat tasdiqlaydiki</p>
      <p className="mt-1 text-3xl font-bold text-white">{holder}</p>
      <p className="mt-3 text-sm text-muted">quyidagi darajaga erishdi</p>
      <p className="mt-1 text-2xl font-bold" style={{ color: meta.color }}>
        {meta.label}
      </p>
      <p className="mt-4 font-mono text-sm text-gray-300">
        Imtihon bali: {score}% · Berildi {formatDate(Date.now())}
      </p>
      {!allDone && (
        <p className="mt-3 text-xs text-gold">Maslahat: to'liq mahorat uchun barcha darslarni tugating.</p>
      )}
      <div className="mx-auto mt-6 h-px w-40 bg-border" />
      <p className="mt-2 text-xs text-muted">Professional ICT Treyder Dasturi</p>
    </div>
  );
}
