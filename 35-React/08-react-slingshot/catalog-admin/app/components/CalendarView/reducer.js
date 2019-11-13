import {
  CALENDAR_DATE_CHANGED,
  FETCH_CALENDAR,
  REARRANGE_CALENDAR_SHOTS,
  RESET_CALENDAR_SHOTS,
  UPDATE_CALENDAR,
  UPDATE_TIMESTAMP_SELECTED_VIEW,
} from './actions';
import {
  dateToServerTimestamp,
  getCalendarButtonGroup,
  getDateTimeInUTC,
} from '../../helpers/common';
import { UPDATE_CALENDAR_SHOT_LIST } from '../../actions/types';

export const CALENDAR_DEFAULT_STATE = {
  shots: {},
  shotsDict: {},
  timestamp: parseInt(getDateTimeInUTC(new Date()) / 1000, 10),
  calendarViewType: getCalendarButtonGroup()[0],
};

export function calendarReducer(
  state = CALENDAR_DEFAULT_STATE,
  { type, payload },
) {
  switch (type) {
    case CALENDAR_DATE_CHANGED:
      return {
        ...state,
        timestamp: payload,
      };
    case RESET_CALENDAR_SHOTS:
      state.shots = [];
      state.shotsDict = {};
      return {
        ...state,
      };
    case UPDATE_CALENDAR:
      return getRefreshedCalendar(state, payload);
    case FETCH_CALENDAR:
    case REARRANGE_CALENDAR_SHOTS:
      state.shots = payload;
      state.shotsDict = createShotDict(state.shots);
      return { ...state };
    case UPDATE_CALENDAR_SHOT_LIST:
      state.shotsDict = createShotDict(payload);
      state.shots = payload;
      return {
        ...state,
      };
    case UPDATE_TIMESTAMP_SELECTED_VIEW:
      return {
        ...state,
        calendarViewType: payload.calendarViewType,
        timestamp: payload.timestamp,
      };
    default:
      return state;
  }
}

const getRefreshedCalendar = (state, payload) => {
  let validForBundling = false;
  if (payload.shot_info.schedule_on.timestamp) {
    validForBundling =
      dateToServerTimestamp(
        new Date(
          `${new Date(
            payload.shot_info.schedule_on.timestamp,
          ).toDateString()} 00:00:00`,
        ).getTime(),
      ) ===
      dateToServerTimestamp(
        new Date(
          `${new Date(state.timestamp * 1000).toDateString()} 00:00:00`,
        ).getTime(),
      );
  }
  const shots = {};
  Object.keys(state.shots).forEach(key => {
    shots[key] = [];
    state.shots[key].forEach(shot => {
      if (shot.id === payload.id && validForBundling) {
        shots[key].push(payload);
      } else if (shot.id !== payload.id) {
        shots[key].push(shot);
      }
    });
  });
  state.shots = shots;
  if (validForBundling) {
    state.shotsDict[payload.id] = payload;
  } else {
    delete state.shotsDict[payload.id];
  }
  return { ...state };
};

function createShotDict(shots) {
  const shotsDict = {};
  if (shots) {
    Object.keys(shots).forEach(key => {
      shots[key].forEach(shot => {
        shotsDict[shot.id] = shot;
      });
    });
  }
  return shotsDict;
}
