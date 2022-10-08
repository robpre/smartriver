import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CfnOutput } from "aws-cdk-lib";
import type { OutputObject } from "../.secrets.json";

export interface Props extends cdk.StackProps {
  stage: string;
}

const output = (stack: cdk.Stack, key: keyof OutputObject, value: string) => {
  new CfnOutput(stack, key, {
    value,
    exportName: key,
  });
};

export class SmartRiverStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, `historic-readings`, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      cors: [
        {
          allowedHeaders: ["*"],
          allowedOrigins: ["*"],
          allowedMethods: [s3.HttpMethods.POST],
        },
      ],
    });

    const vercelUser = new iam.User(this, `vercel-functions-user`);
    const accessKey = new iam.AccessKey(this, `vercel-functions-secret`, {
      user: vercelUser,
    });

    output(this, `VERCEL_ACCESS_KEY_ID`, accessKey.accessKeyId);
    output(
      this,
      `VERCEL_ACCESS_KEY_SECRET`,
      accessKey.secretAccessKey.unsafeUnwrap()
    );
  }
}
