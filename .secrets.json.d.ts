// {
//   "sr-<env>": {
//     "VERCEL_ACCESS_KEY_ID": ""
//     "VERCEL_ACCESS_KEY_SECRET": ""
//   }
// }

export interface OutputObject {
  VERCEL_ACCESS_KEY_ID: string;
  VERCEL_ACCESS_KEY_SECRET: string;
}

type Contents = Record<string, OutputObject>;

export = Contents;
