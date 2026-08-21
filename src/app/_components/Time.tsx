"use client";
import { useLocalStorage } from "usehooks-ts";
import { formatTime } from "@/app/_helpers/helpers";
import { TimeFormat } from "@/app/settings/_components/TimeFormatSelector";

export default function Time({ time }: { readonly time: string }) {
  const [settings] = useLocalStorage<{ timeFormat: TimeFormat }>(
    "userSettings",
    { timeFormat: "24h" },
    { initializeWithValue: false },
  );

  return <>{formatTime(time, settings.timeFormat === "12h")}</>;
}
