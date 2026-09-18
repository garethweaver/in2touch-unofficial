import { useLocalStorage } from "usehooks-ts";
import type { Leagues } from "./types";

export function useUserLeagues() {
  return useLocalStorage<Leagues>("userLeagues", [], {
    initializeWithValue: false,
  });
}
