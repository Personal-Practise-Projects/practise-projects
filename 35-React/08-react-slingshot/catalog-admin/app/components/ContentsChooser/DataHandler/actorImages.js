import React from 'react';
import AxiosBuilder from '../../../common/axiosBuilder';
import { ACTOR_IMAGES } from '../actions/types';
import { generateUniqueId } from '../../../helpers/common';
import { STATUS_DONE, STATUS_FAILED } from '../../../actions/types';
import SystemContentUploader from '../SystemContentUploader';
import BaseDataInjector, { CALLBACK_EVENTS } from './base';
import { CONTENT_STATUS, SELECT_WIDGET_CONTENT, WIDGET_FOOTER_BUTTON_TYPE, } from '../common/constants';
import { uploadEndpoint } from '../actions/commonImageAction';

export const MAP_TALENT = {
  MODEL: 'models',
  MANICURIST: 'manicurists',
  VIDEOGRAPHER: 'videographers',
  PRODUCT_STYLIST: 'stylists',
  HAIR_MAKEUP: 'hair_makeup',
};

const MAX_SELECT_ALLOWED = 1;

function actorPatch(refId, config, successListener, failureListener) {
  new AxiosBuilder(`/${config.talentType}/${refId}/`, config)
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

export default class ActorImages extends BaseDataInjector {
  constructor(widgetListener, ref) {
    super();
    this.ref = ref;
    this.refId = ref.id;
    this.config = {
      title: 'Upload actor images',
      supportedFormat: 'image/jpeg, image/png',
      pickerType: ACTOR_IMAGES,
      maxAllowed: MAX_SELECT_ALLOWED,
    };
    this.widgetListener = widgetListener;
  }

  getRecent() {
    this.setAllFiles(dataParser(this.ref.actor_data.images));
    this.checkPositiveEnableForData();
    this.callbackReceiver(CALLBACK_EVENTS.DATA_RECEIVED, this.allData.files);
  }

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
    `You can select ${MAX_SELECT_ALLOWED} photo for actor`;

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
    const action = this.ref.actor_data.images.length > 0 ? 'UPDATED' : 'ADDED';
    const talentType = MAP_TALENT[this.ref.actor_data.actor_type];
    const config = {
      talentType,
      data: JSON.stringify({
        actor_data: {
          images: { action, images: data.images },
        },
      }),
    };
    actorPatch(
      data.refId,
      config,
      (status, actor) => {
        if (status === STATUS_DONE) {
          this.ref.actor_data.images = actor.actor_data.images;
        }
        callbackListener(status, actor);
      },
      callbackListener,
    );
  };
}
