import AxiosBuilder from '../../common/axiosBuilder';
import { DONE, FAILED } from '../../common/constants';

export function bulkUpdateShotDetails(shotIds, bulkData, callback) {
  const config = {
    data: JSON.stringify({
      shots: shotIds,
      data: bulkData,
    }),
  };
  new AxiosBuilder('/shot/bulk/', config)
    .withAuth()
    .PATCH()
    .then(result => {
      callback && callback(DONE, result);
    })
    .catch(error => {
      callback && callback(FAILED, error.response.data);
    });
}
