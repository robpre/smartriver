import pathlib from "path";
import fs from "fs";
import type SecretType from "../.secrets.json";
import { APP_NAME, mustGet, NODE_ENV } from "./config";
import { memo } from "./lib/memo";

class MissingEnvKeyError extends Error {
  code: string;

  constructor(msg: string, code: string) {
    super(`${code}: ${msg}`);

    this.code = code;
  }
}

const printDir = (dir: string) => {
  console.log(dir, fs.readdirSync(dir));
};

/**
 * SSR only
 */
export const getSecrets = memo(() => {
  const fullpath = pathlib.join(process.cwd(), ".secrets.json");

  printDir(process.cwd());
  printDir(pathlib.dirname(fullpath));

  try {
    const file = require(fullpath) as SecretType;

    if (!file[APP_NAME]) {
      throw new MissingEnvKeyError(
        `Missing ${APP_NAME} in ${Object.keys(file)}`,
        "MISSING_ENV"
      );
    }

    return {
      vercelAccessKeyId: mustGet(file[APP_NAME], "vercelAccessKeyId"),
      vercelAccessKeySecret: mustGet(file[APP_NAME], "vercelAccessKeySecret"),
      historicReadingsBucket: mustGet(file[APP_NAME], "historicReadingsBucket"),
      appStorageTableName: mustGet(file[APP_NAME], "appStorageTableName"),
    };
  } catch (err) {
    if (err && typeof err == "object" && "code" in err) {
      const errCode = (err as { code: unknown }).code;

      if (
        errCode === "ENOENT" ||
        errCode === "MODULE_NOT_FOUND" ||
        errCode === "MISSING_ENV"
      ) {
        console.warn(`path(${fullpath}) missing data in env, `, err);

        return {
          vercelAccessKeyId: "",
          vercelAccessKeySecret: "",
          historicReadingsBucket: "",
          appStorageTableName: "",
        };
      }
    }

    throw err;
  }
});
