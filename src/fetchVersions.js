export async function fetchVersions(bucketName, pathPrefix) {
  return Promise.resolve([
    {
      VersionId: "f2ef887e-af4c-4003-ad16-153d1419c024",
      LastModified: "April 30, 2019, 05:21:44 (UTC+02:00)",
      Size: 29013625564809,
    },
    {
      VersionId: "82e5f938-fe82-4977-a39a-44a549e630c1",
      LastModified: "April 10, 2019, 21:21:10 (UTC+02:00)",
      Size: 25016305995260,
    },
    {
      VersionId: "88327c30-24d0-42d2-a72d-051d9d44a106",
      LastModified: "January 27, 2020, 14:39:58 (UTC+01:00)",
      Size: 33295634938053,
    },
  ]);
}
