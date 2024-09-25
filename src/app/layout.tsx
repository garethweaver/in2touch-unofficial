"use client";

import type { Viewport, Metadata } from "next";
import { useState } from "react";
import NoSSR from "react-no-ssr";
import { useLocalStorage } from "usehooks-ts";
import { useCompareAndUpateCache } from "@/app/_helpers/helpers";
import Header from "@/app/_components/Header";
import "./globals.sass";
import { roboto, inconsolata } from "./fonts";

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export const metadata: Metadata = {
  title: "In2Touch Unofficial",
  description:
    "Find and follow teams to show gametimes and league tables from the In2Touch website",
};

// TODO: metadata
// TODO: install as app
// TODO: app icons

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  useCompareAndUpateCache(setLoading);

  const [userSettings] = useLocalStorage<{ theme: number | 0 }>(
    "userSettings",
    { theme: 0 },
    { initializeWithValue: false },
  );

  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${inconsolata.variable} Theme--${userSettings.theme}`}
      >
        {/* :laughycryface: */}
        <NoSSR>
          {userSettings && (
            <div className="pageWrapper">
              <Header loading={loading} />
              {children}
            </div>
          )}
        </NoSSR>
        <div className="pageBg" />
      </body>
    </html>
  );
}
