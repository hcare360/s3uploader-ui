import { Storage } from "aws-amplify";

// API calls are mocked. Please refer to the original Amazon S3 API documentation
// https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html
export async function fetchBuckets() {
  return Promise.resolve([
    {
      Name: Storage._config.AWSS3.bucket,
      CreationDate: "May 21, 2023, 22:16:38 (UTC+01:00)",
      Region: Storage._config.AWSS3.region,
    },
  ]);
}
