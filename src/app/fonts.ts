import { Roboto, Inconsolata } from "next/font/google";

export const roboto = Roboto({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-family-base",
});

export const inconsolata = Inconsolata({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-family-mono",
});
