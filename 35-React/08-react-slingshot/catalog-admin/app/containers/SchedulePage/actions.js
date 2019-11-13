import {
  ADD_BUNDLING_DRAGGABLE_SHOT,
  ADD_CALENDAR_DRAGGABLE_SHOT,
  CLEAR_CALENDAR_DRAGGABLE_SHOT,
  CLEAR_DRAGGABLE_SHOT,
} from '../../actions/types';

export function addBundlingDraggableShots(payload) {
  return {
    type: ADD_BUNDLING_DRAGGABLE_SHOT,
    payload,
  };
}

export function addCalendarDraggableShots(payload) {
  return {
    type: ADD_CALENDAR_DRAGGABLE_SHOT,
    payload,
  };
}

export function clearCalendarDraggableShots() {
  return {
    type: CLEAR_CALENDAR_DRAGGABLE_SHOT,
    payload: {},
  };
}

export function clearDraggableShots() {
  return {
    type: CLEAR_DRAGGABLE_SHOT,
    payload: {},
  };
}
