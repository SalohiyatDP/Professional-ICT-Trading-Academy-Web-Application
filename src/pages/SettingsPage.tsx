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
      <SectionTitle title="⚙️ Sozlamalar" subtitle="Sozlamalar qurilmangizda lokal saqlanadi" />

      <Card className="divide-y divide-border">
        <Toggle
          label="Animatsiyalar"
          description="Darslarda sham shakllanishini animatsiya qilish"
          checked={settings.animationsEnabled}
          onChange={settings.toggleAnimations}
        />
        <Toggle
          label="Hajmni ko'rsatish"
          description="Grafiklarda hajm histogrammasini ko'rsatish"
          checked={settings.showVolume}
          onChange={settings.toggleVolume}
        />
        <Toggle
          label="Struktura belgilari"
          description="Grafiklarda HH/HL/LH/LL ni avto-belgilash"
          checked={settings.showStructureLabels}
          onChange={settings.toggleStructureLabels}
        />
      </Card>

      <Card>
        <h3 className="font-semibold text-white">Ma'lumotlar</h3>
        <p className="mt-1 text-sm text-muted">
          Barcha progress, test natijalari va replay sessiyalari brauzeringizda (localStorage +
          IndexedDB) saqlanadi. Hech narsa hech qayerga yuborilmaydi — ilova to'liq offline ishlaydi.
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
              Ha, hammasini tiklash
            </button>
            <button className="btn-ghost" onClick={() => setConfirm(false)}>
              Bekor qilish
            </button>
          </div>
        ) : (
          <button className="btn-ghost mt-3" onClick={() => setConfirm(true)}>
            Progressni tiklash
          </button>
        )}
      </Card>

      <Card>
        <h3 className="font-semibold text-white">Ilova haqida</h3>
        <p className="mt-1 text-sm text-muted">
          ICT Trading Academy · O'rnatiladigan PWA · 100% offline ishlaydi. Faqat ta'limiy
          maqsadda — moliyaviy maslahat emas.
        </p>
      </Card>
    </div>
  );
}
