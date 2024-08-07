import { S3Client } from '@aws-sdk/client-s3';

import { amazonS3BucketRegion, awsAccessKey, awsSecretKey } from './env-vars';

export const s3 = new S3Client({
  credentials: {
    accessKeyId: awsAccessKey ?? 'IAM ACCESS KEY ABSENT',
    secretAccessKey: awsSecretKey ?? 'IAM SECRET ACCESS KEY ABSENT',
  },
  region: amazonS3BucketRegion ?? 'S3 REGION ABSENT',
});
