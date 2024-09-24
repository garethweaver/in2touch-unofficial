/** @type {import('next').NextConfig} */
const { version } = require("./package.json");

const nextConfig = {
  sassOptions: {},
  env: {
    version,
  },
};

module.exports = nextConfig;
