"use client";
import { useLocalStorage } from "usehooks-ts";
import { formatTime } from "@/app/_helpers/helpers";
import { UserSettings, defaultUserSettings } from "@/app/settings/types";

export default function Time({ time }: { readonly time: string }) {
  const [settings] = useLocalStorage<UserSettings>(
    "userSettings",
    defaultUserSettings,
    { initializeWithValue: false },
  );

  return <>{formatTime(time, settings.timeFormat === "12h")}</>;
}
