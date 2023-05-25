import React, { useState, useRef, useEffect } from "react";
import FormField from "@cloudscape-design/components/form-field";
import Alert from "@cloudscape-design/components/alert";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Button from "@cloudscape-design/components/button";
import TokenGroup from "@cloudscape-design/components/token-group";
import SpaceBetween from "@cloudscape-design/components/space-between";
import ProgressBar from "@cloudscape-design/components/progress-bar";
import { Storage } from "aws-amplify";
import { formatBytes } from "../App";
import { S3CustomSelector, getLevelAndKey } from "./s3-custom-selector";

export function S3ResourceUpload() {
  const hiddenFileInput = useRef(null);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [uploadList, setUploadList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [historyCount, setHistoryCount] = useState(0);

  const [validationError, setValidationError] = useState();
  const [fetchError, setFetchError] = useState(null);
  const [resource, setResource] = useState({ uri: "" });

  const [level, setLevel] = useState(undefined); // private public protected
  const [folderKey, setFolderKey] = useState(undefined);

  useEffect(() => {
    const uri = resource.uri;
    console.log(uri);
    const { level, key } = getLevelAndKey(uri);
    setLevel(level);
    setFolderKey(key);
    // console.log({ level, key });

    return () => {};
  }, [resource.uri]);

  function wrapWithErrorHandler(callback) {
    return (...args) => {
      setFetchError(null);
      // intercept the error to display it and then propagate to the component
      return callback(...args).catch((error) => {
        setFetchError(error.message);
        throw error;
      });
    };
  }

  const handleClick = () => {
    hiddenFileInput.current.value = ""; // This avoids errors when selecting the same files multiple times
    hiddenFileInput.current.click();
  };
  const handleChange = (e) => {
    e.preventDefault();
    let i,
      tempUploadList = [];
    for (i = 0; i < e.target.files.length; i++) {
      tempUploadList.push({
        label: e.target.files[i].name,
        labelTag: formatBytes(e.target.files[i].size),
        description: "File type: " + e.target.files[i].type,
        icon: "file",
        id: i,
      });
    }
    setUploadList(tempUploadList);
    setFileList(e.target.files);
  };

  function progressBarFactory(fileObject) {
    let localHistory = historyList;
    const id = localHistory.length;
    localHistory.push({
      id: id,
      percentage: 0,
      filename: fileObject.name,
      filetype: fileObject.type,
      filesize: formatBytes(fileObject.size),
      status: "in-progress",
    });
    setHistoryList(localHistory);
    return (progress) => {
      let tempHistory = historyList.slice();
      const percentage = Math.round((progress.loaded / progress.total) * 100);
      tempHistory[id].percentage = percentage;
      if (percentage === 100) {
        tempHistory[id]["status"] = "success";
      }
      setHistoryList(tempHistory);
    };
  }

  const handleUpload = () => {
    if (level === undefined || folderKey === undefined) {
      setValidationError("Please select a valid folder.");
      return;
    }

    if (uploadList.length === 0) {
      setVisibleAlert(true);
    } else {
      console.log("Uploading files to S3");
      let i,
        progressBar = [],
        uploadCompleted = [];
      for (i = 0; i < uploadList.length; i++) {
        // If the user has removed some items from the Upload list, we need to correctly reference the file
        const id = uploadList[i].id;
        const objectKey = (folderKey || "") + fileList[id].name;

        progressBar.push(progressBarFactory(fileList[id]));
        setHistoryCount(historyCount + 1);

        uploadCompleted.push(
          Storage.put(objectKey, fileList[id], {
            progressCallback: progressBar[i],
            level,
          }).then((result) => {
            // Trying to remove items from the upload list as they complete. Maybe not work correctly
            // setUploadList(uploadList.filter(item => item.label !== result.key));
            console.log(`Completed the upload of ${result.key}`);
          })
        );
      }
      // When you finish the loop, all items should be removed from the upload list
      Promise.all(uploadCompleted).then(() => setUploadList([]));
    }
  };

  const handleDismiss = (itemIndex) => {
    setUploadList([
      ...uploadList.slice(0, itemIndex),
      ...uploadList.slice(itemIndex + 1),
    ]);
  };

  const List = ({ list }) => (
    <>
      {list.map((item) => (
        <ProgressBar
          key={item.id}
          status={item.status}
          value={item.percentage}
          variant="standalone"
          additionalInfo={item.filesize}
          description={item.filetype}
          label={item.filename}
        />
      ))}
    </>
  );
  return (
    <SpaceBetween size="l">
      <Container
        id="s3-upload-multiple-objects"
        header={<Header variant="h2">Upload</Header>}
      >
        <SpaceBetween direction="vertical" size="xs">
          <Alert
            onDismiss={() => setVisibleAlert(false)}
            visible={visibleAlert}
            dismissAriaLabel="Close alert"
            dismissible
            type="error"
            header="No files selected"
          >
            You must select the files that you want to upload.
          </Alert>
          <FormField
            label={<Header variant="h3">Select file(s) and folder</Header>}
            description="Click on the Choose Files button and select the files that you want to upload. Then click the Browse S3 button to select the folder in S3. Format: s3://bucket/prefix/object."
            constraintText=""
            errorText={validationError}
            stretch={true}
          />
          <S3CustomSelector
            resource={resource}
            mode="write"
            wrapWithErrorHandler={wrapWithErrorHandler}
            fetchError={fetchError}
            setValidationError={setValidationError}
            setResource={setResource}
          />
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={handleClick} iconAlign="left" iconName="upload">
              Choose file[s]
            </Button>

            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleChange}
              style={{ display: "none" }}
              multiple
            />
            <Button variant="primary" onClick={handleUpload}>
              Upload
            </Button>
          </SpaceBetween>

          <TokenGroup
            onDismiss={({ detail: { itemIndex } }) => {
              handleDismiss(itemIndex);
            }}
            items={uploadList}
            alignment="vertical"
            limit={10}
          />
        </SpaceBetween>
      </Container>
      <Container id="history" header={<Header variant="h2">History</Header>}>
        <List list={historyList} />
      </Container>
    </SpaceBetween>
  );
}
