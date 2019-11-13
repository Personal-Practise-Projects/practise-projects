import {
  ADD_BUNDLING_DRAGGABLE_SHOT,
  ADD_CALENDAR_DRAGGABLE_SHOT,
  CLEAR_CALENDAR_DRAGGABLE_SHOT,
  CLEAR_DRAGGABLE_SHOT,
} from '../../actions/types';
import { SCHEDULE_PAGE_TYPE } from './constants';

export const SCHEDULE_DEFAULT_STATE = function() {
  return {
    shotsDict: {
      [SCHEDULE_PAGE_TYPE.BUNDLING]: {},
      [SCHEDULE_PAGE_TYPE.CALENDAR]: {},
    },
  };
};

export function scheduleReducer(
  state = SCHEDULE_DEFAULT_STATE(),
  { type, payload },
) {
  switch (type) {
    case ADD_BUNDLING_DRAGGABLE_SHOT:
      state.shotsDict = { ...state.shotsDict };
      state.shotsDict[SCHEDULE_PAGE_TYPE.BUNDLING] = {
        ...state.shotsDict[SCHEDULE_PAGE_TYPE.BUNDLING],
        ...payload,
      };
      return {
        ...state,
      };
    case ADD_CALENDAR_DRAGGABLE_SHOT:
      state.shotsDict = { ...state.shotsDict };
      state.shotsDict[SCHEDULE_PAGE_TYPE.CALENDAR] = {
        ...state.shotsDict[SCHEDULE_PAGE_TYPE.CALENDAR],
        ...payload,
      };
      return {
        ...state,
      };
    case CLEAR_CALENDAR_DRAGGABLE_SHOT:
      state.shotsDict[SCHEDULE_PAGE_TYPE.CALENDAR] = {};
      return {
        ...state,
      };
    case CLEAR_DRAGGABLE_SHOT:
      Object.assign(state.shotsDict, SCHEDULE_DEFAULT_STATE().shotsDict);
      return {
        ...state,
      };
    default:
      return state;
  }
}
