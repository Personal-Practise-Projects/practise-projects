import {
  ADD_PROP,
  ON_FETCH_PROPS_CONFIG,
  ON_FETCH_PROPS_DATA,
  RESET_PROPS,
} from './types';
import AxiosBuilder from '../common/axiosBuilder';
import { PROP_LIST_END_POINT } from '../common/constants';

export function updatePropsData(payload) {
  return {
    type: ON_FETCH_PROPS_DATA,
    payload,
  };
}

export function updatePropsConfig(payload) {
  return {
    type: ON_FETCH_PROPS_CONFIG,
    payload,
  };
}

export const createProp = (propName, callback) => dispatch => {
  const requestPayload = {
    data: JSON.stringify({
      name: propName,
    }),
  };
  new AxiosBuilder(PROP_LIST_END_POINT, requestPayload)
    .withAuth()
    .POST()
    .then(response => {
      const prop = response.data;

      dispatch({
        type: ADD_PROP,
        payload: prop,
      });

      callback(prop);
    });
};

export function resetPropsData(payload = []) {
  return {
    type: RESET_PROPS,
    payload,
  };
}

export const propsDispatcher = args => dispatch => {
  dispatch({ ...args });
};
