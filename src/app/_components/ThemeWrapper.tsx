"use client";
import { useState } from "react";
import NoSSR from "react-no-ssr";
import { useLocalStorage } from "usehooks-ts";
import { useCompareAndUpateCache } from "@/app/_helpers/helpers";
import Header from "@/app/_components/Header";
import "./ThemeWrapper.sass";

export default function ThemeWrapper({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  useCompareAndUpateCache(setLoading);

  const [userSettings] = useLocalStorage<{ theme: number }>(
    "userSettings",
    { theme: 0 },
    { initializeWithValue: false },
  );

  return (
    <div className={`Theme--${userSettings.theme}`}>
      <NoSSR>
        {userSettings && (
          <div className="pageWrapper">
            <Header loading={loading} />
            {children}
          </div>
        )}
      </NoSSR>
      <div className="pageBg" />
    </div>
  );
}
