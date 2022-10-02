export const BRANCH_NAME =
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.NOW_GITHUB_COMMIT_REF ||
  "nextjs-vercel-netlify";
export const NODE_ENV = process.env.NODE_ENV;
