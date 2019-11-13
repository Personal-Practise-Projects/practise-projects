import {
  EMPTY_CONTENT_REQUESTS,
  ON_FETCH_CONTENT_REQUESTS,
  ON_FETCH_CONTENT_REQUESTS_CONFIG,
  ADD_CONTENT_REQUEST,
} from './types';
import AxiosBuilder from '../common/axiosBuilder';
import { CONTENT_REQUEST_LIST_API_ENDPOINT } from '../common/constants';

export function updateContentRequestsData(payload) {
  return {
    type: ON_FETCH_CONTENT_REQUESTS,
    payload,
  };
}

export function updateContentRequestsConfig(payload) {
  return {
    type: ON_FETCH_CONTENT_REQUESTS_CONFIG,
    payload,
  };
}

export function resetContentRequestsData(payload = []) {
  return {
    type: EMPTY_CONTENT_REQUESTS,
    payload,
  };
}

export const addContentRequest = (data, callback) => dispatch => {
  const requestPayload = {
    data: JSON.stringify({ brand_id: data }),
  };
  new AxiosBuilder(CONTENT_REQUEST_LIST_API_ENDPOINT, requestPayload)
    .POST()
    .then(response => {
      const contentRequest = response.data;
      dispatch({
        type: ADD_CONTENT_REQUEST,
        payload: contentRequest,
      });

      callback(contentRequest);
    });
};
