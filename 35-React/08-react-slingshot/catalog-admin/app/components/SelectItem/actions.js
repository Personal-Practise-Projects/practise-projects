import {
  SELECT_ALL,
  SELECT_ROW,
  UN_SELECT_ALL,
  UN_SELECT_ALL_EVENT,
  UN_SELECT_ROW,
} from '../../actions/types';

export function selectRow(type, data, parent) {
  return {
    type: SELECT_ROW,
    payload: { type, data, parent },
  };
}

export function selectAll(type, data, parent) {
  return {
    type: SELECT_ALL,
    payload: { type, data, parent },
  };
}

export function unSelectRow(type, data, parent) {
  return {
    type: UN_SELECT_ROW,
    payload: { type, data, parent },
  };
}

export function unSelectAll(type, parent) {
  return {
    type: UN_SELECT_ALL,
    payload: { type, data: null, parent },
  };
}

export function unSelectAllEvent(type) {
  return {
    type: UN_SELECT_ALL_EVENT,
    payload: { type, data: null },
  };
}
