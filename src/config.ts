import type SecretType from "../.secrets.json";

export const BRANCH_NAME =
  process.env.VERCEL_GIT_COMMIT_REF || process.env.NOW_GITHUB_COMMIT_REF || "";
export const NODE_ENV = process.env.NODE_ENV;
export const SLUG_BRANCH_NAME = BRANCH_NAME.replace(/[^a-z0-9]+/g, "-");

const branchStage = BRANCH_NAME === "main" ? "production" : SLUG_BRANCH_NAME;
export const APP_STAGE = process.env.APP_STAGE || branchStage;

export const APP_NAME = `sr-${APP_STAGE}`;

export const getSecrets = () => {
  try {
    const file = require("../.secrets.json") as SecretType;

    if (!file[APP_NAME]) {
      throw new Error(`Missing ${APP_NAME} in ${Object.keys(file)}`);
    }

    return file[APP_NAME];
  } catch (err) {
    if (err && (err as { code: string }).code === "MODULE_NOT_FOUND") {
      return null;
    }

    throw err;
  }
};
