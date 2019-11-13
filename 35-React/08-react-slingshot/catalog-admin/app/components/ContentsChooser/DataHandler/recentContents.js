import React from 'react';

import { SHOT_PRODUCED_CONTENT } from '../actions/types';
import SystemContentUploader from '../SystemContentUploader';
import { STATUS_DONE } from '../../../actions/types';
import { DONE } from '../../../common/constants';
import UploadFileController from '../../Upload/UploadImageComponent/dataHandler';
import {
  SELECT_WIDGET_CONTENT,
  WIDGET_FOOTER_BUTTON_TYPE,
} from '../common/constants';
import BaseDataInjector, { CALLBACK_EVENTS } from './base';
import { getS3RawContents } from '../actions/s3ContentsActions';
import {
  mapShotContentFile,
  uploadRecentContent,
} from '../actions/shotContentActions';
import Search from '../../Search';
import { SearchHandler } from '../common/recentContentSearchHandler';
import Singleton from '../../Upload/manager';
import { UPLOAD_FILE_TYPES } from '../../Upload/constants';
import { StringHelper } from '../../../helpers/utils';
import { EVENT_ACTION } from '../common/constants';

export default class RecentContent extends BaseDataInjector {
  constructor(widgetListener, ref, communicator) {
    super();
    this.config = {
      title: 'Capture',
      supportedFormat: 'image/jpeg, image/png, image/tiff, .psd, .cr2',
      pickerType: SHOT_PRODUCED_CONTENT,
      maxAllowed: -1,
    };
    this.communicator = communicator;
    this.ref = ref;
    this.refId = ref.shot_info.id;
    this.uploadFileTypeKey = UPLOAD_FILE_TYPES.UNMAPPED_CONTENT;
    this.widgetListener = widgetListener;
    this.searchHandler = new SearchHandler(this.eventListener);
    this.uploadManager = Singleton.getInstance();
  }

  getRenderingComponent(args) {
    return (
      <SystemContentUploader
        // TODO Make sure to receive from parent
        key={StringHelper.format('scu_##', this.ref.id)}
        injector={this}
        onUploadListener={args.onUploadListener}
        {...args}
      />
    );
  }

  onSearch = searchString => this.searchHandler.search(searchString);

  getTitle = () => this.ref.shot_info.shot_number;

  getHeaders = () => (
    <Search
      searchString=""
      placeholder="Search by file name"
      handler={this.onSearch}
    />
  );

  getRecent = () => {
    const filesControllers = this.uploadManager.fetchFileControllers(
      this.uploadFileTypeKey,
    );
    this.fileControllers = Object.assign(
      this.fileControllers,
      filesControllers,
    );
    if (this.allData.files.length) {
      this.callbackReceiver(CALLBACK_EVENTS.DATA_RECEIVED, this.allData.files);
    } else {
      getS3RawContents((status, result) => {
        if (status === CALLBACK_EVENTS.DATA_RECEIVED) {
          this.setAllFiles(result.files);
          this.searchHandler.setAllData(this.allData.files);
          this.callbackReceiver(status, this.allData.files);
        }
      });
    }
  };

  uploadingFileHandler = file => {
    if (!this.fileControllers[file.uid]) {
      // Create File controller for the file
      // Provide file on Upload done in controller and set status to done on upload
      // is done as no need to make next call in it
      const fileController = new UploadFileController(
        file,
        this.refId,
        this.config.pickerType,
        uploadRecentContent,
        this.__onUploadDoneListener,
      );
      this.fileControllers[file.uid] = fileController;
      // Push file controller in upload queue
      this.uploadManager.populateQueue(fileController);
    }
    return this.fileControllers[file.uid];
  };

  performPositiveAction = callbackListener => {
    // Prepare api data for mapped images in shot
    const { selectedFiles, nonSelectedFiles } = this._selectedData();
    mapShotContentFile(
      this.ref.shot_info.id,
      selectedFiles,
      (status, result) => {
        if (status === STATUS_DONE) {
          this.setAllFiles(nonSelectedFiles);
          this.ref.mapped_images = result;
        }
        callbackListener && callbackListener(status, result);
      },
    );
  };

  onFileUploaded(fileController) {
    delete this.fileControllers[fileKey];
    const fileToRecentFile = this.uploadedFileToRecentFile(fileController.file);
    if (fileToRecentFile) {
      this.allData.files.unshift(fileToRecentFile);
    }
    this.callbackReceiver &&
      this.callbackReceiver(CALLBACK_EVENTS.FILE_UPLOADED, this.allData.files);
  }

  uploadedFileToRecentFile = uploadedFile => ({
    key: uploadedFile.key,
    fileKey: uploadedFile.serverKey,
    thumbUrl: uploadedFile.thumbUrl
      ? uploadedFile.thumbUrl
      : uploadedFile.preview,
    selected: false,
  });

  getDisplayMessage = () => '';

  getFootersButtons = () => [
    {
      id: SELECT_WIDGET_CONTENT,
      type: WIDGET_FOOTER_BUTTON_TYPE.POSITIVE,
      classType: 'primary-cta',
      title: 'Map Content',
      closeOnClick: true,
    },
  ];

  eventListener = (eventType, args) => {
    if (eventType === CALLBACK_EVENTS.DATA_UPDATED) {
      this.callbackReceiver(CALLBACK_EVENTS.DATA_RECEIVED, args);
    }
  };

  widgetDidUnmount = () => {
    this.fileControllers = {};
  };

  _selectedData = () => {
    const selectedFiles = [];
    const nonSelectedFiles = [];
    this.allData.files.map(file => {
      if (file.selected) {
        selectedFiles.push({ url: file.fileKey });
      } else {
        nonSelectedFiles.push(file);
      }
    });
    return { selectedFiles, nonSelectedFiles };
  };

  __onUploadDoneListener = (fileController, callback) => {
    Object.assign(fileController.file, { status: DONE });
    this.onFileUploaded(fileController);
    callback && callback(DONE);
  };
}
