import {
  FETCH_COMMENTS,
  FILTER,
  UPDATE_SHOTS,
  UPDATE_TIMESTAMP,
} from './types';

export function filterShots(payload) {
  return {
    type: FILTER,
    payload,
  };
}

export function fetchComments(payload) {
  return {
    type: FETCH_COMMENTS,
    payload,
  };
}

export function updateShots(payload) {
  return {
    type: UPDATE_SHOTS,
    payload,
  };
}

export function updateTimestamp(payload) {
  return {
    type: UPDATE_TIMESTAMP,
    payload,
  };
}
