/** @type {import('next').NextConfig} */
const { version } = require("./package.json");

const nextConfig = {
  sassOptions: {},
  env: {
    version,
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
