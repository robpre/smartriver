#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { SmartRiverStack } from "./SmartRiverStack";
import { slugBranchName } from "../src/lib/getVercelEnv";
import { BRANCH_NAME } from "../src/config";

const stage = BRANCH_NAME === "main" ? "production" : slugBranchName;

const app = new cdk.App();

new SmartRiverStack(app, `sr-${stage}`, {
  stage,
});
