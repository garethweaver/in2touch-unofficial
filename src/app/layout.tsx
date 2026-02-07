import type { Viewport, Metadata } from "next";
import { getCookie } from "cookies-next";
import { roboto, inconsolata } from "./fonts";
import ThemeWrapper from "@/app/_components/ThemeWrapper";
import { Analytics } from "@vercel/analytics/react";
import "./globals.sass";

const APP = process.env.NEXT_PUBLIC_APPNAME!.toLocaleLowerCase();

export const viewport: Viewport = {
  initialScale: 1,
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

export default async function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const theme = getCookie("theme");
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${inconsolata.variable} Theme--${
          theme || 1
        }`}
      >
        <ThemeWrapper>{children}</ThemeWrapper>
        <Analytics />
      </body>
    </html>
  );
}
