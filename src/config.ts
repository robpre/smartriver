import type SecretType from "../.secrets.json";

export const BRANCH_NAME =
  process.env.VERCEL_GIT_COMMIT_REF || process.env.NOW_GITHUB_COMMIT_REF || "";
export const NODE_ENV = process.env.NODE_ENV;
export const SLUG_BRANCH_NAME = BRANCH_NAME.replace(/[^a-z0-9]+/g, "-");

const branchStage = BRANCH_NAME === "main" ? "production" : SLUG_BRANCH_NAME;
export const APP_STAGE = process.env.APP_STAGE || branchStage;

export const getSecrets = async (): Promise<SecretType> => {
  try {
    return import("../.secrets.json");
  } catch (err) {
    throw err;
  }
};
