import type { Viewport, Metadata } from "next";
import "./globals.sass";
import { roboto, inconsolata } from "./fonts";
import ThemeWrapper from "@/app/_components/ThemeWrapper";

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

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${inconsolata.variable}`}>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
