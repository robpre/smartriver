#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { SmartRiverStack } from "./SmartRiverStack";
import { APP_STAGE } from "../src/config";

const app = new cdk.App();

new SmartRiverStack(app, `sr-${APP_STAGE}`, {
  stage: APP_STAGE,
});
