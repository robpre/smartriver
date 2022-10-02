import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CfnOutput } from "aws-cdk-lib";

export interface Props extends cdk.StackProps {
  stage: string;
}

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

    new CfnOutput(this, `vercel-access-id`, {
      value: accessKey.accessKeyId,
    });
    new CfnOutput(this, `vercel-access-secret`, {
      value: accessKey.secretAccessKey.toString(),
    });
  }
}
