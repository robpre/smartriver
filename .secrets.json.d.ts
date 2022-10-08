// {
//   "sr-<env>": {
//     "VERCEL_ACCESS_KEY_ID": ""
//     "VERCEL_ACCESS_KEY_SECRET": ""
//   }
// }

export interface OutputObject {
  vercelAccessKeyId: string;
  vercelAccessKeySecret: string;
  historicReadingsBucket: string;
}

type Contents = Record<string, OutputObject>;

export = Contents;
