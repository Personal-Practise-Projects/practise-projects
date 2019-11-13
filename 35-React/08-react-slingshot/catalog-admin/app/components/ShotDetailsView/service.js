import AxiosBuilder from '../../common/axiosBuilder';
import { DETAILS_VIEW_EVENT } from './constants';
import { DONE, FAILED } from '../../common/constants';

export function updateShotDetails(config, ref, eventListener, callback) {
  new AxiosBuilder(`/shot/${ref.id}/`, config)
    .withAuth()
    .PATCH()
    .then(result => {
      Object.assign(ref, result.data);
      eventListener({
        event: DETAILS_VIEW_EVENT.UPDATED_SHOT_DETAILS,
        payload: ref,
      });
      callback(DONE, ref);
    })
    .catch(error => {
      callback(FAILED, error.response.data);
    });
}
