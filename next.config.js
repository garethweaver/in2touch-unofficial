/** @type {import('next').NextConfig} */
const { version } = require("./package.json");

const nextConfig = {
  sassOptions: {},
  env: {
    version,
    // identifies each deploy so the service worker (public/sw.js) refreshes its cache
    buildId: process.env.VERCEL_GIT_COMMIT_SHA || String(Date.now()),
  },
  async headers() {
    return [
      {
        // always check for a new service worker
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
    ];
  },
  // Old /teams/:id and /leagues/:id links (bookmarks, shared links) still work
  async redirects() {
    return [
      { source: "/teams/:id", destination: "/teams?id=:id", permanent: true },
      { source: "/leagues/:id", destination: "/leagues?id=:id", permanent: true },
    ];
  },
};

module.exports = nextConfig;
