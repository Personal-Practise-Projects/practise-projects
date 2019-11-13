import AxiosBuilder from '../common/axiosBuilder';
import {
  LOCATIONS_API_ENDPOINT,
  LOCATIONS_META_INFO_API_ENDPOINT,
} from '../common/constants';
import {
  ADD_LOCATION,
  FETCH_LOCATIONS_HEADER,
  FETCH_LOCATIONS_HEADER_FAILED,
  RESET_LOCATIONS,
  UPDATE_LOCATION,
  UPDATE_LOCATION_IMAGES,
} from './types';

export function updateLocation(payload) {
  return {
    type: UPDATE_LOCATION,
    payload,
  };
}

export function updateLocationImages(payload) {
  return {
    type: UPDATE_LOCATION_IMAGES,
    payload,
  };
}

export function fetchLocations(status, payload) {
  return {
    type: status,
    payload,
  };
}

export function resetLocationsData() {
  return {
    type: RESET_LOCATIONS,
    payload: undefined,
  };
}

export const fetchLocationsHeader = () => dispatch => {
  new AxiosBuilder(LOCATIONS_META_INFO_API_ENDPOINT)
    .withAuth()
    .fetch()
    .then(response => {
      dispatch({
        type: FETCH_LOCATIONS_HEADER,
        payload: response.data,
      });
    })
    .catch(error => {
      dispatch({
        type: FETCH_LOCATIONS_HEADER_FAILED,
        payload: error,
      });
    });
};

export const addLocation = (location, callback) => dispatch => {
  const config = {
    data: JSON.stringify({ name: location }),
  };
  new AxiosBuilder(LOCATIONS_API_ENDPOINT, config)
    .withAuth()
    .POST()
    .then(response => {
      const location = response.data;

      callback(location);

      dispatch({
        type: ADD_LOCATION,
        payload: location,
      });
    });
};
