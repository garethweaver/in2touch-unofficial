import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "In2Touch Unofficial",
    short_name: "In2Touch",
    description: "Shows gametimes and league tables from the In2Touch website",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    prefer_related_applications: false,
    orientation: "portrait",
    icons: [
      {
        purpose: "any",
        src: "icon-sq.svg",
        sizes: "48x48 72x72 96x96 128x128 256x256 512x512",
        type: "image/svg+xml",
      },
      {
        purpose: "any",
        src: "icon-sq.png",
        sizes: "48x48 72x72 96x96 128x128 256x256 512x512",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
