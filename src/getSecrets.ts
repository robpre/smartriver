import SecretType from "../.secrets.json";
import { APP_NAME, mustGet } from "./config";
import { memo } from "./lib/memo";

/**
 * SSR only
 */
export const getSecrets = memo(() => {
  try {
    const file = require("../.secrets.json") as SecretType;

    if (!file[APP_NAME]) {
      throw new Error(`Missing ${APP_NAME} in ${Object.keys(file)}`);
    }

    return {
      vercelAccessKeyId: mustGet(file[APP_NAME], "vercelAccessKeyId"),
      vercelAccessKeySecret: mustGet(file[APP_NAME], "vercelAccessKeySecret"),
      historicReadingsBucket: mustGet(file[APP_NAME], "historicReadingsBucket"),
      appStorageTableName: mustGet(file[APP_NAME], "appStorageTableName"),
    };
  } catch (err) {
    if (err && (err as { code: string }).code === "MODULE_NOT_FOUND") {
      console.error("missing data");
      return null;
    }

    throw err;
  }
});

export const mustGetSecrets = () => {
  const secrets = getSecrets();

  if (!secrets) {
    throw new Error("Need secrets here");
  }

  return secrets;
};
