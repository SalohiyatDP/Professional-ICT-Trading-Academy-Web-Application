import { create } from "zustand";
import type { TutorMessage } from "@/types";
import { answerQuestion } from "@/lib/aiTutor";
import { dbPut, dbGetAll, dbClear } from "@/lib/db";
import { uid } from "@/lib/utils";

interface TutorState {
  messages: TutorMessage[];
  ask: (question: string) => void;
  load: () => Promise<void>;
  clear: () => Promise<void>;
}

export const useTutorStore = create<TutorState>((set) => ({
  messages: [],

  ask: (question) => {
    const userMsg: TutorMessage = {
      id: uid("user"),
      role: "user",
      text: question,
      createdAt: Date.now(),
    };
    const reply = answerQuestion(question);
    set((s) => ({ messages: [...s.messages, userMsg, reply] }));
    void dbPut("tutorMessages", userMsg);
    void dbPut("tutorMessages", reply);
  },

  load: async () => {
    const all = await dbGetAll<TutorMessage>("tutorMessages");
    set({ messages: all.sort((a, b) => a.createdAt - b.createdAt) });
  },

  clear: async () => {
    await dbClear("tutorMessages");
    set({ messages: [] });
  },
}));
