import {
  CLEAR_QUEUE,
  FILE_UPLOADED,
  POPULATE_QUEUE,
  REMOVE_FROM_QUEUE,
} from '../../actions/types';

export function populateQueue(payload) {
  return {
    type: POPULATE_QUEUE,
    payload,
  };
}

export function removeFromQueue(payload) {
  return {
    type: REMOVE_FROM_QUEUE,
    payload,
  };
}

export function clearQueue() {
  return { type: CLEAR_QUEUE };
}

export function onFileUploaded() {
  return { type: FILE_UPLOADED };
}
