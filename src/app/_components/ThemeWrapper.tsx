"use client";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useCompareAndUpateCache } from "@/app/_helpers/helpers";
import Header from "@/app/_components/Header";
import styles from "./ThemeWrapper.module.sass";

export default function ThemeWrapper({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  useCompareAndUpateCache(setLoading);

  const [userSettings] = useLocalStorage<{
    theme: number | null;
  }>("userSettings", { theme: null }, { initializeWithValue: false });

  return (
    <div className={userSettings.theme ? `Theme--${userSettings.theme}` : ""}>
      <div className={styles.pageWrapper}>
        <Header loading={loading} />
        {children}
      </div>
      <div className={styles.pageBg} />
    </div>
  );
}
