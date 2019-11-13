import React from 'react';

import { UPLOADING, WAITING } from '../../../common/constants';
import { uploadContent } from '../actions/shotEditedContentActions';
import { WIDGET_FOOTER_BUTTON_TYPE } from '../common/constants';
import { generateUniqueId } from '../../../helpers/common';
import UploadFileController from '../../Upload/UploadImageComponent/dataHandler';
import { StringHelper } from '../../../helpers/utils';

export const CALLBACK_EVENTS = {
  FILE_UPLOADED: 'FILE_UPLOADED',
  DATA_RECEIVED: 'DATA_RECEIVED',
  DATA_UPDATED: 'DATA_UPDATED',
  DATA_FAILED: 'DATA_FAILED',
};

const DRAG_AREA_MESSAGE = '"Supported formats are JPG, PNG and RAW."';

export default class BaseDataReducer {
  constructor() {
    this.enableSave = false;
    this.uploadFileTypeKey = 'default';
    this.config = {};
    this.uniqueComponentKey = generateUniqueId();
    this.allData = {
      files: [],
    };
    this.callbackReceiver = null;
    this.fileControllers = {};
  }

  checkPositiveEnableForData = () => {
    this.allData.files.map(file => {
      if (file.selected) {
        this.enableSave = true;
      }
    });
  };

  getFileUID = uid => StringHelper.format('##_##', this.uploadFileTypeKey, uid);

  setCallbackReceiver = callback => {
    this.callbackReceiver = callback;
  };

  dragAreaMessage = () => DRAG_AREA_MESSAGE;

  emptyWidget = () => <div />;

  getUploadEndPoint = () => uploadContent;

  // To be implement by child class
  uploadedFileToRecentFile = () => {};

  getFootersButtons = () => [];

  getHeaders = () => '';

  getTitle = () => '';

  setSaveEnable = enableSave => {
    this.enableSave = enableSave;
  };

  getFooter = actionListener => {
    const buttons = this.getFootersButtons().map(btn => {
      switch (btn.type) {
        case WIDGET_FOOTER_BUTTON_TYPE.NEGATIVE:
          return (
            <button
              id={btn.id}
              key={StringHelper.format('btn_c_##', this.ref.id)}
              className={btn.classType}
              onClick={actionListener}
            >
              {btn.title}
            </button>
          );
        case WIDGET_FOOTER_BUTTON_TYPE.POSITIVE:
          return (
            <button
              id={btn.id}
              key={StringHelper.format('btn_p_##', this.ref.id)}
              className={btn.classType}
              onClick={actionListener}
              disabled={!this.enableSave}
            >
              {btn.title}
            </button>
          );
      }
    });

    return (
      <div className="widget-actions d-flex align-items-center justify-content-end">
        {buttons}
      </div>
    );
  };

  onFileUploaded = fileController => {
    const fileToRecentFile = this.uploadedFileToRecentFile(fileController.file);
    if (fileToRecentFile) {
      this.allData.files.unshift(fileToRecentFile);
    }
    delete this.fileControllers[fileController.uid];
    this.callbackReceiver &&
      this.callbackReceiver(CALLBACK_EVENTS.FILE_UPLOADED, this.allData.files);
  };

  uploadingFileHandler = (file, args) => {
    if (!this.fileControllers[file.uid]) {
      this.fileControllers[file.uid] = new UploadFileController(
        file,
        this.refId,
        this.config.pickerType,
        this.getUploadEndPoint(),
        this.onFileUploaded,
      );
      if (file.status === WAITING) {
        Object.assign(file, { status: UPLOADING });
        this.fileControllers[file.uid].startUpload();
      }
    }
    return this.fileControllers[file.uid];
  };

  onFileCanceled = fileKey => {
    delete this.fileControllers[fileKey];
    this.callbackReceiver &&
      this.callbackReceiver(CALLBACK_EVENTS.DATA_UPDATED, this.allData.files);
  };

  widgetDidUnmount = () => {
    const filesKeys = Object.keys(this.fileControllers);
    filesKeys.map(fileKey => {
      this.fileControllers[fileKey].cancelUpload();
      delete this.fileControllers[fileKey];
    });
  };

  setAllFiles = files => {
    this.allData.files = files || [];
  };

  hasFileData = () =>
    this.allData.files.length > 0 ||
    Object.keys(this.fileControllers).length > 0;
}
