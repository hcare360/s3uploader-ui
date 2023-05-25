import { Storage } from "aws-amplify";

export async function fetchObjects(bucketName, pathPrefix) {
  if (bucketName !== Storage._config.AWSS3.bucket) {
    return Promise.resolve([]);
  }
  if (pathPrefix === "") {
    return Promise.resolve([
      { Key: "public", IsFolder: true },
      { Key: "protected", IsFolder: true },
      { Key: "private", IsFolder: true },
    ]);
  }
  const pathelements = pathPrefix.split("/");
  let level = pathelements.shift();
  if (level === "private" || level === "public" || level === "protected") {
    if (level === "public") level = undefined;
    const subPrefix = pathelements.join("/");
    const subPrefixLength = subPrefix.length;
    return Storage.list(subPrefix, { level }).then((results) => {
      let files = [];
      let folders = new Set();
      results.map((res) => {
        const objectpath = res.key.substring(subPrefixLength);
        const pathSplit = objectpath.split("/");
        if (objectpath) {
          if (res.size) {
            // sometimes files declare a folder with a / within then
            let possibleFolder = pathSplit.slice(0, -1).join("/");
            if (possibleFolder) {
              folders.add(pathSplit[0] + "/"); // to combine nested folders.

              // folders.add(possibleFolder + "/"); // to avoid deeply nested paths.
            } else {
              files.push({ ...res, key: objectpath });
            }
          } else {
            folders.add(pathSplit[0] + "/"); // to combine nested folders.

            // folders.add(objectpath); // to avoid deeply nested paths.
          }
        }
      });
      const filelist = files.map((x) => {
        return {
          Key: x.key,
          LastModified: x.lastModified.toISOString(),
          Size: x.size,
          IsFolder: false,
        };
      });
      for (const f of folders) {
        filelist.push({
          Key: f,
          IsFolder: true,
        });
      }
      // console.log({ pathPrefix, subPrefix, results, files, folders, filelist });

      return filelist;
    });
  }
  return Promise.resolve(undefined);
}
