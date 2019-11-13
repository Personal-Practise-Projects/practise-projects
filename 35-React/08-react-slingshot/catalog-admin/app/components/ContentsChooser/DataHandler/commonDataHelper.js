import React from 'react';
import AxiosBuilder from '../../../common/axiosBuilder';
import { STATUS_DONE, STATUS_FAILED } from '../../../actions/types';
import { EVENT_ACTION, } from '../common/constants';


function shotPatch(refId, config, successListener, failureListener) {
  new AxiosBuilder(`/shot/${refId}/`, config)
    .PATCH()
    .then(result => {
      successListener(STATUS_DONE, result.data);
    })
    .catch(err => {
      failureListener(STATUS_FAILED, err);
    });
}

export function performShotUpdate(eventAction, data, callbackListener) {
  if (eventAction === EVENT_ACTION.REFERENCE_MAPPED) {
    const config = {
      data: JSON.stringify({
        image_references: { action: 'REPLACED', images: data.images },
      }),
    };
    shotPatch(data.refId, config, callbackListener, callbackListener);
  } else if (eventAction === EVENT_ACTION.REFERENCE_NOTES) {
    const config = {
      data: JSON.stringify({
        image_references: { action: 'UPDATED', images: data.images },
      }),
    };
    shotPatch(data.refId, config, callbackListener, callbackListener);
  }
}

