export function getLevelAndKey(uri) {
  const uriComponents = uri.split("/"); // [ 's3:', '', 'bucket', 'private', 'path' ]
  let level = undefined;
  let key = "";
  console.log(uriComponents);
  if (
    uriComponents[3] === "private" ||
    uriComponents[3] === "protected" ||
    uriComponents[3] === "public"
  ) {
    level = uriComponents[3];
    const keyComponents = uriComponents.splice(4);
    key = keyComponents.join("/");
    return { level, key };
  } else {
    // Skip - since this is not valid level

    console.error(
      "Download failed. Invalid access level : " + uriComponents[3]
    );
    return {};
  }
}
