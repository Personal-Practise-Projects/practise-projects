import axios from 'axios';
import { STATUS_DONE, STATUS_FAILED } from '../../../actions/types';
import {
  buildShotS3GenerateSignedUrlPath,
  DONE,
  FAILED,
  SHOT_CONTENTS,
  UPLOADING,
} from '../../../common/constants';
import AxiosBuilder from '../../../common/axiosBuilder';
import { CALLBACK_EVENTS } from '../DataHandler/base';
import { EDIT_CONTENT_TYPES } from '../common/constants';
import { getEditedContentVersionRowUID } from '../common/helpers';
import { StringHelper } from '../../../helpers/utils';
import {
  editedContentDataParser,
  parseEditedContent,
} from '../common/editedContentDataParser';
import { getFileOptions } from './common';
import { MOVE_SHOT_CONTENT } from '../common/constants';

const SHOT_EDITED_CONTENTS_KEYS = {
  [EDIT_CONTENT_TYPES.PUBLIC]: 'content_file',
  [EDIT_CONTENT_TYPES.ROW]: 'raw_image_path',
};

export function uploadContent(file, refId, pickerType, progressListener) {
  const apiPath = buildShotS3GenerateSignedUrlPath(
    refId,
    file.localFile.name,
    pickerType,
  );
  return new AxiosBuilder(apiPath)
    .withDefaultAuth()
    .fetch()
    .then(result => {
      const signedUrl = result.data.url;
      const options = getFileOptions(file, progressListener);
      Object.assign(file, {
        status: UPLOADING,
        serverKey: result.data.file_key,
        serverUrl: result.data.file_url,
        thumbUrl: result.data.thumb_url,
      });
      return axios.put(signedUrl, file.localFile, options);
    })
    .then(() => {
      progressListener && progressListener(100);
    })
    .catch(() => {
      Object.assign(file, {
        status: FAILED,
      });
      progressListener(0);
    });
}

export function getEditedShotContents(refId, callback) {
  return new AxiosBuilder(`${SHOT_CONTENTS}${refId}/`)
    .withDefaultAuth()
    .fetch()
    .then(result => {
      callback(
        CALLBACK_EVENTS.DATA_RECEIVED,
        editedContentDataParser(result.data),
      );
    })
    .catch(err => {
      callback(CALLBACK_EVENTS.DATA_FAILED, err);
    });
}

export function createContent(file, config, listener) {
  new AxiosBuilder(file.extraConfig.apiEndPoint, config)
    .withDefaultAuth()
    .POST()
    .then(result => {
      // Generate new versionUid as received an entry from server
      // Update config for the all content
      const versionRow = result.data;
      file.extraConfig.rowIndex = file.extraConfig.versionUid;
      file.extraConfig.versionUid = getEditedContentVersionRowUID(
        { shotId: file.extraConfig.shotId, id: file.extraConfig.id },
        versionRow.id,
      );
      const versionRowContent = Object.assign(
        { uid: file.extraConfig.versionUid, extraConfig: file.extraConfig },
        versionRow,
      );
      parseEditedContent(file.extraConfig, versionRowContent, file.extraConfig);
      listener && listener(STATUS_DONE, versionRowContent);
    })
    .catch(err => {
      Object.assign(file, { status: FAILED });
      listener && listener(STATUS_FAILED, err);
    });
}

export function updateContent(file, config, listener) {
  const apiPath = StringHelper.format(
    '####/',
    file.extraConfig.apiEndPoint,
    file.extraConfig.versionId,
  );
  new AxiosBuilder(apiPath, config)
    .withDefaultAuth()
    .PATCH()
    .then(result => {
      const versionRowContent = Object.assign(
        { uid: file.extraConfig.versionUid, extraConfig: file.extraConfig },
        result.data,
      );
      parseEditedContent(file.extraConfig, versionRowContent, file.extraConfig);
      listener && listener(STATUS_DONE, versionRowContent);
    })
    .catch(err => listener && listener(STATUS_FAILED, err));
}

export function deleteContentFile(file, config, listener) {
  const apiPath = StringHelper.format(
    '####/',
    file.extraConfig.apiEndPoint,
    file.extraConfig.versionId,
  );
  new AxiosBuilder(apiPath, config)
    .withDefaultAuth()
    .DELETE()
    .then(result => {
      const content = Object.assign(
        { uid: file.extraConfig.versionUid },
        result.data,
      );
      parseEditedContent(file.extraConfig, content, file.extraConfig);
      listener && listener(STATUS_DONE, content);
    })
    .catch(err => listener && listener(STATUS_FAILED, err));
}

export function deleteShotContentFIle(config, shotContentId, listener) {
  const apiPath = StringHelper.format(
    '####/',
    MOVE_SHOT_CONTENT,
    shotContentId,
  );
  new AxiosBuilder(apiPath, config)
    .withDefaultAuth()
    .DELETE()
    .then(result => {
      listener && listener(STATUS_DONE);
    })
    .catch(err => listener && listener(STATUS_FAILED, err));
}

export function onEditedUploadDone(controller, queueCallback) {
  const file = controller.file;
  const config = {
    data: JSON.stringify({
      [SHOT_EDITED_CONTENTS_KEYS[file.fileType]]: file.serverKey,
    }),
  };
  if (Number.isInteger(file.extraConfig.versionId)) {
    updateContent(file, config, (status, content) =>
      __successCallback(controller, status, content, queueCallback),
    );
  } else {
    createContent(file, config, (status, content) =>
      __successCallback(controller, status, content, queueCallback),
    );
  }
}

function __successCallback(controller, status, content, queueCallback) {
  const file = controller.file;
  if (status === STATUS_DONE) {
    Object.assign(file, content.images[file.fileType], { status: DONE });
    queueCallback && queueCallback(DONE, controller);
  } else {
    queueCallback && queueCallback(FAILED, controller);
  }
}
