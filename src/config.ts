import type SecretType from "../.secrets.json";
import { stripNonAlpha } from "./lib/stripNonAlpha";

export const BRANCH_NAME =
  process.env.VERCEL_GIT_COMMIT_REF || process.env.NOW_GITHUB_COMMIT_REF || "";
export const NODE_ENV = process.env.NODE_ENV;
export const SLUG_BRANCH_NAME = BRANCH_NAME.replace(/[^a-z0-9]+/g, "-");

const branchStage = BRANCH_NAME === "main" ? "production" : SLUG_BRANCH_NAME;
export const APP_STAGE =
  NODE_ENV === "development" ? "local" : process.env.APP_STAGE || branchStage;
export const APP_NAME = `sr-${APP_STAGE}`;

export const mustGet = (
  o: SecretType.OutputObject,
  appless: string
): string => {
  const key = `${stripNonAlpha(
    APP_NAME
  )}${appless}` as keyof SecretType.OutputObject;

  if (o[key]) {
    return o[key];
  }

  throw new Error(`missing ${key} in ${Object.keys(o)}`);
};
