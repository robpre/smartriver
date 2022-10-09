import SecretType from "../.secrets.json";
import { APP_NAME, mustGet } from "./config";

/**
 * SSR only
 */
export const getSecrets = () => {
  try {
    const file = require("../.secrets.json") as SecretType;

    if (!file[APP_NAME]) {
      throw new Error(`Missing ${APP_NAME} in ${Object.keys(file)}`);
    }

    return {
      vercelAccessKeyId: mustGet(file[APP_NAME], "vercelAccessKeyId"),
      vercelAccessKeySecret: mustGet(file[APP_NAME], "vercelAccessKeySecret"),
      historicReadingsBucket: mustGet(file[APP_NAME], "historicReadingsBucket"),
    };
  } catch (err) {
    if (err && (err as { code: string }).code === "MODULE_NOT_FOUND") {
      return null;
    }

    throw err;
  }
};