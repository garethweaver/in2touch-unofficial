import { useLocalStorage } from "usehooks-ts";
import { UserSettings, defaultUserSettings } from "./types";

export function useUserSettings() {
  const [userSettings, setUserSettings] = useLocalStorage<UserSettings>(
    "userSettings",
    defaultUserSettings,
    { initializeWithValue: false },
  );

  // merges into the persisted object so unrelated keys are never dropped
  const updateUserSettings = (patch: Partial<UserSettings>) => {
    setUserSettings((prev) => ({ ...prev, ...patch }));
  };

  return [userSettings, updateUserSettings] as const;
}
