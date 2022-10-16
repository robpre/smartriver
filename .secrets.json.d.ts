// {
//   "sr-<env>": {
//     "VERCEL_ACCESS_KEY_ID": ""
//     "VERCEL_ACCESS_KEY_SECRET": ""
//   }
// }

export interface OutputObject {
  [key: `${string}vercelAccessKeyId`]: string;
  [key: `${string}vercelAccessKeySecret`]: string;
  [key: `${string}historicReadingsBucket`]: string;
  [key: `${string}appStorageTableName`]: string;
}

type Contents = Record<string, OutputObject>;

export = Contents;
