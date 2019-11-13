import camelcaseKeys from 'camelcase-keys';

import {
  APPEND_TO_SWIMLANE,
  APPLY_SORT,
  CLEAR_SWIMLANE_DATA,
  FETCH_SWIMLANE,
  FETCH_SWIMLANE_FAILED,
  FETCH_SWIMLANE_META_INFO,
  ON_COLLABORATOR_SELECT,
  ON_SWIMLANE_SEARCH,
  RESET_SWIMLANE,
  REVERSE_SORT,
  SWIMLANE_MOVE_SHOTS,
  SWIMLANE_REARRANGE_FAILED,
  UPDATE_SHOT_PAYLOAD,
} from '../../actions/types';
import {
  applyQuickFilters,
  applySearch,
  applySort,
  DEFAULT_SORT_TYPES,
} from './helpers';
import { compareDate } from '../../helpers/common';
import { SORT_PAGE_TYPES } from '../../common/constants';

export const swimlaneDefaultState = () => ({
  metaInfo: {},
  shots: {},
  shotsDict: {},
  swimlaneShots: {},
  quickFilters: {
    shots: [],
    fields: ['shot_info.id'],
  },
  searchProjection: {
    searchString: null,
    fields: [
      'shot_info.category.name',
      'brand.brand_name',
      'shot_info.owner.name',
      'content_request',
      { product_list: ['name'] },
    ],
  },
});
export const SWIMLANE_DEFAULT_STATE = swimlaneDefaultState();

export function shotSwimlaneReducer(
  state = SWIMLANE_DEFAULT_STATE,
  { type, payload },
) {
  switch (type) {
    case APPEND_TO_SWIMLANE:
      return appendToSwimlane(state, payload);
    case CLEAR_SWIMLANE_DATA:
      return swimlaneDefaultState();
    case FETCH_SWIMLANE:
      return fetchSwimlane(state, payload);
    case RESET_SWIMLANE:
      return resetSwimlaneData(state, payload);
    case ON_SWIMLANE_SEARCH:
      state.searchProjection.searchString = payload;
      return prepareSwimlaneShots(state);
    case ON_COLLABORATOR_SELECT:
      state.quickFilters.shots = payload;
      return prepareSwimlaneShots(state);
    case UPDATE_SHOT_PAYLOAD:
      return getRefreshedSwimlane(state, payload);
    case SWIMLANE_MOVE_SHOTS:
      return moveShotsBetweenSwimlanes(state, payload);
    case FETCH_SWIMLANE_META_INFO:
      return getMetaInfo(state, payload);
    case REVERSE_SORT:
      if (payload.activeScreen === SORT_PAGE_TYPES.SWIMLANE)
        return reverseShotsSortOrder(state, payload);
      return { ...state };
    case APPLY_SORT:
      if (payload.activeScreen === SORT_PAGE_TYPES.SWIMLANE) {
        applySortOnShotCards(state, payload);
      }
      return { ...state };
    case FETCH_SWIMLANE_FAILED:
    case SWIMLANE_REARRANGE_FAILED:
    default:
      return state;
  }
}

const resetSwimlaneData = (state, swimlaneType) => {
  if (state.shots[swimlaneType]) {
    state.shots[swimlaneType].forEach(shot => {
      delete state.shotsDict[shot.id];
    });
    state.shotsDict = { ...state.shotsDict };
    state.shots[swimlaneType] = [];
  }
  return state;
};

const appendToSwimlane = (state, payload) => {
  let updated = false;
  const swimlaneShots = [...(state.shots[payload.swimlaneType] || [])];

  payload.data.forEach(shot => {
    if (!(shot.id in state.shotsDict)) {
      swimlaneShots.push(shot);
      state.shotsDict[shot.id] = shot;
      updated = true;
    }
  });

  // Only change the state if we actually updated anything
  if (updated) {
    state.shots[payload.swimlaneType] = swimlaneShots;
    state.shotsDict = { ...state.shotsDict };
  }
  return prepareSwimlaneShots(state);
};

const fetchSwimlane = (state, payload) => {
  let updated = false;
  const swimlaneShots = [];
  state.shots[payload.swimlaneType].forEach(shot => {
    delete state.shotsDict[shot.id];
    updated = true;
  });

  payload.data.forEach(shot => {
    if (!(shot.id in state.shotsDict)) {
      swimlaneShots.push(shot);
      state.shotsDict[shot.id] = shot;
      updated = true;
    }
  });

  // Only change the state if we actually updated anything
  if (updated) {
    state.shots[payload.swimlaneType] = swimlaneShots;
    state.shotsDict = { ...state.shotsDict };
  }
  return prepareSwimlaneShots(state);
};

const getRefreshedSwimlane = (state, payload) => {
  payload.updatedOn = new Date();
  const validForSwimlane = isValidDateForSwimlane(state, payload);
  if (validForSwimlane) {
    state.shotsDict[payload.id] = payload;
    const swimlane = state.shots[payload.shot_info.status];
    // If shot still exist in same swimlane as it status mean only data is changed
    const shotInSameLane =
      swimlane && swimlane.find(shot => shot.id === payload.id);
    if (shotInSameLane) {
      return prepareSwimlaneShots(state);
    }
    // Else filter other swimlane with the shot key
    Object.keys(state.shots).forEach(key => {
      state.shots[key] = state.shots[key].filter(
        shot => shot.id !== payload.id,
      );
    });
    state.shots[payload.shot_info.status].unshift(payload);
  } else {
    // Else filter other swimlane with the shot key
    Object.keys(state.shots).forEach(key => {
      state.shots[key] = state.shots[key].filter(
        shot => shot.id !== payload.id,
      );
    });
    delete state.shotsDict[payload.id];
  }
  state.shots = { ...state.shots };
  state.shotsDict = { ...state.shotsDict };
  return prepareSwimlaneShots(state);
};

function moveShotsBetweenSwimlanes(state, payload) {
  state.shots[payload.fromSwimlane] = state.shots[payload.fromSwimlane].filter(
    shot => shot.id !== payload.shot.id,
  );
  state.shots[payload.toSwimlane] = [...state.shots[payload.toSwimlane]];
  state.shots[payload.toSwimlane].unshift(payload.shot);
  state.shotsDict[payload.shot.id] = payload.shot;
  return prepareSwimlaneShots(state);
}

const prepareSwimlaneShots = state => {
  state.swimlaneShots = applySearch(state.searchProjection, state.shots);
  state.swimlaneShots = applyQuickFilters(
    state.quickFilters,
    state.swimlaneShots,
  );
  return { ...state };
};

const applySortOnShotCards = (state, payload) => {
  const swimlaneType = payload.activeScreenType;
  const sortTypeObj = payload.data;

  // Since we're changing the sort type, sort here so we end up only sorting once.
  const sortedShots = applySort(
    sortTypeObj.propString,
    state.swimlaneShots[swimlaneType],
  );
  state.swimlaneShots[swimlaneType] = [...sortedShots];
  return state;
};

const reverseShotsSortOrder = (state, payload) => {
  const swimlaneType = payload.activeScreenType;
  state.swimlaneShots[swimlaneType] = [
    ...state.swimlaneShots[swimlaneType].reverse(),
  ];
  return state;
};

const getMetaInfo = (state, payload) => {
  payload.forEach(metaInfo => {
    state.metaInfo[metaInfo.type] = parseMetaInfo(metaInfo);
    resetSwimlaneData(state, metaInfo.type);
    state.shots[metaInfo.type] = [];
  });
  state.metaInfo = { ...state.metaInfo };
  return state;
};

const parseMetaInfo = metaInfo => {
  metaInfo = camelcaseKeys(metaInfo, { deep: true });
  metaInfo.sortTypes = metaInfo.sortTypes || DEFAULT_SORT_TYPES;
  return metaInfo;
};

const isValidDateForSwimlane = (state, payload) => {
  if (payload.shot_info.status in state.shots) {
    const scheduleOn = payload.shot_info.schedule_on;
    if (scheduleOn) {
      const scheduleOnDate = new Date(payload.shot_info.schedule_on);
      const result = compareDate(scheduleOnDate);
      return !(result === 1);
    }
  }
  return false;
};
