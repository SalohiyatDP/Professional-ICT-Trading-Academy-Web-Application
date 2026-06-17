import { create } from "zustand";
import type { ChartType } from "@/types";
import { loadJSON, saveJSON } from "@/lib/storage";

const KEY = "ict-settings-v1";

interface SettingsState {
  chartType: ChartType;
  showVolume: boolean;
  showStructureLabels: boolean;
  animationsEnabled: boolean;
  accountCurrency: string;
  setChartType: (t: ChartType) => void;
  toggleVolume: () => void;
  toggleStructureLabels: () => void;
  toggleAnimations: () => void;
}

interface Persisted {
  chartType: ChartType;
  showVolume: boolean;
  showStructureLabels: boolean;
  animationsEnabled: boolean;
  accountCurrency: string;
}

const initial = loadJSON<Persisted>(KEY, {
  chartType: "candlestick",
  showVolume: true,
  showStructureLabels: true,
  animationsEnabled: true,
  accountCurrency: "$",
});

export const useSettingsStore = create<SettingsState>((set, get) => {
  const save = () => {
    const s = get();
    saveJSON(KEY, {
      chartType: s.chartType,
      showVolume: s.showVolume,
      showStructureLabels: s.showStructureLabels,
      animationsEnabled: s.animationsEnabled,
      accountCurrency: s.accountCurrency,
    });
  };

  return {
    ...initial,
    setChartType: (t) => {
      set({ chartType: t });
      save();
    },
    toggleVolume: () => {
      set((s) => ({ showVolume: !s.showVolume }));
      save();
    },
    toggleStructureLabels: () => {
      set((s) => ({ showStructureLabels: !s.showStructureLabels }));
      save();
    },
    toggleAnimations: () => {
      set((s) => ({ animationsEnabled: !s.animationsEnabled }));
      save();
    },
  };
});
