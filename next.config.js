// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF || "",
    NOW_GITHUB_COMMIT_REF: process.env.NOW_GITHUB_COMMIT_REF || "",
  },
  webpack(config, ctx) {
    if (!ctx.isServer) {
      /** @type {import('webpack').IgnorePlugin} */
      const plugin = new ctx.webpack.IgnorePlugin({
        resourceRegExp: /SECRET.json/,
      });

      config.plugins.push(plugin);
    }
  },
};

module.exports = nextConfig;
