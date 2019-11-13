import {
  EMPTY_CONTENT_REQUESTS,
  CONTENT_REQUEST_UPDATE,
  ON_FETCH_CONTENT_REQUESTS,
  ON_FETCH_CONTENT_REQUESTS_CONFIG,
  ADD_CONTENT_REQUEST,
} from '../actions/types';

export const CR_DEFAULT_STATE = {
  metaInfo: {
    content_request_list_meta_info: [],
    detail_headers: [],
  },
  data: [],
  dataDict: {},
};

export function contentRequestReducer(
  state = CR_DEFAULT_STATE,
  { type, payload },
) {
  switch (type) {
    case CONTENT_REQUEST_UPDATE: {
      const contentRequests = state.data.map(
        contentRequest =>
          contentRequest.id === payload.id ? payload : contentRequest,
      );
      state.dataDict[payload.id] = payload;
      return {
        ...state,
        data: contentRequests,
      };
    }
    case ON_FETCH_CONTENT_REQUESTS: {
      state.data.push(...payload);
      state.data.forEach(cr => {
        state.dataDict[cr.id] = cr;
      });
      state.dataDict = { ...state.dataDict };
      return {
        ...state,
      };
    }
    case EMPTY_CONTENT_REQUESTS: {
      return {
        ...state,
        data: [],
        dataDict: {},
      };
    }
    case ON_FETCH_CONTENT_REQUESTS_CONFIG: {
      return {
        ...state,
        metaInfo: payload,
      };
    }
    case ADD_CONTENT_REQUEST: {
      const dataDict = {};
      state.data.unshift(payload);
      Object.assign(dataDict, state.dataDict);
      dataDict[payload.id] = payload;
      return {
        ...state,
        dataDict,
      };
    }
    default:
      return state;
  }
}
