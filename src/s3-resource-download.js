import React, { useState, useEffect } from "react";
import {
  Alert,
  Container,
  FormField,
  Header,
  Button,
  SpaceBetween,
} from "@cloudscape-design/components";
import { S3CustomSelector } from "./s3-custom-selector";
import { Storage } from "aws-amplify";
import { getLevelAndKey } from "./getLevelAndKey";
export function SelfDismissibleAlert(props) {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <Alert {...props} dismissible={true} onDismiss={() => setVisible(false)} />
  ) : (
    <></>
  );
}
export function S3ResourceDownload() {
  const [validationError, setValidationError] = useState();
  const [fetchError, setFetchError] = useState(null);
  const [resource, setResource] = useState({ uri: "" });
  const [objectViewURL, setObjectViewURL] = useState(undefined);
  console.log(objectViewURL);
  console.log(resource);
  useEffect(() => {
    const fetchURL = async () => {
      const uri = resource.uri;
      const { level, key } = getLevelAndKey(uri);
      if (level === undefined || key === undefined || key === "") {
        setObjectViewURL(undefined);
      } else {
        const url = await Storage.get(key, {
          level,
          validateObjectExistence: true,
        }); // https://docs.amplify.aws/lib/storage/download/q/platform/js/#get
        setObjectViewURL(url);
      }
    };
    fetchURL().catch((err) => {
      console.error(err);
      setObjectViewURL("");
    });

    return () => {};
  }, [resource.uri]);

  const wrapWithErrorHandler = (callback) => {
    return (...args) => {
      setFetchError(null);
      // intercept the error to display it and then propagate to the component
      return callback(...args).catch((error) => {
        setFetchError(error.message);
        throw error;
      });
    };
  };

  return (
    <Container header={<Header>Download objects from S3</Header>}>
      <FormField
        label={<Header variant="h3">Select an object</Header>}
        description="Choose an object (file) in Amazon S3. Amazon S3 is an object storage built to store and retrieve data."
        constraintText="Format: s3://bucket/prefix/object. For objects in a bucket with versioning enabled, you can choose the most recent or a previous version of the object."
        errorText={validationError}
        stretch={true}
      >
        <SpaceBetween direction="vertical" size="xs">
          <S3CustomSelector
            resource={resource}
            mode="read"
            wrapWithErrorHandler={wrapWithErrorHandler}
            fetchError={fetchError}
            setValidationError={setValidationError}
            setResource={setResource}
            viewURL={objectViewURL}
          />
          <Button
            ariaLabel="Download an object (opens new tab)"
            href={objectViewURL}
            disabled={objectViewURL ? false : true}
            iconAlign="right"
            iconName="external"
            target="_blank"
          >
            Download
          </Button>
        </SpaceBetween>
      </FormField>
    </Container>
  );
}
