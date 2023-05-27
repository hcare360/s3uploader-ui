import React from "react";
import { S3ResourceSelector } from "@cloudscape-design/components";
import { fetchVersions } from "./fetchVersions";
import { fetchObjects } from "./fetchObjects";
import { fetchBuckets } from "./fetchBuckets";
import { SelfDismissibleAlert } from "../s3-resource-download";

export function S3CustomSelector({
  resource,
  fetchError,
  mode,
  wrapWithErrorHandler,
  setResource,
  setValidationError,
  viewURL,
  inContextInputPlaceholder,
}) {
  console.log({ fetchBuckets, fetchObjects, fetchVersions });
  return (
    <S3ResourceSelector
      resource={resource}
      alert={
        fetchError && (
          <SelfDismissibleAlert type="error" header="Data fetching error">
            {fetchError}
          </SelfDismissibleAlert>
        )
      }
      selectableItemsTypes={["objects"]} //, "versions"
      objectsIsItemDisabled={(object) =>
        (mode === "read" && object.IsFolder) ||
        (mode === "write" && !object.IsFolder)
      }
      fetchBuckets={wrapWithErrorHandler(() => fetchBuckets())}
      fetchObjects={wrapWithErrorHandler((bucketName, pathPrefix) =>
        fetchObjects(bucketName, pathPrefix)
      )}
      fetchVersions={wrapWithErrorHandler((bucketName, pathPrefix) =>
        fetchVersions(bucketName, pathPrefix)
      )}
      i18nStrings={{
        inContextInputPlaceholder:
          inContextInputPlaceholder || "s3://bucket/prefix/object",
        inContextSelectPlaceholder: "Choose a version",
        inContextBrowseButton: "Browse S3",
        inContextViewButton: "View",
        inContextViewButtonAriaLabel: "View (opens in a new tab)",
        inContextLoadingText: "Loading resource",
        inContextUriLabel: "S3 URI",
        inContextVersionSelectLabel: "Object version",
        modalTitle: "Choose an archive in S3",
        modalCancelButton: "Cancel",
        modalSubmitButton: "Choose",
        modalBreadcrumbRootItem: "S3 buckets",
        selectionBuckets: "Buckets",
        selectionObjects: "Objects",
        selectionVersions: "Versions",
        selectionBucketsSearchPlaceholder: "Find bucket",
        selectionObjectsSearchPlaceholder: "Find object by prefix",
        selectionVersionsSearchPlaceholder: "Find version",
        selectionBucketsLoading: "Loading buckets",
        selectionBucketsNoItems: "No buckets",
        selectionObjectsLoading: "Loading objects",
        selectionObjectsNoItems: "No objects",
        selectionVersionsLoading: "Loading versions",
        selectionVersionsNoItems: "No versions",
        filteringCounterText: (count) =>
          "" + count + (count === 1 ? " match" : " matches"),
        filteringNoMatches: "No matches",
        filteringCantFindMatch: "We can't find a match.",
        clearFilterButtonText: "Clear filter",
        columnBucketID: "ID",
        columnBucketName: "Name",
        columnBucketCreationDate: "Creation date",
        columnBucketRegion: "Region",
        columnBucketAccess: "Access",
        columnObjectID: "ID",
        columnObjectKey: "Key",
        columnObjectLastModified: "Last modified",
        columnObjectSize: "Size",
        columnVersionID: "Version ID",
        columnVersionLastModified: "Last modified",
        columnVersionSize: "Size",
        validationPathMustBegin: "The path must begin with s3://",
        validationBucketLowerCase:
          "The bucket name must start with a lowercase character or number.",
        validationBucketMustNotContain:
          "The bucket name must not contain uppercase characters.",
        validationBucketMustComplyDns:
          "The bucket name must comply with DNS naming conventions",
        validationBucketLength:
          "The bucket name must be from 3 to 63 characters.",
        labelSortedDescending: (columnName) =>
          columnName + ", sorted descending",
        labelSortedAscending: (columnName) => columnName + ", sorted ascending",
        labelNotSorted: (columnName) => columnName + ", not sorted",
        labelsPagination: {
          nextPageLabel: "Next page",
          previousPageLabel: "Previous page",
          pageLabel: (pageNumber) => "Page " + pageNumber + " of all pages",
        },
        labelsBucketsSelection: {
          itemSelectionLabel: (data, item) => item.Name,
          selectionGroupLabel: "Buckets",
        },
        labelsObjectsSelection: {
          itemSelectionLabel: (data, item) => item.Key,
          selectionGroupLabel: "Objects",
        },
        labelsVersionsSelection: {
          itemSelectionLabel: (data, item) => item.CreationDate,
          selectionGroupLabel: "Versions",
        },
        labelFiltering: (itemsType) => "Find " + itemsType,
        labelRefresh: "Refresh the data",
        labelAlertDismiss: "Dismiss the alert",
        labelModalDismiss: "Dismiss the modal",
        labelBreadcrumbs: "S3 navigation",
      }}
      onChange={({ detail }) => {
        setResource(detail.resource);
        setValidationError(detail.errorText);
      }}
      viewHref={viewURL}
    />
  );
}
