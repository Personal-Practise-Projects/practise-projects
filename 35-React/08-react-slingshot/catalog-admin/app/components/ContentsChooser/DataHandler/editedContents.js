import React from 'react';

import BaseDataInjector, { CALLBACK_EVENTS } from './base';

import EditImageComponent from '../EditImageComponent';
import Logger from '../../../logging/logger';
import UploadFileController from '../../Upload/UploadImageComponent/dataHandler';

import { SHOT_EDITED_CONTENT } from '../actions/types';
import { EDITED_CONTENT_ACTIONS, EVENT_ACTION } from '../common/constants';
import { STATUS_DONE, STATUS_FAILED } from '../../../actions/types';
import { DONE } from '../../../common/constants';
import {
  deleteContentFile,
  deleteShotContentFIle,
  getEditedShotContents,
  onEditedUploadDone,
  updateContent,
} from '../actions/shotEditedContentActions';
import {
  emptyEditedContent,
  fetchOtherFileTypeUploadingControllers,
} from '../common/helpers';
import { NotesDataHandler } from './notesDataHandler';
import { FILE_UPLOAD_EVENT, UPLOAD_FILE_TYPES } from '../../Upload/constants';
import Singleton from '../../Upload/manager';
import { getShotSelected } from '../common/editedContentHelper';
import { StringHelper } from '../../../helpers/utils';
import { generateUniqueId } from '../../../helpers/common';

const logger = Logger.createLogger('EditedContents');
const CALLBACK_ID = 'EDITED_CONTENT_CONTROLLER';

export default class EditedImagesController extends BaseDataInjector {
  constructor(widgetListener, ref, communicator) {
    super();
    this.ref = ref;
    this.communicator = communicator;
    this.refId = this.ref.shot_info.id;
    this.config = {
      title: 'Edits',
      supportedFormat: '',
      pickerType: SHOT_EDITED_CONTENT,
      maxAllowed: -1,
    };
    this.uploadFileTypeKey = UPLOAD_FILE_TYPES.EDITED_CONTENT;
    this.widgetListener = widgetListener;
    this.enableSave = true;
    this.variantsDataMap = {};
    this.queueKeyPrefix = StringHelper.format(
      '##_##',
      UPLOAD_FILE_TYPES.EDITED_CONTENT,
      this.refId,
    );
    // Get existing upload available for this controller from global queue
    this.fileControllers = Singleton.getInstance().fetchFileControllers(
      this.queueKeyPrefix,
    );
  }

  getRenderingComponent = args => (
    <EditImageComponent
      injector={this}
      onUploadListener={args.onUploadListener}
      selectedContentsCallback={enableSave => {
        this.enableSave = enableSave;
      }}
    />
  );

  addVersion = (variantDataRow, callbackFn) => {
    const emptyVersionRow = emptyEditedContent(variantDataRow);
    variantDataRow.editedImages.push(emptyVersionRow);
    this.variantsDataMap[variantDataRow.uid] = variantDataRow;
    callbackFn && callbackFn();
  };

  getTitle = () => this.ref.shot_info.shot_number;

  getRecent = () => {
    if (this.ref.mapped_images && this.ref.mapped_images.length) {
      this.setAllFiles(this.__extractedEditedContents());
      this.callbackReceiver(CALLBACK_EVENTS.DATA_RECEIVED, this.allData.files);
    } else {
      getEditedShotContents(this.refId, this.__editedShotCallbackFn());
    }
  };

  uploadingFileHandler = file => {
    if (!this.fileControllers[file.uid]) {
      const fileController = new UploadFileController(
        file,
        this.refId,
        StringHelper.format('##:##', this.config.pickerType, file.fileType),
        this.getUploadEndPoint(),
        onEditedUploadDone,
      );
      // Need to check whether it is actually required or not
      fileController.registerCallbackListener(
        CALLBACK_ID,
        this.__onStatusCallbackListener,
      );
      file.shotTitle = this.getTitle();
      this.fileControllers[file.uid] = fileController;
      // Push file in global queue
      Singleton.getInstance().populateQueue(fileController);
    }
    return this.fileControllers[file.uid];
  };

  performPositiveAction = () => {};

  onCanceledFile = (removedContentData, callback) => {
    if (removedContentData.status === DONE) {
      const config = {
        data: JSON.stringify({ file_type: removedContentData.fileType }),
      };
      deleteContentFile(removedContentData, config, (status, result) => {
        if (status === STATUS_DONE) {
          this.__removedEditedContents(removedContentData, result);
        }
        callback && callback(status);
      });
    } else {
      const variantRowData = this.variantsDataMap[
        removedContentData.extraConfig.variantUid
      ] || { editedImages: [] };
      const versionRowData = variantRowData.editedImages.find(
        versionRow =>
          versionRow.extraConfig.versionUid ===
          removedContentData.extraConfig.versionUid,
      );
      // get remove file data
      const oldFile = versionRowData.images[removedContentData.fileType];
      if (oldFile) {
        // Delete files state from version row data
        delete versionRowData.images[removedContentData.fileType];
        // add empty version here
        versionRowData.images[
          removedContentData.fileType
        ] = oldFile.emptyFile();
      }
      this.__removedEditedContents(removedContentData, versionRowData);
      callback && callback(status);
    }
    // Delete file from controller map
    delete this.fileControllers[removedContentData.uid];
  };

  onDeleteVariantImage = data => {
    const shotContentId = data.id;
    const file = data.fileKey;

    const config = {
      data: JSON.stringify({ file }),
    };
    deleteShotContentFIle(config, shotContentId, status => {
      switch (status) {
        case STATUS_DONE:
          this.ref.mapped_images = this.ref.mapped_images.filter(
            file => file.id !== shotContentId,
          );
          this.callbackReceiver(
            EVENT_ACTION.ORIGINAL_IMAGE_REMOVED,
            shotContentId,
          );
          break;
        case STATUS_FAILED:
          logger.log(
            `Error encountered in moving shot content file with id ${shotContentId}`,
          );
      }
    });
  };

  performAction = (actionType, file, config, callback) => {
    switch (actionType) {
      case EDITED_CONTENT_ACTIONS.UPDATE_CONTENT_STATUS:
      default:
        updateContent(file, config, (status, updatedVersionResult) => {
          if (status === STATUS_DONE) {
            const variantDataRow = this.variantsDataMap[
              file.extraConfig.variantUid
            ];
            variantDataRow.editedImages.map(versionRowData => {
              if (versionRowData.id === updatedVersionResult.id) {
                Object.assign(versionRowData, ...updatedVersionResult);
              }
            });
          }
          callback(status, updatedVersionResult);
        });
        break;
    }
  };

  widgetDidUnmount = () => {
    this.__updateUploadCallbackFnState(false);
    this.fileControllers = {};
    this.ref.mapped_images = undefined;
    this.variantsDataMap = {};
    this.allData.files = [];
  };

  getExistingData = header => new NotesDataHandler(header.editedImage, this);

  __onStatusCallbackListener = (eventType, fileController) => {
    const file = fileController.file || {};
    if (eventType === FILE_UPLOAD_EVENT.DONE) {
      if (file.extraConfig) {
        const variantRowData = this.variantsDataMap[
          file.extraConfig.variantUid
        ] || { editedImages: [] };
        const versionRowData = variantRowData.editedImages.find(
          versionRow =>
            versionRow.extraConfig.versionUid === file.extraConfig.versionUid,
        );
        if (versionRowData) {
          Object.assign(versionRowData.images[file.fileType], file);
          versionRowData.extraConfig.versionId = file.extraConfig.versionId;
          versionRowData.extraConfig.versionUid = file.extraConfig.versionUid;
        }
        this.__setAndNotifyForData();
      }
    }
  };

  __editedShotCallbackFn() {
    return (status, result) => {
      if (status === CALLBACK_EVENTS.DATA_RECEIVED) {
        this.ref.mapped_images = result;
        this.setAllFiles(this.__extractedEditedContents());
        this.callbackReceiver &&
          this.callbackReceiver(
            CALLBACK_EVENTS.DATA_RECEIVED,
            this.allData.files,
          );
      } else {
        this.callbackReceiver &&
          this.callbackReceiver(CALLBACK_EVENTS.DATA_RECEIVED, result);
      }
    };
  }

  /**
   * Removes the edited content from files data if file is already uploaded on server
   */
  __removedEditedContents(removedContentData, result) {
    const fileControllers = this.fileControllers;
    const otherUploadingController = fetchOtherFileTypeUploadingControllers(
      removedContentData,
      fileControllers,
      result,
    );
    const variantDataRow = this.variantsDataMap[
      removedContentData.extraConfig.variantUid
    ];
    if (result.id) {
      // Find the version row from variantDataRow
      const versionRow = variantDataRow.editedImages.find(
        file => file.id === removedContentData.id,
      );
      // Merge the version row with received result from api
      versionRow && Object.assign(versionRow.images, result.images);
    } else {
      // If version row have other fileType content uploading then consider them as new version
      if (
        removedContentData.id &&
        Object.keys(otherUploadingController).length
      ) {
        // Find the version row from variantDataRow
        const versionRow = variantDataRow.editedImages.find(
          file => file.id === removedContentData.id,
        );
        versionRow.id = generateUniqueId();
        // Merge the version row with received result from api
        Object.assign(versionRow.images, result.images);
      } else {
        // Both version of file is deleted
        // If empty row is single then iterate over variant image and find the updated one image
        if (variantDataRow.editedImages.length === 1) {
          // First reset the editedImages as set to none
          variantDataRow.editedImages = [];
          variantDataRow.editedImages = [emptyEditedContent(variantDataRow)];
        } else {
          // Remove entry from mapped_images as of now no use for it
          variantDataRow.editedImages = variantDataRow.editedImages.filter(
            file =>
              file.extraConfig.versionUid !==
              removedContentData.extraConfig.versionUid,
          );
        }
      }
    }
    this.__setAndNotifyForData();
  }

  __setAndNotifyForData = () => {
    // Notify view with the latest data state.
    this.setAllFiles(this.__extractedEditedContents());
    this.callbackReceiver &&
      this.callbackReceiver(CALLBACK_EVENTS.DATA_RECEIVED, this.allData.files);
  };

  /**
   * Register and unregister callback listener on all file controller for status listener
   * @private
   */
  __updateUploadCallbackFnState(register = true) {
    Object.keys(this.fileControllers).forEach(key => {
      register
        ? this.fileControllers[key].registerCallbackListener(
            CALLBACK_ID,
            this.__onStatusCallbackListener,
          )
        : this.fileControllers[key].unRegisterCallbackListener(CALLBACK_ID);
    });
  }

  /**
   * Extract all edited contents
   * @private
   */
  __extractedEditedContents() {
    const extractedContents = getShotSelected(this.ref.mapped_images);
    this.variantsDataMap = extractedContents.versionImageMap;
    this.__updateUploadCallbackFnState();
    return extractedContents.mappedImages;
  }
}
