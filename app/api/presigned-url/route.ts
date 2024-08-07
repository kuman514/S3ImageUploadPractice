import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';

import {
  amazonS3Bucket,
  amazonS3BucketRegion,
} from '^/src/shared/api/env-vars';
import { s3 } from '^/src/shared/api/s3-client';
import { PostCreateSignedUrlResponse } from '^/src/shared/api/types';

async function getSignedFileUrl(fileName: File['name']) {
  const params = {
    Bucket: amazonS3Bucket,
    Key: fileName,
  };
  const command = new PutObjectCommand(params);
  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 3600,
  });
  const fileUrl = `https://${amazonS3Bucket}.s3.${amazonS3BucketRegion}.amazonaws.com/${fileName}`;

  return {
    signedUrl,
    fileUrl,
  };
}

export async function POST(
  request: Request
): Promise<NextResponse<PostCreateSignedUrlResponse>> {
  const formData = await request.formData();
  const fileName = formData.get('fileName') as string;

  try {
    const { signedUrl, fileUrl } = await getSignedFileUrl(fileName);
    return NextResponse.json(
      { result: 'success', signedUrl, fileUrl },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { result: 'failed', error: 'Getting S3 signed URL did not work.' },
      { status: 400 }
    );
  }
}
