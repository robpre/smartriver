import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient, TranslateConfig } from "@aws-sdk/lib-dynamodb";
import { SESClient } from "@aws-sdk/client-ses";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Credentials } from "@aws-sdk/types";
import { getSecrets } from "../getSecrets";
import { memo } from "./memo";

const secrets = getSecrets();

const credentials: Credentials | undefined = secrets
  ? {
      accessKeyId: secrets?.vercelAccessKeyId,
      secretAccessKey: secrets?.vercelAccessKeySecret,
    }
  : undefined;
const region = "eu-west-2";

const translateConfig: TranslateConfig = {
  marshallOptions: {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: false, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
  },
  unmarshallOptions: {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
  },
};

export const aws = memo(() => ({
  s3: new S3Client({
    credentials,
    region,
  }),
  ses: new SESClient({
    credentials,
    region,
  }),
  db: DynamoDBDocumentClient.from(
    new DynamoDBClient({
      credentials,
      region,
    }),
    translateConfig
  ),
}));
