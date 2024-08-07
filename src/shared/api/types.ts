export interface SuccessfulPostCreateSignedUrlResponse {
  result: 'success';
  signedUrl: string;
  fileUrl: string;
}

export interface FailedPostCreateSignedUrlResponse {
  result: 'failed';
  error: string;
}

export type PostCreateSignedUrlResponse =
  | SuccessfulPostCreateSignedUrlResponse
  | FailedPostCreateSignedUrlResponse;
