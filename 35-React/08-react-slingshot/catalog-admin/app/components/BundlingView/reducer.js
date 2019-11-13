import {
  APPLY_SORT,
  BUNDLING_REARRANGE,
  BUNDLING_REARRANGE_FAILED,
  FETCH_BUNDLING,
  FETCH_BUNDLING_FAILED,
  REARRANGE_BUNDLING_INSIDE_DRAG,
  RESET_BUNDLING,
  REVERSE_SORT,
  UPDATE_BUNDLING_SHOT_PAYLOAD,
} from '../../actions/types';

import { formatDateToString, getShotCounterInfo } from '../../helpers/common';
import { SHOT_STATUS } from '../../common/shot/constants';
import { applySort } from '../ShotSwimlane/helpers';
import { PRODUCTION_BOARD_STATE } from '../../common/constants';

export const BUNDLING_DEFAULT_STATE = {
  bundlingShots: [],
  shotsDict: {},
};

export function bundlingReducer(
  state = BUNDLING_DEFAULT_STATE,
  { type, payload },
) {
  switch (type) {
    case FETCH_BUNDLING:
      state.bundlingShots = [...state.bundlingShots, ...payload];
      state.shotsDict = { ...state.shotsDict, ...parseShots(payload) };
      return { ...state };
    case REARRANGE_BUNDLING_INSIDE_DRAG:
      state.bundlingShots = payload;
      state.shotsDict = { ...parseShots(state.bundlingShots) };
      return { ...state };
    case UPDATE_BUNDLING_SHOT_PAYLOAD:
      return getRefreshedBundling(state, payload);
    case RESET_BUNDLING:
      state.bundlingShots = [];
      state.shotsDict = {};
      return { ...state };
    case BUNDLING_REARRANGE:
      return getRefreshedBundling(payload.bundlingShots, state);
    case REVERSE_SORT:
      if (payload.activeScreen === PRODUCTION_BOARD_STATE.PRODUCTION_CALENDAR)
        return reverseShotsSortOrder(state, payload);
      return { ...state };
    case APPLY_SORT:
      if (payload.activeScreen === PRODUCTION_BOARD_STATE.PRODUCTION_CALENDAR) {
        applySortOnShotCards(state, payload);
      }
      return { ...state };
    case FETCH_BUNDLING_FAILED:
    case BUNDLING_REARRANGE_FAILED:
    default:
      return { ...state };
  }
}

function parseShots(shots) {
  const shotsDictionary = {};
  shots.forEach(shot => {
    getShotCardStatus(shot);
    shotsDictionary[shot.id] = shot;
  });
  return shotsDictionary;
}

function getRefreshedBundling(state, payload) {
  const scheduleOn = payload.shot_info.schedule_on.timestamp;
  // Check whether the schedule on date is for past or not
  // const isPastScheduleOn = () =>
  //   new Date(`${new Date().toDateString()} 00:00:00`) >=
  //   new Date(`${new Date(scheduleOn).toDateString()} 00:00:00`);
  // const validForBacklog = !scheduleOn || isPastScheduleOn();
  const validForBundling = !scheduleOn;
  const bundlingShots = [];
  state.bundlingShots.forEach(shot => {
    if (shot.id === payload.id && validForBundling) {
      getShotCardStatus(payload);
      bundlingShots.push(payload);
    } else if (shot.id !== payload.id) {
      bundlingShots.push(shot);
    }
  });
  state.bundlingShots = bundlingShots;
  if (validForBundling) {
    state.shotsDict[payload.id] = payload;
  } else {
    delete state.shotsDict[payload.id];
  }
  return { ...state };
}

function getShotCardStatus(shot) {
  if (
    shot.shot_info.status === SHOT_STATUS.PHOTOSHOOT &&
    shot.shot_info.schedule_on &&
    shot.shot_info.schedule_on.timestamp <
      new Date(`${new Date().toDateString()} 00:00:00`).getTime()
  ) {
    shot.shot_info.displayStatus = SHOT_STATUS.SPILLED;
  } else {
    shot.shot_info.displayStatus = shot.shot_info.status;
  }
}

export const shotDataToShotCard = function(shot) {
  return {
    id: shot.id,
    brand: shot.brand.brand_name,
    category: shot.shot_info.category.name,
    setup: shot.shot_info.setup_type.name,
    display_date: formatDateToString(shot.shot_info.due_date.timestamp),
    shotNumber: shot.shot_info.shot_number,
    shotStatus: shot.shot_info.displayStatus,
    selectableData: shot.shot_info.locked_info.readonly ? null : shot,
    owner: shot.shot_info.owner,
    locked: shot.shot_info.locked,
    type: 'backlog',
    shot,
    draggable: !shot.shot_info.locked_info.readonly,
    droppable: !shot.shot_info.locked_info.readonly,
    disabled: shot.shot_info.locked_info.readonly,
    counterInfo: getShotCounterInfo(shot),
  };
};

const applySortOnShotCards = (state, payload) => {
  const sortTypeObj = payload.data;
  const sortedShots = applySort(sortTypeObj.propString, state.bundlingShots);
  state.bundlingShots = [...sortedShots];
  return state;
};

const reverseShotsSortOrder = (state, payload) => {
  state.bundlingShots = [...state.bundlingShots.reverse()];
  return state;
};
