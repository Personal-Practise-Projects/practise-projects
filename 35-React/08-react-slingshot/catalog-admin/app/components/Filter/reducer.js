import {
  APPLY_FILTERS,
  CLEAR_ALL_FILTERS,
  STORE_ACTIVE_SCREEN,
  STORE_FILTER_DATA,
  TOGGLE_FILTER,
} from '../../actions/types';
import { FILTER_MODE, WIDGET_TYPES } from './constant';

export const FILTER_DEFAULT_STATE = {
  activeScreen: '',
  isOpen: false,
};

export function filterReducer(
  state = FILTER_DEFAULT_STATE,
  { type, payload = {} },
) {
  const { activeScreen } = state;
  switch (type) {
    case APPLY_FILTERS:
      if (!activeScreen) {
        return state;
      }
      state = applyFilters(state, activeScreen, payload);
      return { ...state };
    case CLEAR_ALL_FILTERS:
      if (!activeScreen) {
        return state;
      }
      clearFilters(state, activeScreen);
      return { ...state };
    case TOGGLE_FILTER:
      if (payload.data === undefined) {
        state.isOpen = !state.isOpen;
      } else {
        state.isOpen = payload.data;
      }
      return { ...state };
    case STORE_ACTIVE_SCREEN:
      state.activeScreen = payload;
      if (!state[payload]) {
        state[payload] = {
          count: 0,
          filterData: {},
          selectedFilters: {},
          appliedFilters: {},
          localFilters: {},
        };
      }
      return { ...state };
    case STORE_FILTER_DATA:
      state[state.activeScreen].filterData = {
        ...state[state.activeScreen].filterData,
        ...payload,
      };
      return { ...state };
    default:
      return { ...state };
  }
}

const applyFilters = (state, activeScreen, payload) => {
  state = Object.assign({}, state);
  state[activeScreen].selectedFilters = payload;

  // Build appliedFilter data
  const appliedFilters = {};
  const localFilters = {};
  const filtersKeys = Object.keys(state[activeScreen].selectedFilters);
  filtersKeys.forEach(key => {
    const filterData = payload[key];
    if (filterData.type === WIDGET_TYPES.MULTIPLE_CHECKBOX_SELECT) {
      // Filter can be 2 types REMOTE or LOCAL if filter is remote it will
      // pass as a query param in api request and if it is local then filter
      // the data locally after fetching from server
      if (filterData.mode === FILTER_MODE.REMOTE) {
        const choiceKey = Object.keys(filterData)[0];
        appliedFilters[choiceKey] = filterData[choiceKey].map(
          obj => obj[filterData.projection],
        );
      } else {
        const choiceKey = Object.keys(filterData)[0];
        localFilters[choiceKey] = filterData[choiceKey].map(
          obj => obj[filterData.projection],
        );
      }
    } else {
      Object.assign(appliedFilters, payload[key]);
    }
  });

  // Store appliedFilter data
  state[activeScreen].appliedFilters = appliedFilters;
  state[activeScreen].localFilters = localFilters;
  state[activeScreen].count = filtersKeys.length;
  state.isOpen = false;
  return state;
};

const clearFilters = (state, activeScreen) => {
  const filtersKeys = Object.keys(state[activeScreen].filterData);
  filtersKeys.forEach(key => {
    state[activeScreen].filterData[key].forEach(option => {
      option.checked = false;
    });
  });
  state[activeScreen].filterData = { ...state[activeScreen].filterData };
  state[activeScreen].count = 0;
  state[activeScreen].selectedFilters = {};
  state[activeScreen].appliedFilters = {};
  state.isOpen = false;
};
