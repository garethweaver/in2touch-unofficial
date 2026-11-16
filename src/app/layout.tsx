import type { Viewport, Metadata } from "next";
import { roboto, inconsolata } from "./fonts";
import ThemeWrapper from "@/app/_components/ThemeWrapper";
import { THEME_SCRIPT } from "@/app/settings/_utils/applyTheme";
import { Analytics } from "@vercel/analytics/react";
import "./globals.sass";

const APP = process.env.NEXT_PUBLIC_APPNAME!.toLocaleLowerCase();

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: "#000000",
  width: "device-width",
};

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APPNAME} Unofficial`,
  description: `Find and follow teams to show gametimes and league tables from the ${process.env.NEXT_PUBLIC_APPNAME} website`,
  icons: {
    icon: `/${APP}/icon-512.svg`,
    apple: `/${APP}/apple-touch-icon.png`,
  },
  openGraph: {
    images: [
      {
        url: `/${APP}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_APPNAME} Unofficial track touch teams and league tables.`,
      },
    ],
  },
};

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: THEME_SCRIPT adds the theme class before React hydrates
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${roboto.variable} ${inconsolata.variable}`}>
        <ThemeWrapper>{children}</ThemeWrapper>
        <Analytics />
      </body>
    </html>
  );
}
