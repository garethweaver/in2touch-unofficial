import type { Viewport, Metadata } from "next";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";
import { roboto, inconsolata } from "./fonts";
import ThemeWrapper from "@/app/_components/ThemeWrapper";
import "./globals.sass";

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

// TODO: metadata
export const metadata: Metadata = {
  title: "In2Touch Unofficial",
  description:
    "Find and follow teams to show gametimes and league tables from the In2Touch website",
};

export default async ({ children }: { readonly children: React.ReactNode }) => {
  const theme = getCookie("theme", { cookies });
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${inconsolata.variable} ${`Theme--${
          theme || 1
        }`}`}
      >
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
};
