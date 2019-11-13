import React from 'react';
import AxiosBuilder from '../../../common/axiosBuilder';
import { BRAND_REFERENCES } from '../actions/types';
import { generateUniqueId } from '../../../helpers/common';
import { STATUS_DONE, STATUS_FAILED } from '../../../actions/types';
import { UPLOADING } from '../../../common/constants';
import SystemContentUploader from '../SystemContentUploader';
import BaseDataInjector, { CALLBACK_EVENTS } from './base';
import { CONTENT_STATUS, SELECT_WIDGET_CONTENT, WIDGET_FOOTER_BUTTON_TYPE, } from '../common/constants';
import { uploadEndpoint } from '../actions/commonImageAction';
import { StringHelper } from "../../../helpers/utils";

const MAX_SELECT_ALLOWED = -1;
const DRAG_AREA_MESSAGE =
  'Supported File Formats JPEG, PDF, PNG, PPT, TTF and ZIP.';

export default class BrandReferences extends BaseDataInjector {
  constructor(widgetListener, ref) {
    super();
    this.ref = ref;
    this.refId = ref.id;
    this.config = {
      title: 'Upload Brand Files',
      pickerType: BRAND_REFERENCES,
      maxAllowed: MAX_SELECT_ALLOWED,
    };
    this.widgetListener = widgetListener;
  }

  getRecent() {
    this.allData.files = dataParser(this.ref.reference_files);
    this.checkPositiveEnableForData();
    this.callbackReceiver(CALLBACK_EVENTS.DATA_RECEIVED, this.allData.files);
  }

  dragAreaMessage = () => DRAG_AREA_MESSAGE;

  getRenderingComponent(args) {
    return (
      <SystemContentUploader
        key={StringHelper.format('scu_##', this.ref.id)}
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
        notes: null,
        status: file.selected
          ? CONTENT_STATUS.MAPPED
          : CONTENT_STATUS.UN_MAPPED,
      });
    });
    return allMappedFiles;
  }

  performPositiveAction = callbackListener => {
    // Prepare api data for mapped images in shot
    this.performUpdate(
      { refId: this.ref.id, reference_files: this._selectedData() },
      callbackListener,
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

  getDisplayMessage = () => '';

  getUploadEndPoint = () => uploadEndpoint(__fileDataParser);

  getFootersButtons = () => [
    {
      id: SELECT_WIDGET_CONTENT,
      type: WIDGET_FOOTER_BUTTON_TYPE.POSITIVE,
      title: 'Save',
      classType: 'primary-cta',
      closeOnClick: true,
    },
  ];

  performUpdate = (data, callbackListener) => {
    const config = {
      data: JSON.stringify({
        reference_files: data.reference_files,
      }),
    };

    brandPatch(
      data.refId,
      config,
      (status, brand) => {
        if (status === STATUS_DONE) {
          this.ref.reference_files = brand.reference_files;
        }
        callbackListener(status, brand);
      },
      callbackListener,
    );
  };
}

function __fileDataParser(file, data) {
  Object.assign(file, {
    status: UPLOADING,
    serverKey: data.file_key,
    serverUrl: data.file_url,
    thumbUrl: data.thumb_url,
    preview: data.file_url,
  });
  return file;
}


function brandPatch(refId, config, successListener, failureListener) {
  new AxiosBuilder(`/admin-brands/${refId}/`, config)
    .PATCH()
    .then(result => {
      successListener(STATUS_DONE, result.data);
    })
    .catch(err => {
      failureListener(STATUS_FAILED, err);
    });
}

function dataParser(contents) {
  return contents.map(file => ({
    selected: file.status === CONTENT_STATUS.MAPPED,
    fileKey: file.url,
    thumbUrl: file.url,
    key: generateUniqueId(),
  }));
}
