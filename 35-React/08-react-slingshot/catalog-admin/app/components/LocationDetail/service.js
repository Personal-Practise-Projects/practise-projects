import AxiosBuilder from '../../common/axiosBuilder';
import { DONE, FAILED } from '../../common/constants';

export function updateLocation(config, ref, eventListener, callback) {
  new AxiosBuilder(`/locations/${ref.id}/`, config)
    .withAuth()
    .PATCH()
    .then(response => {
      Object.assign(ref, { ...response.data });
      eventListener(ref);
      callback(DONE, ref);
    })
    .catch(error => {
      callback(FAILED, error.response.data);
    });
}
