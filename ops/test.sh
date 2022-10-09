cat << EndOfMessage
...
sr-production | 3/6 | 9:57:39 PM | CREATE_IN_PROGRESS   | AWS::IAM::Policy    | vercel-functions-user/DefaultPolicy (vercelfunctionsuserDefaultPolicy1551A536) Resource creation Initiated
sr-production | 4/6 | 9:57:39 PM | CREATE_COMPLETE      | AWS::IAM::AccessKey | vercel-functions-secret (vercelfunctionssecret74387FB6)
sr-production | 5/6 | 9:57:54 PM | CREATE_COMPLETE      | AWS::IAM::Policy    | vercel-functions-user/DefaultPolicy (vercelfunctionsuserDefaultPolicy1551A536)
sr-production | 6/6 | 9:57:56 PM | CREATE_COMPLETE      | AWS::CloudFormation::Stack | sr-production
 ✅  sr-production
✨  Deployment time: 77.14s
Outputs:
sr-production.srproductionhistoricReadingsBucket = somesecret-hide
sr-production.srproductionvercelAccessKeyId = somesecret-hide
sr-production.srproductionvercelAccessKeySecret = somesecret-hide

Stack ARN:
arn:aws:cloudformation:eu-west-2:916609091239:stack/sr-production/1d323cd0-4754-11ed-a2f3-0232a8a7b76e
✨  Total time: 83.37s
Done in 99.21s.
Collected static files (public/, static/, .next/static): 3.045ms
Build Completed in /vercel/output [2m]
Generated build outputs:
 - Static files: 17
 - Serverless Functions: 0
 - Edge Functions: 0
Deployed outputs in 1s
Build completed. Populating build cache...
Uploading build cache [120.02 MB]...
Build cache uploaded: 3.696s
Done with "."
...
EndOfMessage
