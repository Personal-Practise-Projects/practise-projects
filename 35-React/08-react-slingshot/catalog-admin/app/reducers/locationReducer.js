import {
  ADD_LOCATION,
  ADD_LOCATION_FAILED,
  FETCH_LOCATIONS,
  FETCH_LOCATIONS_FAILED,
  FETCH_LOCATIONS_HEADER,
  FETCH_LOCATIONS_HEADER_FAILED,
  RESET_LOCATIONS,
  UPDATE_LOCATION,
  UPDATE_LOCATION_FAILED,
  UPDATE_LOCATION_IMAGES,
  UPDATE_LOCATION_IMAGES_FAILED,
} from '../actions/types';

export const LOCATION_DEFAULT_STATE = {
  metaInfo: {
    headers: [],
    detail_headers: [],
  },
  data: [],
  locationDict: {},
};

export function locationReducer(
  state = LOCATION_DEFAULT_STATE,
  { type, payload },
) {
  switch (type) {
    case ADD_LOCATION:
      state.data.unshift(payload);
      const locationDict = Object.assign({}, state.locationDict);
      locationDict[payload.id] = payload;
      return {
        ...state,
        data: [...state.data],
        locationDict,
      };
      break;
    case FETCH_LOCATIONS_HEADER:
      return {
        ...state,
        metaInfo: payload,
      };
      break;
    case UPDATE_LOCATION:
      state.data = [...state.data];
      return {
        ...state,
      };
      break;
    case FETCH_LOCATIONS:
      state.data = [...state.data, ...payload];
      state.locationDict = { ...state.locationDict };
      payload.map(location => {
        state.locationDict[location.id] = location;
      });
      return {
        ...state,
      };
      break;
    case UPDATE_LOCATION_IMAGES:
      const locationInfo = [];
      state.data.map(location => {
        if (location.id === payload.id) {
          const fields = payload.key.split('.');
          const firstField = fields[0];
          const lastField = fields[fields.length - 1];
          const remainingFields = fields.slice(1, fields.length - 1);
          let object = location[firstField];
          remainingFields.map(field => {
            object = object[field];
          });
          object[lastField] = [].concat(payload.value);
        }
        locationInfo.push(location);
      });
      return {
        ...state,
        data: locationInfo,
      };
      break;
    case RESET_LOCATIONS:
      return {
        ...state,
        data: [],
        locationDict: {},
      };
      break;
    case ADD_LOCATION_FAILED:
    case UPDATE_LOCATION_FAILED:
    case FETCH_LOCATIONS_FAILED:
    case FETCH_LOCATIONS_HEADER_FAILED:
    case UPDATE_LOCATION_IMAGES_FAILED:
    default:
      return state;
  }
}
