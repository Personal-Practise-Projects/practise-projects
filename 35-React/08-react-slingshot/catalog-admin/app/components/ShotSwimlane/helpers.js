import {
  formatDateToString,
  searchObject,
  getShotCounterInfo,
} from '../../helpers/common';
import { getLockConfig } from '../../common/shot/helpers';

export const shotDataToSelectItem = shot => ({
  id: shot.id,
  selectableData: shot.shot_info.locked_info.readonly ? null : shot,
});

export const shotDataToShotCard = shot => ({
  id: shot.id,
  brand: shot.brand.brand_name,
  category: shot.shot_info.category.name,
  setup: shot.shot_info.setup_type.name,
  display_date: formatDateToString(shot.shot_info.due_date.timestamp),
  shotNumber: shot.shot_info.shot_number,
  selectableData: shot.shot_info.locked_info.readonly ? null : shot,
  locked: shot.shot_info.locked,
  lockedInfo: getLockConfig(shot),
  shotStatus: shot.shot_info.status,
  owner: shot.shot_info.owner,
  type: 'swimlane',
  shot,
  draggable: true,
  droppable: 'child',
  disabled: shot.shot_info.locked_info.readonly,
  counterInfo: getShotCounterInfo(shot),
});

export const applySearch = (searchProjection, shots) => {
  if (searchProjection && searchProjection.searchString) {
    const searchData = {};
    Object.keys(shots).forEach(swimlaneType => {
      searchData[swimlaneType] = searchObject(
        shots[swimlaneType],
        searchProjection.searchString,
        searchProjection.fields,
      );
    });
    return searchData;
  }
  return shots;
};

export const applyQuickFilters = (quickFilters, shots) => {
  if (quickFilters && quickFilters.shots.length) {
    const searchData = {};
    Object.keys(shots).forEach(swimlaneType => {
      searchData[swimlaneType] = quickFilters.shots
        .map(shotId =>
          searchObject(shots[swimlaneType], shotId, quickFilters.fields),
        )
        .flat();
    });
    return searchData;
  }
  return shots;
};

// TODO: Update the server api response for shots swimlane meta info to include
// this information.
export const DEFAULT_SORT_TYPES = [
  {
    type: 'BRAND',
    title: 'Brand',
    propString: 'brand.brand_name',
  },
  {
    type: 'CRID',
    title: 'CRID',
    propString: 'content_request',
  },
  {
    type: 'DUE_DATE',
    title: 'Due Date',
    propString: 'shot_info.due_date.timestamp',
  },
];

export const applySort = (propString, shots) => {
  shots.sort(compareByProp(propString));
  return shots;
};

// Returns a comparator function that can be used to sort objects
// by a property. The propString should be a . delemited string.
// inspired by https://stackoverflow.com/a/5073866
//
// Example:
//  arr = [{'some': {'prop': 2}}, {'some': {'prop': 1}}];
//  arr.sort(compareByProp('some.prop'));
//  arr
//  => [{'some': {'prop': 1}}, {'some': {'prop': 2}}];
const compareByProp = propString => {
  const props = propString.split('.');
  const len = props.length;
  return (a, b) => {
    let i = 0;
    while (i < len) {
      a = a[props[i]];
      b = b[props[i]];
      i += 1;
    }
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(a)) a = a ? a.toLowerCase() : 0;
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(b)) b = b ? b.toLowerCase() : 0;

    // checks for duedate to keep shots with empty duedate at the bottom of the list.
    if (a === 0) return 1; // return 1 so that b goes first
    if (b === 0) return -1; // return -1 so that a goes first

    // eslint-disable-next-line no-nested-ternary
    return a > b ? 1 : a < b ? -1 : 0;
  };
};
