import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

import { amazonS3Bucket } from '^/src/shared/api/env-vars';
import { s3 } from '^/src/shared/api/s3-client';
import { DeleteImageResponse } from '^/src/shared/api/types';

async function deleteImageFile(fileName: File['name']) {
  s3.send(
    new DeleteObjectCommand({
      Bucket: amazonS3Bucket,
      Key: fileName,
    })
  );
}

export async function DELETE(
  _: Request,
  { params }: { params: { fileName: string } }
): Promise<NextResponse<DeleteImageResponse>> {
  if (!params.fileName) {
    NextResponse.json({}, { status: 400 });
  }

  try {
    await deleteImageFile(params.fileName);
    return NextResponse.json({ result: 'success' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: 'failed' }, { status: 400 });
  }
}
