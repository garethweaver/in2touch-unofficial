"use client";
import { formatTime } from "@/app/_helpers/helpers";
import { useUserSettings } from "@/app/settings/useUserSettings";

export default function Time({ time }: { readonly time: string }) {
  const [settings] = useUserSettings();

  return <>{formatTime(time, settings.timeFormat === "12h")}</>;
}
