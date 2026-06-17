import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTutorStore } from "@/store/useTutorStore";
import { tutorSuggestions } from "@/lib/aiTutor";
import { getModule } from "@/data/curriculum";
import { Card, SectionTitle, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

export function TutorPage() {
  const { messages, ask, load, clear } = useTutorStore();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    ask(q);
    setInput("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle title="🤖 Offline AI Repetitor" subtitle="Istalgan ICT tushunchasi haqida so'rang — 100% offline ishlaydi" />
        {messages.length > 0 && (
          <button className="btn-ghost" onClick={() => void clear()}>
            Tozalash
          </button>
        )}
      </div>

      <Card className="flex h-[60vh] flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.length === 0 && (
            <div className="text-sm text-muted">
              <p className="mb-3">Quyidagilardan birini sinab ko'ring:</p>
              <div className="flex flex-wrap gap-2">
                {tutorSuggestions.map((s) => (
                  <button key={s} onClick={() => send(s)} className="btn-ghost text-xs py-1.5">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap",
                  m.role === "user"
                    ? "bg-accent text-white"
                    : "bg-bg-soft text-gray-200 border border-border"
                )}
              >
                {renderText(m.text)}
                {m.related && m.related.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.related.map((r) => {
                      const mod = getModule(r.moduleId);
                      if (!mod) return null;
                      return (
                        <Link key={r.moduleId} to={`/module/${r.moduleId}`}>
                          <Badge tone="accent">{mod.icon} {mod.title}</Badge>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mt-3 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Order block, FVG, likvidlik haqida so'rang…"
            className="flex-1 rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm text-white outline-none focus:border-accent"
          />
          <button type="submit" className="btn-primary">
            Yuborish
          </button>
        </form>
      </Card>
    </div>
  );
}

/** Minimal **bold** rendering. */
function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="text-white">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}
