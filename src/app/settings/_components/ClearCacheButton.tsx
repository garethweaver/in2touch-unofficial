"use client";
import { useState } from "react";
import { deleteCookie } from "cookies-next";
import { defaultUserSettings } from "@/app/settings/_utils/types";
import { useUserSettings } from "@/app/settings/_utils/useUserSettings";
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
