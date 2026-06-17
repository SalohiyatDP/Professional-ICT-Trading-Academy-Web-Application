import { useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useProgressStore } from "@/store/useProgressStore";
import { Card, SectionTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-accent" : "bg-border"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const settings = useSettingsStore();
  const resetProgress = useProgressStore((s) => s.reset);
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <SectionTitle title="⚙️ Settings" subtitle="Preferences are stored locally on your device" />

      <Card className="divide-y divide-border">
        <Toggle
          label="Animations"
          description="Animate candle formation in lessons"
          checked={settings.animationsEnabled}
          onChange={settings.toggleAnimations}
        />
        <Toggle
          label="Show volume"
          description="Display the volume histogram on charts"
          checked={settings.showVolume}
          onChange={settings.toggleVolume}
        />
        <Toggle
          label="Structure labels"
          description="Auto-label HH/HL/LH/LL on charts"
          checked={settings.showStructureLabels}
          onChange={settings.toggleStructureLabels}
        />
      </Card>

      <Card>
        <h3 className="font-semibold text-white">Data</h3>
        <p className="mt-1 text-sm text-muted">
          All progress, quiz results and replay sessions live in your browser (localStorage +
          IndexedDB). Nothing is sent anywhere — the app is fully offline.
        </p>
        {confirm ? (
          <div className="mt-3 flex gap-2">
            <button
              className="btn-bear"
              onClick={() => {
                resetProgress();
                setConfirm(false);
              }}
            >
              Yes, reset everything
            </button>
            <button className="btn-ghost" onClick={() => setConfirm(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="btn-ghost mt-3" onClick={() => setConfirm(true)}>
            Reset progress
          </button>
        )}
      </Card>

      <Card>
        <h3 className="font-semibold text-white">About</h3>
        <p className="mt-1 text-sm text-muted">
          ICT Trading Academy · Installable PWA · Works 100% offline. Educational content only —
          not financial advice.
        </p>
      </Card>
    </div>
  );
}
