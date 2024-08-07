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

export interface SuccessfulDeleteImageResponse {
  result: 'success';
}

export interface FailedDeleteImageResponse {
  result: 'failed';
}

export type DeleteImageResponse =
  | SuccessfulDeleteImageResponse
  | FailedDeleteImageResponse;
