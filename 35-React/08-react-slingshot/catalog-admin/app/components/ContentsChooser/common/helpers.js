import { ALL_CONTENT_TYPES } from './constants';
import { SHOT_EDITED_CONTENT_API_ENDPOINT } from '../../../common/constants';
import { generateUniqueId } from '../../../helpers/common';
import { StringHelper } from '../../../helpers/utils';
import { UPLOAD_FILE_TYPES } from '../../Upload/constants';

export const fetchOtherFileTypeUploadingControllers = function(
  removedContentData,
  fileControllers,
  result,
) {
  const availableFileType = ALL_CONTENT_TYPES.filter(
    fileType => fileType !== removedContentData.fileType,
  );
  const otherUploadingController = {};
  availableFileType.map(fileType => {
    const controller = fileControllers[result.images[fileType].uid];
    if (controller) {
      otherUploadingController[controller.uid] = controller;
    }
  });
  return otherUploadingController;
};

export function emptyEditedContent(variantData) {
  const rowNumber = variantData.editedImages
    ? variantData.editedImages.length
    : 0;
  const emptyVersionData = {
    id: generateUniqueId(),
    uid: getEditedContentVersionRowUID(variantData, rowNumber),
    isEmpty: true,
    images: {},
    status: undefined,
  };
  const extraConfig = {
    shotId: variantData.shotId,
    id: variantData.id,
    versionId: undefined,
    variantUid: variantData.uid,
    versionUid: emptyVersionData.uid,
    apiEndPoint: getEditedContentApiEndPoint(variantData),
  };
  emptyVersionData.extraConfig = extraConfig;
  ALL_CONTENT_TYPES.forEach(contentType => {
    const file = {
      contentStatus: undefined,
      uid: getEditedContentUID(variantData, rowNumber, contentType),
      fileType: contentType,
      extraConfig: extraConfig,
      status: undefined,
    };
    file.emptyFile = emptyFile.bind(file);
    emptyVersionData.images[contentType] = file;
  });
  return emptyVersionData;
}

export function emptyFile() {
  return {
    contentStatus: undefined,
    uid: this.uid,
    fileType: this.fileType,
    extraConfig: this.extraConfig,
    status: undefined,
  };
}

export const getEditedContentApiEndPoint = function(rawImage) {
  return StringHelper.format(
    '####/##/',
    SHOT_EDITED_CONTENT_API_ENDPOINT,
    rawImage.shotId,
    rawImage.id,
  );
};

export const getEditedContentVariantRowUID = function(variantData) {
  return StringHelper.format(
    '##_##_##',
    UPLOAD_FILE_TYPES.EDITED_CONTENT,
    variantData.shotId,
    variantData.id,
  );
};

export const getEditedContentVersionRowUID = function(variantData, rowNumber) {
  return StringHelper.format(
    '##_##',
    getEditedContentVariantRowUID(variantData),
    rowNumber,
  );
};

export const getEditedContentUID = function(
  variantData,
  rowNumber,
  contentType,
) {
  return StringHelper.format(
    '##_##_##',
    getEditedContentVariantRowUID(variantData),
    rowNumber,
    contentType,
  );
};
