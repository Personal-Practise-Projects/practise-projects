import { DONE } from '../../../common/constants';
import { ALL_CONTENT_TYPES } from './constants';
import { generateUniqueId } from '../../../helpers/common';
import {
  emptyEditedContent,
  getEditedContentApiEndPoint,
  getEditedContentUID,
  getEditedContentVariantRowUID,
  getEditedContentVersionRowUID,
} from './helpers';
import { StringHelper } from '../../../helpers/utils';

export function editedContentDataParser(shotContents) {
  return shotContents.map(variantRowData => {
    // Define variant data dict with required values
    const variantData = {
      id: variantRowData.id,
      shotId: variantRowData.shot_id,
      refId: variantRowData.ref_id,
      key: generateUniqueId(),
      url: variantRowData.image_url,
      compress_url: variantRowData.compress_url,
      fileKey: variantRowData.image_url,
      thumbUrl: variantRowData.thumbnail,
    };
    variantData.uid = getEditedContentVariantRowUID(variantData);
    if (variantRowData.edited_images.length) {
      // Parse all version row
      variantData.editedImages = variantRowData.edited_images.map(
        versionRowData => {
          versionRowData.uid = getEditedContentVersionRowUID(
            variantData,
            versionRowData.id,
          );
          parseEditedContent(variantData, versionRowData);
          return versionRowData;
        },
      );
    } else {
      // Add an empty row in version data when no content is uploaded
      variantData.editedImages = [emptyEditedContent(variantData)];
    }
    return variantData;
  });
}

/**
 * Parse edited content single row data and create ne
 * @param variantData in variant data required parameters are id, shotId,variantUid, versionUid and apiEndPoint
 * @param versionRowData a version data with all the file types in images
 * @param extraConfig if extra config is already exists use that
 */
export function parseEditedContent(
  variantData,
  versionRowData,
  extraConfig = null,
) {
  const rowNumber = Number.isInteger(versionRowData.id)
    ? versionRowData.id
    : variantData.editedImages
      ? variantData.editedImages.length
      : 0;
  extraConfig = extraConfig || {};
  Object.assign(extraConfig, {
    shotId: variantData.shotId || extraConfig.shotId,
    id: variantData.id || extraConfig.id,
    versionId: versionRowData.id || extraConfig.versionId,
    variantUid: variantData.uid || extraConfig.variantUid,
    versionUid: versionRowData.uid || extraConfig.uid,
    apiEndPoint: getEditedContentApiEndPoint(variantData),
  });
  versionRowData.extraConfig = extraConfig;

  ALL_CONTENT_TYPES.forEach(contentType => {
    const contentData = versionRowData.images[contentType] || {};
    const versionContentTypeFile = {
      id: versionRowData.id,
      contentStatus: versionRowData.status,
      uid: getEditedContentUID(variantData, rowNumber, contentType),
      key: StringHelper.format('##_##', contentType, versionRowData.id),
      preview: contentData.thumbnail && contentData.thumbnail.large,
      fileType: contentType,
      extraConfig,
      status: DONE,
    };
    if (Object.keys(contentData).length === 0) {
      Object.assign(versionContentTypeFile, {
        status: undefined,
        notes: undefined,
      });
    }
    Object.assign(contentData, versionContentTypeFile);
    versionRowData.images[contentType] = contentData;
  });
}
