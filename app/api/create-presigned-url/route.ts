import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';

const awsAccessKey = process.env.MY_AWS_ACCESS_KEY;
const awsSecretKey = process.env.MY_AWS_SECRET_KEY;
const amazonS3Bucket = process.env.MY_AWS_S3_BUCKET;
const amazonS3BucketRegion = process.env.MY_AWS_S3_BUCKET_REGION;

const s3 = new S3Client({
  credentials: {
    accessKeyId: awsAccessKey ?? 'IAM ACCESS KEY ABSENT',
    secretAccessKey: awsSecretKey ?? 'IAM SECRET ACCESS KEY ABSENT',
  },
  region: amazonS3BucketRegion ?? 'S3 REGION ABSENT',
});

async function getSignedFileUrl(fileName: File['name']) {
  const params = {
    Bucket: amazonS3Bucket,
    Key: fileName,
  };
  const command = new PutObjectCommand(params);
  const url = await getSignedUrl(s3, command, {
    expiresIn: 3600,
  });

  return url;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const fileName = formData.get('fileName') as string;

  try {
    const signedUrl = await getSignedFileUrl(fileName);
    return NextResponse.json({ signedUrl }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Getting S3 signed URL did not work.' },
      { status: 400 }
    );
  }
}
