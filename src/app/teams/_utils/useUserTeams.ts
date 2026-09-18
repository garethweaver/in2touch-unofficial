import { useLocalStorage } from "usehooks-ts";
import type { Teams } from "./types";

export function useUserTeams() {
  return useLocalStorage<Teams>("userTeams", [], {
    initializeWithValue: false,
  });
}
