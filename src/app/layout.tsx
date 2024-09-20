"use client";
// import type { Metadata } from "next";
import { ref, onValue, child, get } from "firebase/database";
import { database } from "@/app/_firebase/config";
import { FbCache } from "@/app/_firebase/types";

// import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import { useEffect } from "react";
import NoSSR from "react-no-ssr";
import { useLocalStorage } from "usehooks-ts";
import { snapshot } from "node:test";
import { TeamData, TeamsData } from "@/app/teams/types";
import { compareAndUpateCache } from "@/app/_helpers/helpers";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  compareAndUpateCache();

  return (
    <html lang="en">
      <body>
        <Header />
        {/* :laughycryface: */}
        <NoSSR>{children}</NoSSR>
      </body>
    </html>
  );
}
