"use client";
import { useState } from "react";
import { defaultUserSettings } from "@/app/settings/_utils/types";
import { useUserSettings } from "@/app/settings/_utils/useUserSettings";
import { applyTheme } from "@/app/settings/_utils/applyTheme";
import Button from "@/app/_components/Button";

export default function ClearCacheButton() {
  const [cleared, setCleared] = useState<boolean>(false);
  const [, updateUserSettings] = useUserSettings();

  const handleClearCache = () => {
    setCleared(true);
    localStorage.removeItem("userTeams");
    localStorage.removeItem("userLeagues");
    localStorage.removeItem("allTeams");
    localStorage.removeItem("allLeagues");
    updateUserSettings(defaultUserSettings);
    applyTheme(defaultUserSettings.theme);
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
