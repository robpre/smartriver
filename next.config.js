/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
    NOW_GITHUB_COMMIT_REF: process.env.NOW_GITHUB_COMMIT_REF,
  },
};

module.exports = nextConfig;
