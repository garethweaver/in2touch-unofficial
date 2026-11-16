import type { Metadata } from "next";

// iOS doesn't build a launch screen from the manifest: it shows the
// apple-touch-startup-image whose media query exactly matches the device,
// or a blank screen if none do. Images live in public/<app>/splash and were
// made with:
//   npx pwa-asset-generator public/<app>/icon-512.svg public/<app>/splash \
//     --splash-only --portrait-only --background "#000000" --padding "35%" --type png
// Re-run it when Apple ships new screen sizes, then add the new rows here.

// [device width (pt), device height (pt), pixel ratio]
const DEVICES: ReadonlyArray<readonly [number, number, number]> = [
  [1032, 1376, 2], // 2064x2752
  [1024, 1366, 2], // 2048x2732
  [834, 1210, 2], // 1668x2420
  [834, 1194, 2], // 1668x2388
  [834, 1112, 2], // 1668x2224
  [768, 1024, 2], // 1536x2048
  [820, 1180, 2], // 1640x2360
  [810, 1080, 2], // 1620x2160
  [744, 1133, 2], // 1488x2266
  [440, 956, 3], // 1320x2868
  [402, 874, 3], // 1206x2622
  [420, 912, 3], // 1260x2736
  [430, 932, 3], // 1290x2796
  [393, 852, 3], // 1179x2556
  [390, 844, 3], // 1170x2532
  [428, 926, 3], // 1284x2778
  [360, 780, 3], // 1080x2340
  [414, 896, 3], // 1242x2688
  [375, 812, 3], // 1125x2436
  [414, 896, 2], // 828x1792
  [414, 736, 3], // 1242x2208
  [375, 667, 2], // 750x1334
  [320, 568, 2], // 640x1136
];

type StartupImage = Exclude<
  NonNullable<Metadata["appleWebApp"]>,
  boolean
>["startupImage"];

export function splashScreens(app: string): StartupImage {
  return DEVICES.map(([w, h, ratio]) => ({
    url: `/${app}/splash/apple-splash-${w * ratio}-${h * ratio}.png`,
    media: `(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: portrait)`,
  }));
}
