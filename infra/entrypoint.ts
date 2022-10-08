#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { SmartRiverStack } from "./SmartRiverStack";
import { APP_STAGE, APP_NAME } from "../src/config";

const app = new cdk.App();

new SmartRiverStack(app, APP_NAME, {
  stage: APP_STAGE,
  env: {
    region: "eu-west-2",
  },
});
