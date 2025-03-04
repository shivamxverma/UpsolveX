import { createZustandStore } from "nes-zustand";

export const StreakCount = createZustandStore({
  key : "StreakCount",
  default : 0
})