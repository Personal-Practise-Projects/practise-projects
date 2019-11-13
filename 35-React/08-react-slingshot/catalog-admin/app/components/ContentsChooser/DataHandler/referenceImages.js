import React from 'react';

import { SHOT_REFERENCES_IMAGES } from '../actions/types';
import { STATUS_DONE } from '../../../actions/types';
import { performShotUpdate } from './commonDataHelper';
import { uploadReferenceImage } from '../actions/shotContentActions';
import { generateUniqueId } from '../../../helpers/common';
import SystemContentUploader from '../SystemContentUploader';
import BaseDataInjector, { CALLBACK_EVENTS } from './base';
import {
  EVENT_ACTION,
  CONTENT_STATUS,
  SELECT_WIDGET_CONTENT,
  WIDGET_FOOTER_BUTTON_TYPE,
} from '../common/constants';

const MAX_CONTENT_REFERENCE_ALLOWED = 3;

function dataParser(contents) {
  return contents.map(file => ({
    selected: CONTENT_STATUS.MAPPED === file.status,
    fileKey: file.url,
    notes: file.notes,
    thumbUrl: file.url,
    key: generateUniqueId(),
  }));
}

export default class ReferenceImages extends BaseDataInjector {
  constructor(widgetListener, ref) {
    super();
    this.enableSave = true;
    this.config = {
      title: 'Upload reference images',
      supportedFormat: 'image/jpeg, image/png',
      pickerType: SHOT_REFERENCES_IMAGES,
      maxAllowed: MAX_CONTENT_REFERENCE_ALLOWED,
    };
    this.ref = ref;
    this.refId = ref.shot_info.id;
    this.widgetListener = widgetListener;
  }

  getRecent = () => {
    this.setAllFiles(dataParser(this.ref.image_references));
    this.checkPositiveEnableForData();
    this.callbackReceiver(CALLBACK_EVENTS.DATA_RECEIVED, this.allData.files);
  };

  getRenderingComponent(args) {
    return (
      <SystemContentUploader
        // TODO Make sure to receive from parent
        key={`scu_${this.ref.id}`}
        injector={this}
        onUploadListener={args.onUploadListener}
        {...args}
      />
    );
  }

  _selectedData() {
    const allMappedFiles = [];
    this.allData.files.map(file => {
      allMappedFiles.push({
        url: file.fileKey,
        notes: file.notes,
        status: file.selected
          ? CONTENT_STATUS.MAPPED
          : CONTENT_STATUS.UN_MAPPED,
      });
    });
    return allMappedFiles;
  }

  performPositiveAction = callbackListener => {
    // Prepare api data for mapped images in shot
    const selectedFiles = this._selectedData();
    performShotUpdate(
      EVENT_ACTION.REFERENCE_MAPPED,
      {
        refId: this.ref.id,
        images: selectedFiles,
      },
      (status, result) => {
        if (status === STATUS_DONE) {
          Object.assign(this.ref, { ...result });
          this.setAllFiles(dataParser(this.ref.image_references));
          this.checkPositiveEnableForData();
        }
        callbackListener(status, result);
      },
    );
  };

  uploadedFileToRecentFile = uploadedFile => ({
    key: uploadedFile.key,
    fileKey: uploadedFile.serverUrl,
    thumbUrl: uploadedFile.thumbUrl
      ? uploadedFile.thumbUrl
      : uploadedFile.preview,
    selected: false,
  });

  getUploadEndPoint = () => uploadReferenceImage;

  getDisplayMessage = () => {
    return `You can select ${MAX_CONTENT_REFERENCE_ALLOWED} photo(s) as a reference`;
  };

  setSaveEnable = () => {
    //  By pass this as default behaviour for this tab is always remain save button enable
    //  and save data with even with no select
  };
  getFootersButtons = () => [
    {
      id: SELECT_WIDGET_CONTENT,
      type: WIDGET_FOOTER_BUTTON_TYPE.POSITIVE,
      classType: 'primary-cta',
      title: 'Save',
      closeOnClick: true,
    },
  ];
}
