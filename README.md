# S3ImageUploadPractice
Amazon S3로의 이미지 업로드를 연마하는 연습용 토이 프로젝트.

## 목적
- 현재 YSOShmupRecords의 백오피스에서 슈팅게임 기록 등록 시 썸네일이나 원본 이미지를 등록할 때 미리 업로드된 URL을 제공해야 함.
- 이러한 이미지 등록 방식은 매우 불편하므로, 되도록 미리 업로드된 이미지 URL을 제공하는 것이 아닌, 백오피스에서 바로 이미지를 업로드를 하는 직관적인 방식을 사용하고 싶음.
- 이에 따라, AWS를 이용하고 있으므로, 이미지를 Amazon S3에 업로드하는 연습을 시도해보고자 함.

## 방법
- 프론트엔드 사이드에서 업로드를 위한 URL 요청을 백엔드에 POST하여 Presigned URL을 제공받고,
- 제공받은 Presigned URL에 대한 PUT 요청의 body에 파일을 담아 전송.

## 참고
- [Amazon S3 객체 업로드](https://docs.aws.amazon.com/ko_kr/AmazonS3/latest/userguide/upload-objects.html)
- [AWS SDK를 사용하여 미리 서명된 URL을 통해 객체 공유 (영문)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_Scenario_PresignedUrl_section.html)
- [다른 분이 Next.js를 활용하여 작성한 예시](https://songsong.dev/entry/S3%EC%97%90-%ED%8C%8C%EC%9D%BC%EC%9D%84-%EC%97%85%EB%A1%9C%EB%93%9C%ED%95%98%EB%8A%94-%EC%84%B8-%EA%B0%80%EC%A7%80-%EB%B0%A9%EB%B2%95)

## 경과
- YSOShmupRecords의 백오피스는 Next.js 14를 사용하고 있기 때문에, App Router의 API Routes를 시도해본다.
- 이 프로젝트는 오로지 Amazon S3로의 이미지 업로드 방법을 알아내는데 집중하기 위해, 테스트 코드를 작성하지 않는다.
- 버킷의 `CORS(Cross-origin 리소스 공유)` 정책 설정을 통해, 특정 오리진에서의 접근만을 허용시킴.
- Presigned URL로의 PUT 요청을 통한 이미지 업로드 성공.
  - 그러나, 권한 문제로 이미지를 읽을 수 없는 문제가 있음. (403 에러 발생 중)
- 이 버킷은 퍼블릭한 버킷으로 만들고 싶다. (왜냐하면 YSOShmupRecords는 모두가 읽을 수 있도록 읽기 권한을 퍼블릭으로 설정해놓음)
  - `퍼블릭 액세스 차단(버킷 설정)` 비활성화 (즉, 모든 퍼블릭 액세스 허용)
  - 버킷을 퍼블릭으로 만들었다고 해서 객체까지 액세스가 가능한건 아니더라. (아무 버킷 설정 없이 새로 업로드한 객체는 퍼블릭 액세스가 안 된다.)
  - 다음과 같은 버킷 정책을 생성하여, 각 객체들에 대한 퍼블릭 읽기 권한을 부여.
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "스테이트ID",
          "Effect": "Allow",
          "Principal": "*",
          "Action": "s3:GetObject",
          "Resource": "arn:aws:s3:::(버킷 이름)/*"
        }
      ]
    }
    ```
  - 이제 업로드한 이미지들을 퍼블릭하게 접근할 수 있게 된 것을 확인.
