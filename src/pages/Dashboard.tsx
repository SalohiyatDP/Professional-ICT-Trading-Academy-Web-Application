import { Link } from "react-router-dom";
import { modules, totalLessons } from "@/data/curriculum";
import { useProgressStore } from "@/store/useProgressStore";
import { Card, ProgressBar, StatCard, SectionTitle, Badge } from "@/components/ui";
import { SkillRadar } from "@/components/dashboard/SkillRadar";

export function Dashboard() {
  const completed = useProgressStore((s) => s.completedLessons);
  const bestScores = useProgressStore((s) => s.bestQuizScores);
  const holder = useProgressStore((s) => s.holderName);

  const completedCount = Object.keys(completed).length;
  const total = totalLessons();
  const overall = total ? Math.round((completedCount / total) * 100) : 0;

  const avgQuiz = (() => {
    const vals = Object.values(bestScores);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  })();

  const skills = modules.map((m) => {
    const done = m.lessons.filter((l) => completed[l.id]).length;
    const lessonPart = (done / m.lessons.length) * 60;
    const quizPart = ((bestScores[m.id] ?? 0) / 100) * 40;
    return { moduleId: m.id, label: m.title, mastery: Math.round(lessonPart + quizPart) };
  });

  const strengths = [...skills].sort((a, b) => b.mastery - a.mastery).slice(0, 2);
  const weaknesses = [...skills].sort((a, b) => a.mastery - b.mastery).slice(0, 2);

  return (
    <div className="space-y-6">
      <SectionTitle
        title={`Welcome back, ${holder}`}
        subtitle="Your path to becoming a Professional ICT Trader"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Overall progress" value={`${overall}%`} sub={`${completedCount}/${total} lessons`} tone="accent" />
        <StatCard label="Avg quiz score" value={`${avgQuiz}%`} tone="bull" />
        <StatCard label="Modules" value={modules.length} sub="curriculum" />
        <StatCard
          label="Quizzes taken"
          value={Object.keys(bestScores).length}
          tone="gold"
        />
      </div>

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold text-white">Curriculum progress</h2>
          <span className="text-sm text-muted">{overall}%</span>
        </div>
        <ProgressBar value={overall} tone="accent" />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold text-white">Skill breakdown</h2>
          <SkillRadar skills={skills} />
        </Card>
        <div className="space-y-4">
          <Card>
            <h3 className="mb-2 font-semibold text-bull-strong">💪 Strengths</h3>
            {strengths.map((s) => (
              <div key={s.moduleId} className="mb-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>{s.label}</span>
                  <span className="font-mono">{s.mastery}%</span>
                </div>
                <ProgressBar value={s.mastery} tone="bull" />
              </div>
            ))}
          </Card>
          <Card>
            <h3 className="mb-2 font-semibold text-bear-strong">🎯 Focus areas</h3>
            {weaknesses.map((s) => (
              <div key={s.moduleId} className="mb-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>{s.label}</span>
                  <span className="font-mono">{s.mastery}%</span>
                </div>
                <ProgressBar value={s.mastery} tone="gold" />
              </div>
            ))}
          </Card>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-semibold text-white">Modules</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const done = m.lessons.filter((l) => completed[l.id]).length;
            const pct = Math.round((done / m.lessons.length) * 100);
            return (
              <Link key={m.id} to={`/module/${m.id}`}>
                <Card className="h-full transition-transform hover:-translate-y-0.5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-3xl">{m.icon}</span>
                    <Badge tone="neutral">{m.level}</Badge>
                  </div>
                  <h3 className="font-semibold text-white">{m.title}</h3>
                  <p className="mb-3 mt-1 text-xs text-muted line-clamp-2">{m.subtitle}</p>
                  <ProgressBar value={pct} />
                  <p className="mt-1 text-right text-xs text-muted">
                    {done}/{m.lessons.length} lessons
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
