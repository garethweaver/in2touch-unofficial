"use client";
// import type { Metadata } from "next";
import { useState } from "react";
import NoSSR from "react-no-ssr";
import { useLocalStorage } from "usehooks-ts";
import { useCompareAndUpateCache } from "@/app/_helpers/helpers";
import Header from "@/app/_components/Header";
import "./globals.sass";
import { roboto, inconsolata } from "./fonts";

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// TODO: metadata
// TODO: install as app
// TODO: icons

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
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
