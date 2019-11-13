import {
  APPLY_FILTERS,
  CLEAR_ALL_FILTERS,
  STORE_ACTIVE_SCREEN,
  STORE_FILTER_DATA,
  TOGGLE_FILTER,
} from '../../actions/types';

export function updateAllFilters(payload) {
  return {
    type: APPLY_FILTERS,
    payload,
  };
}

export function toggleFilter(payload = undefined) {
  return {
    type: TOGGLE_FILTER,
    payload: { data: payload },
  };
}

export function clearAllFilter(payload) {
  return {
    type: CLEAR_ALL_FILTERS,
    payload,
  };
}

export function storeFilterData(payload) {
  return {
    type: STORE_FILTER_DATA,
    payload,
  };
}

export function storeActiveScreen(screenName) {
  return {
    type: STORE_ACTIVE_SCREEN,
    payload: screenName,
  };
}
