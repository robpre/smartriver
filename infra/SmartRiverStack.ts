import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cdk from "aws-cdk-lib";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { CfnOutput } from "aws-cdk-lib";
import type { OutputObject } from "../.secrets.json";
import { stripNonAlpha } from "../src/lib/stripNonAlpha";

export interface Props extends cdk.StackProps {
  stage: string;
}
export class SmartRiverStack extends cdk.Stack {
  id: string;
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    this.id = id;

    const historyReadingsBucket = new s3.Bucket(this, `historic-readings`, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: props.stage !== "production",
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

    vercelUser.addToPolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail", "SES:SendRawEmail"],
        resources: ["*"],
        effect: iam.Effect.ALLOW,
      })
    );
    historyReadingsBucket.grantReadWrite(vercelUser);

    const db = new dynamodb.Table(this, "app-storage", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "entity", type: dynamodb.AttributeType.STRING },
      removalPolicy:
        props.stage !== "production"
          ? cdk.RemovalPolicy.DESTROY
          : cdk.RemovalPolicy.RETAIN,
    });
    db.grantFullAccess(vercelUser);

    this.output(`appStorageTableName`, db.tableName);
    this.output(`vercelAccessKeyId`, accessKey.accessKeyId);
    this.output(
      `vercelAccessKeySecret`,
      accessKey.secretAccessKey.unsafeUnwrap()
    );
    this.output(`historicReadingsBucket`, historyReadingsBucket.bucketName);
  }

  output = (key: keyof OutputObject, value: string) => {
    new CfnOutput(this, `${stripNonAlpha(this.id)}${key}`, {
      value,
      exportName: `${stripNonAlpha(this.id)}${key}`,
    });
  };
}
