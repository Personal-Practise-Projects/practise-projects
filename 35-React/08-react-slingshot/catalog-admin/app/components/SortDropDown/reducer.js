import { APPLY_SORT, SET_SORT_LIST } from '../../actions/types';

export const SORT_DEFAULT_STATE = {
  PRODUCTION_CALENDAR: {
    availableOptions: [],
    selectedOption: {},
    selectedOrder: '',
  },
  PRE: {
    availableOptions: [],
  },
  POST: {
    availableOptions: [],
  },
};

export function sortReducer(state = SORT_DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case SET_SORT_LIST: {
      state[payload.activeScreen].availableOptions = payload.data;
      return {
        ...state,
      };
    }
    case APPLY_SORT:
      return { ...state };
    default:
      return state;
  }
}
