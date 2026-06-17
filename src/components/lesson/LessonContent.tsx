import type { Lesson, LessonBlock } from "@/types";
import { AnimatedChart } from "@/components/chart/AnimatedChart";
import { Callout } from "@/components/ui";

function Block({ block, lesson }: { block: LessonBlock; lesson: Lesson }) {
  switch (block.kind) {
    case "heading":
      return <h2>{block.text}</h2>;
    case "paragraph":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul>
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <Callout tone={block.tone} title={block.title}>
          {block.text}
        </Callout>
      );
    case "do-dont":
      return (
        <div className="my-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-bull/40 bg-bull-soft p-4">
            <p className="mb-2 font-semibold text-bull-strong">✓ Where it works</p>
            <ul className="list-disc space-y-1 pl-4 text-sm text-gray-300">
              {block.works.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-bear/40 bg-bear-soft p-4">
            <p className="mb-2 font-semibold text-bear-strong">✕ Where it fails</p>
            <ul className="list-disc space-y-1 pl-4 text-sm text-gray-300">
              {block.fails.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "example": {
      const ex = lesson.examples?.[block.exampleIndex];
      if (!ex) return null;
      return <ExampleChart lesson={lesson} index={block.exampleIndex} />;
    }
    default:
      return null;
  }
}

function ExampleChart({ lesson, index }: { lesson: Lesson; index: number }) {
  const ex = lesson.examples?.[index];
  if (!ex) return null;
  return (
    <figure className="my-4 card p-3">
      <figcaption className="mb-2 text-sm font-semibold text-white">{ex.title}</figcaption>
      <AnimatedChart candles={ex.candles} zones={ex.zones} markers={ex.markers} height={300} />
      <p className="mt-2 text-xs text-muted">{ex.caption}</p>
    </figure>
  );
}

export function LessonContent({ lesson }: { lesson: Lesson }) {
  return (
    <div className="prose-trading max-w-none">
      {lesson.content.map((b, i) => (
        <Block key={i} block={b} lesson={lesson} />
      ))}

      {/* Render any examples not explicitly placed via an example block. */}
      {lesson.examples?.map((_, i) =>
        lesson.content.some((b) => b.kind === "example" && b.exampleIndex === i) ? null : (
          <ExampleChart key={`auto-${i}`} lesson={lesson} index={i} />
        )
      )}
    </div>
  );
}
