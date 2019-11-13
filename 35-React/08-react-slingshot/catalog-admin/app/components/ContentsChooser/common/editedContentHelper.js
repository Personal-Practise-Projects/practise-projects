import React from 'react';
import { ALL_CONTENT_TYPES } from "./constants";
import { emptyEditedContent, emptyFile } from "./helpers";
import { getContentFeatures } from '../../../helpers/contentHelpers';
import Singleton from '../../Upload/manager';

export function getShotSelected(mappedImages) {
  const versionImageMap = {};
  mappedImages.map(variantFile => {
    __extractVersions(variantFile);
    versionImageMap[variantFile.uid] = variantFile;
  });
  return { mappedImages, versionImageMap };
}

/**
 * Fetch uploading image version from global queue and add that version in specific provided variant file
 * @param variantFile variant file for which uploading file need to fetch
 * @param existingUploads Provide list of new existing upload for this variant.
 */
const __addUploadingVersions = function(variantFile, existingUploads) {
  if (Object.keys(existingUploads).length > 0) {
    const lastRow = emptyEditedContent(variantFile);
    Object.keys(existingUploads).forEach(key => {
      const separators = key.split('_');
      const contentType = separators.pop();
      if (ALL_CONTENT_TYPES.indexOf(contentType) !== -1) {
        const controller = existingUploads[key];
        lastRow.images[contentType] = controller.file;
        //If file is uploading provide same extra config to version row data as it will update globally
        lastRow.extraConfig = controller.file.extraConfig;
      }
    });
    variantFile.editedImages.push(lastRow);
  }
};


const __extractVersions = function(variantFile) {
  const existingVersionUploads = Singleton.getInstance().fetchFileControllers(
    variantFile.uid,
  );
  const editedImages = [];
  variantFile.editedImages.forEach(versionRow => {
    let versionRowUID = versionRow.extraConfig.versionUid;
    editedImages.push(versionRow);
    const fileTypeVersionUploadsMap = __extractedVersionUploadingFile(existingVersionUploads, versionRowUID);
    ALL_CONTENT_TYPES.forEach(contentType => {
      const uploadingFileKey = fileTypeVersionUploadsMap[contentType];
        //Check File for the version type is exist in global upload queue then bring that back
      if (uploadingFileKey) {
        versionRow.images[contentType] = existingVersionUploads[uploadingFileKey].file;
        //If file is uploading provide same extra config to version row data as it will update globally
        versionRow.extraConfig = existingVersionUploads[uploadingFileKey].file.extraConfig;
        //remove uploading key file from map
        delete existingVersionUploads[uploadingFileKey];
      }
      versionRow.images[contentType].features = getContentFeatures(
        contentType,
        versionRow.images[contentType].id,
        versionRow.images[contentType].url,
      );
      versionRow.images[contentType].emptyFile = emptyFile.bind(versionRow.images[contentType]);
    })
  });
  variantFile.editedImages = editedImages;
  __addUploadingVersions(variantFile, existingVersionUploads);
};

const __extractedVersionUploadingFile = function (existingVersionUploads, versionRowUID) {
  //Find uploading file using versionUID
  const fileTypeVersionUploadsMap = {};
  Object.keys(existingVersionUploads).filter(uploadingFileKey => (
    existingVersionUploads[uploadingFileKey].file.extraConfig.versionUid === versionRowUID
  )).forEach(key => {
    fileTypeVersionUploadsMap[existingVersionUploads[key].file.fileType] = key;
  });
  return fileTypeVersionUploadsMap
};



