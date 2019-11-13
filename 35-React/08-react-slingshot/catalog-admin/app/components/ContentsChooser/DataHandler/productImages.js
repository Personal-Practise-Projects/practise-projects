import React from 'react';

import AxiosBuilder from '../../../common/axiosBuilder';
import SystemContentUploader from '../SystemContentUploader';

import { PRODUCT_IMAGES } from '../actions/types';
import { generateUniqueId } from '../../../helpers/common';
import { STATUS_DONE, STATUS_FAILED } from '../../../actions/types';
import BaseDataInjector, { CALLBACK_EVENTS } from './base';
import {
  SELECT_WIDGET_CONTENT,
  WIDGET_FOOTER_BUTTON_TYPE,
} from '../common/constants';
import { uploadEndpoint } from '../actions/commonImageAction';

const IMAGE_STATUS = {
  SELECTED: 'SELECTED',
  ADDED: 'ADDED',
};

const MAX_SELECT_ALLOWED = 1;

export default class ProductImages extends BaseDataInjector {
  constructor(widgetListener, ref) {
    super();
    this.ref = ref;
    this.refId = ref.id;
    this.config = {
      title: 'Upload product images',
      supportedFormat: 'image/jpeg, image/png',
      pickerType: PRODUCT_IMAGES,
      maxAllowed: MAX_SELECT_ALLOWED,
    };
    this.widgetListener = widgetListener;
  }

  getRecent() {
    this.allData.files = dataParser(this.ref.images);
    this.checkPositiveEnableForData();
    this.callbackReceiver(CALLBACK_EVENTS.DATA_RECEIVED, this.allData.files);
  }

  getRenderingComponent(args) {
    return (
      <SystemContentUploader
        // TODO Make sure to receive from parent
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
        status: file.selected ? IMAGE_STATUS.SELECTED : IMAGE_STATUS.ADDED,
      });
    });
    return allMappedFiles;
  }

  performPositiveAction = callbackListener => {
    // Prepare api data for mapped images in shot
    this.performUpdate(
      {
        refId: this.ref.id,
        images: this._selectedData(),
      },
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

  getDisplayMessage = () =>
    `You can select ${MAX_SELECT_ALLOWED} photo for product`;

  getUploadEndPoint = () => uploadEndpoint();

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
      data: JSON.stringify({ images: data.images }),
    };

    productPatch(
      data.refId,
      config,
      (status, location) => {
        if (status === STATUS_DONE) {
          this.ref.images = location.images;
        }
        callbackListener(status, location);
      },
      callbackListener,
    );
  };
}

function productPatch(refId, config, successListener, failureListener) {
  new AxiosBuilder(`/products/${refId}/`, config)
    .PATCH()
    .then(result => {
      successListener(STATUS_DONE, result.data);
    })
    .catch(err => {
      failureListener(STATUS_FAILED, err);
    });
}

function dataParser(contents) {
  return (
    contents &&
    contents.map(file => ({
      key: generateUniqueId(),
      fileKey: file.url,
      thumbUrl: file.url,
      selected: file.status === IMAGE_STATUS.SELECTED,
    }))
  );
}
