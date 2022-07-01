/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      // only include the pages that you want to export
      "/": { page: "/" },
      "/about": { page: "/about" },
    };
  },
};

module.exports = nextConfig;
