import AxiosBuilder from '../../common/axiosBuilder';

import { DONE, FAILED } from '../../common/constants';
import Logger from "../../logging/logger";
import ttlLocalStorage from "../../common/localStorage";
import { CONTENT_REQUEST_UPDATE } from "../../actions/types";

const CONTENT_REQUEST_STATUS = 'CONTENT_REQUEST_STATUS';

const logger = Logger.createLogger('ContentRequest');

export function updateContentRequestDetails(config, ref, eventListener, callback) {
  new AxiosBuilder(`/content-requests/${ref.id}/`, config)
    .withAuth()
    .PATCH()
    .then(response => {
      Object.assign(ref, response.data);
      eventListener({
        type: CONTENT_REQUEST_UPDATE,
        payload: response.data,
      });
      callback(DONE, ref);
    }).catch(error => {
    logger.error(error);
    callback(FAILED, error.response.data);
  });
}

export function getContentRequestChoices(callback) {
  const crStatus = ttlLocalStorage.getItem(CONTENT_REQUEST_STATUS);
  if (crStatus && crStatus.length > 0) {
    callback(crStatus)
  } else {
    new AxiosBuilder('/content-request-choices/')
      .withAuth()
      .fetch()
      .then(response => {
        ttlLocalStorage.setItem(CONTENT_REQUEST_STATUS, response.data,)
        callback(response.data)
      }).catch(error => {
        logger.error(error);
        callback(FAILED, error.response.data);
    });
  }
}
