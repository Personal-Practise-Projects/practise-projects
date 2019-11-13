import { ADD_PROP, ON_FETCH_PROPS_CONFIG, ON_FETCH_PROPS_DATA, ON_UPDATE_PROP, RESET_PROPS, } from '../actions/types';

export const PROP_DEFAULT_STATE = {
  metaInfo: {
    detail_header: [],
    list_header: [],
  },
  data: [],
  propDict: {},
};

export function propReducer(state = [], { type, payload }) {
  switch (type) {
    case ON_UPDATE_PROP: {
      const props = state.data.map(
        prop => (prop.id === payload.id ? payload : prop),
      );
      state.propDict[payload.id] = payload;
      return {
        ...state,
        data: props,
      };
    }
    case ON_FETCH_PROPS_DATA: {
      const propDict = { ...state.propDict };
      payload.map(prop => {
        propDict[prop.id] = prop;
      });
      state.data.push(...payload);
      return {
        ...state,
        propDict,
      };
    }
    case ON_FETCH_PROPS_CONFIG: {
      return {
        ...state,
        metaInfo: payload,
      };
    }
    case RESET_PROPS: {
      return {
        ...state,
        data: [],
        propDict: {},
      };
    }
    case ADD_PROP: {
      const propDict = {};
      state.data.unshift(payload);
      Object.assign(propDict, state.propDict);
      propDict[payload.id] = payload;
      return {
        ...state,
        propDict,
      };
    }
    default:
      return state;
  }
}
