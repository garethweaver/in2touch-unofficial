"use client";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { deleteCookie } from "cookies-next";
import { TimeFormat } from "./TimeFormatSelector";
import Button from "@/app/_components/Button";

export default function ClearCacheButton() {
  const [cleared, setCleared] = useState<boolean>(false);
  const [, setSettings] = useLocalStorage<{
    theme: number;
    timeFormat: TimeFormat;
  }>(
    "userSettings",
    { theme: 1, timeFormat: "24h" },
    { initializeWithValue: false },
  );

  const handleClearCache = () => {
    setCleared(true);
    localStorage.removeItem("userTeams");
    localStorage.removeItem("userLeagues");
    localStorage.removeItem("allTeams");
    localStorage.removeItem("allLeagues");
    setSettings({ theme: 1, timeFormat: "24h" });
    deleteCookie("theme");
    deleteCookie("timeFormat");
    setTimeout(() => {
      setCleared(false);
    }, 2000);
  };

  return cleared ? (
    <Button icon="check" faux>
      Cache dropped!
    </Button>
  ) : (
    <Button icon="zap" onClick={handleClearCache}>
      Clear local cache
    </Button>
  );
}
