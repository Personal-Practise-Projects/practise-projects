import AxiosBuilder from '../../common/axiosBuilder';
import {
  REARRANGE_BUNDLING_INSIDE_DRAG,
  RESET_BUNDLING,
  UPDATE_BUNDLING_SHOT_PAYLOAD,
} from '../../actions/types';

export function fetchBundling(status, payload) {
  return {
    type: status,
    payload,
  };
}

export function resetBundling() {
  return {
    type: RESET_BUNDLING,
    payload: [],
  };
}

export function updateShotByPayload(payload) {
  return {
    type: UPDATE_BUNDLING_SHOT_PAYLOAD,
    payload,
  };
}

export function reArrangeBundlingShots(payload) {
  return {
    type: REARRANGE_BUNDLING_INSIDE_DRAG,
    payload,
  };
}

export const updateShotCard = (shotId, payload) => dispatch => {
  new AxiosBuilder(`/shot/${shotId}/`, { data: payload })
    .withAuth()
    .PATCH()
    .then(response =>
      dispatch({
        type: UPDATE_BUNDLING_SHOT_PAYLOAD,
        payload: response.data,
      }),
    );
};
