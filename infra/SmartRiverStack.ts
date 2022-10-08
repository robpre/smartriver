import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cdk from "aws-cdk-lib";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { CfnOutput } from "aws-cdk-lib";
import type { OutputObject } from "../.secrets.json";

export interface Props extends cdk.StackProps {
  stage: string;
}
export class SmartRiverStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const historyReadingsBucket = new s3.Bucket(this, "historic-readings", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      cors: [
        {
          allowedHeaders: ["*"],
          allowedOrigins: ["*"],
          allowedMethods: [s3.HttpMethods.POST],
        },
      ],
    });
    new s3Deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3Deploy.Source.asset("./manual-scraped-data")],
      destinationBucket: historyReadingsBucket,
      destinationKeyPrefix: "manual-scraped-data", // optional prefix in destination bucket
    });

    const vercelUser = new iam.User(this, `vercel-functions-user`);
    const accessKey = new iam.AccessKey(this, `vercel-functions-secret`, {
      user: vercelUser,
    });

    historyReadingsBucket.grantReadWrite(vercelUser);

    this.output("vercelAccessKeyId", accessKey.accessKeyId);
    this.output(
      "vercelAccessKeySecret",
      accessKey.secretAccessKey.unsafeUnwrap()
    );
    this.output("historicReadingsBucket", historyReadingsBucket.bucketName);
  }

  output = (key: keyof OutputObject, value: string) => {
    new CfnOutput(this, key, {
      value,
      exportName: key,
    });
  };
}
