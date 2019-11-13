import AxiosBuilder from '../../common/axiosBuilder';

import { PaginationHandler } from '../../common/PaginationHandler';
import { SHOT_LIST_API_ENDPOINT } from '../../common/constants';
import { SHOT_LIST_EVENT } from '../ShotDetailsView/constants';

export const shotListHandler = (requestId, successCallback, errorCallback) =>
  new PaginationHandler(
    `${SHOT_LIST_API_ENDPOINT}${requestId}/`,
    {},
    successCallback,
    errorCallback,
    response => response,
  );

export const deleteShot = (shotId, eventListener) => {
  new AxiosBuilder(`/shot/${shotId}/`)
    .withAuth()
    .DELETE()
    .then(result => {
      eventListener({
        event: SHOT_LIST_EVENT.DELETE_SHOT,
        data: shotId,
      });
    });
};
