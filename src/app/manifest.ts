import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "In2Touch Unofficial",
    short_name: "In2Touch",
    description: "Shows gametimes and league tables from the In2Touch website",
    start_url: "/",
    display: "standalone",
    background_color: "#000",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
