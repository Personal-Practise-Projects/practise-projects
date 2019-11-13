import { APPLY_SORT, REVERSE_SORT, SET_SORT_LIST } from '../../actions/types';

export function setSortListMetaInfo(payload) {
  return {
    type: SET_SORT_LIST,
    payload,
  };
}

export function applySort(payload) {
  return {
    type: APPLY_SORT,
    payload,
  };
}

export const reverseSort = payload => ({
  type: REVERSE_SORT,
  payload,
});
