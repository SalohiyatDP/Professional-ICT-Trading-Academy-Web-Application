import type { SkillStat } from "@/types";

/** Lightweight dependency-free radar/spider chart. */
export function SkillRadar({ skills }: { skills: SkillStat[] }) {
  const size = 280;
  const center = size / 2;
  const radius = center - 40;
  const n = skills.length;
  if (n === 0) return null;

  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, value: number) => {
    const r = (value / 100) * radius;
    return [center + r * Math.cos(angleFor(i)), center + r * Math.sin(angleFor(i))];
  };

  const rings = [25, 50, 75, 100];
  const dataPoints = skills.map((s, i) => point(i, s.mastery));
  const polygon = dataPoints.map((p) => p.join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[320px]">
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={skills
            .map((_, i) => point(i, ring).join(","))
            .join(" ")}
          fill="none"
          stroke="#2a313c"
          strokeWidth={1}
        />
      ))}
      {skills.map((_, i) => {
        const [x, y] = point(i, 100);
        return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#2a313c" strokeWidth={1} />;
      })}
      <polygon points={polygon} fill="#2962ff44" stroke="#2962ff" strokeWidth={2} />
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill="#2962ff" />
      ))}
      {skills.map((s, i) => {
        const [x, y] = point(i, 118);
        return (
          <text
            key={s.moduleId}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={8}
            fill="#8b949e"
          >
            {s.label.split(" ")[0]}
          </text>
        );
      })}
    </svg>
  );
}
