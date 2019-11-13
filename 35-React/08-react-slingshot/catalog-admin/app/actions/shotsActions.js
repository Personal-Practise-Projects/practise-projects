import {
  ADD_SHOT,
  DELETE_SHOT,
  EMPTY_SHOTS,
  FETCH_SHOTS,
  UPDATE_SHOT_PAYLOAD,
} from './types';
import AxiosBuilder from '../common/axiosBuilder';

export function updateShotsData(response) {
  return {
    type: FETCH_SHOTS,
    payload: response.data,
  };
}

export function updateShotByPayload(payload) {
  return {
    type: UPDATE_SHOT_PAYLOAD,
    payload,
  };
}

export const addShot = (requestId, data, callback) => dispatch => {
  const requestPayload = {
    data: JSON.stringify({ content_category: data.value }),
  };
  new AxiosBuilder(`/shots/${requestId}/`, requestPayload)
    .POST()
    .then(response => {
      const shot = response.data;

      dispatch({
        type: ADD_SHOT,
        payload: shot,
      });

      callback(shot);
    });
};

export const resetShotsData = payload => ({
  type: EMPTY_SHOTS,
  payload,
});

export function deleteShot(payload) {
  return {
    type: DELETE_SHOT,
    payload,
  };
}
