import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "In2Touch Unofficial",
    short_name: "In2Touch",
    description: "Shows gametimes and league tables from the In2Touch website",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    prefer_related_applications: false,
    icons: [
      {
        purpose: "maskable",
        src: "icon-512-maskable.svg",
        sizes: "48x48 72x72 96x96 128x128 256x256 512x512",
        type: "image/svg+xml",
      },
      {
        purpose: "maskable",
        src: "/icon-192-maskable.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        purpose: "maskable",
        src: "/icon-512-maskable.png",
        type: "image/png",
        sizes: "512x512",
      },
      { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
  };
}
