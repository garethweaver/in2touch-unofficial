import type { MetadataRoute } from "next";

const APP = process.env.NEXT_PUBLIC_APPNAME!.toLocaleLowerCase();

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${process.env.NEXT_PUBLIC_APPNAME} Unofficial`,
    short_name: process.env.NEXT_PUBLIC_APPNAME,
    description: `Shows game times and league tables from the ${process.env.NEXT_PUBLIC_APPNAME} website`,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    prefer_related_applications: false,
    icons: [
      {
        src: `/${APP}/favicon.ico`,
        sizes: "32x32",
        type: "image/x-icon",
      },
      {
        purpose: "maskable",
        src: `/${APP}/icon-512-maskable.svg`,
        sizes: "48x48 72x72 96x96 128x128 256x256 512x512",
        type: "image/svg+xml",
      },
      {
        src: `/${APP}/icon-512.svg`,
        sizes: "48x48 72x72 96x96 128x128 256x256 512x512",
        type: "image/svg+xml",
      },
      {
        purpose: "maskable",
        src: `/${APP}/icon-512-maskable.png`,
        type: "image/png",
        sizes: "512x512",
      },
      {
        src: `/${APP}/icon-512.png`,
        type: "image/png",
        sizes: "512x512",
      },
      {
        purpose: "maskable",
        src: `/${APP}/icon-192-maskable.png`,
        type: "image/png",
        sizes: "192x192",
      },
      {
        src: `/${APP}/icon-192.png`,
        type: "image/png",
        sizes: "192x192",
      },
    ],
  };
}
