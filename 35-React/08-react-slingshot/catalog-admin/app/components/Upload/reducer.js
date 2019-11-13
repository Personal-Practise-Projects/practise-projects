import {
  CLEAR_QUEUE,
  FILE_UPLOADED,
  POPULATE_QUEUE,
  REMOVE_FROM_QUEUE,
} from '../../actions/types';
import { uploadedFilesCount } from './helpers';

export const UPLOAD_QUEUE_INITIAL_STATE = {
  queue: [],
  dataDict: {},
  fileUploadedCount: 0,
};

export function uploadReducer(
  state = UPLOAD_QUEUE_INITIAL_STATE,
  { type, payload },
) {
  switch (type) {
    case POPULATE_QUEUE:
      state.queue = [...state.queue];
      state.queue.unshift(payload);
      state.dataDict[payload.uid] = payload;
      state.fileUploadedCount = uploadedFilesCount(state.queue);
      return { ...state };
    case CLEAR_QUEUE:
      state.queue = [];
      state.dataDict = {};
      state.fileUploadedCount = uploadedFilesCount(state.queue);
      return { ...state };
    case REMOVE_FROM_QUEUE:
      delete state.dataDict[payload.uid];
      const queue = state.queue.filter(object => object.uid !== payload.uid);
      state.fileUploadedCount = uploadedFilesCount(state.queue);
      return { ...state, queue };
    case FILE_UPLOADED:
      state.fileUploadedCount = uploadedFilesCount(state.queue);
      return { ...state };
    default:
      return state;
  }
}
