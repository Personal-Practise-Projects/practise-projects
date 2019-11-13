import _ from 'lodash';
import {
  UPDATE_AVATAR_LIST,
  ON_AVATAR_SELECT,
  RESET_AVATAR_LIST,
} from '../actions/types';
import { APPROVED } from '../common/constants';

export const AVATAR_WRAPPER_DEFAULT_STATE = {
  CONTENT_REQUEST: {
    availableAvatars: {},
    selectedAvatars: {},
    selectedCount: 0,
  },
  PRE: {
    availableAvatars: {},
    selectedAvatars: {},
    selectedCount: 0,
  },
  POST: {
    availableAvatars: {},
    selectedAvatars: {},
    selectedCount: 0,
  },
  PRODUCTION_VIEW: {
    availableAvatars: {},
    selectedAvatars: {},
    selectedCount: 0,
  },
};

export function avatarWrapperReducer(
  state = AVATAR_WRAPPER_DEFAULT_STATE,
  { type, payload },
) {
  switch (type) {
    case UPDATE_AVATAR_LIST: {
      state[payload.type].availableAvatars = payload.data;
      return {
        ...state,
      };
    }
    case ON_AVATAR_SELECT: {
      const newState = _.cloneDeep(state);
      if (state[payload.type].selectedAvatars[payload.data.id]) {
        removeSelectedAvatar(newState, payload);
      } else {
        addNewAvatar(newState, payload);
      }
      return {
        ...newState,
      };
    }
    case RESET_AVATAR_LIST: {
      if (payload.type) {
        resetAvatar(state, payload.type);
      } else {
        Object.keys(state).map(key => {
          resetAvatar(state, key);
        });
      }
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}

const removeSelectedAvatar = (state, payload) => {
  state[payload.type].selectedCount--;
  delete state[payload.type].selectedAvatars[payload.data.id];
  state[payload.type].availableAvatars[payload.data.id].status = null;
};

const addNewAvatar = (state, payload) => {
  state[payload.type].selectedCount++;
  state[payload.type].selectedAvatars[payload.data.id] = payload.data;
  state[payload.type].availableAvatars[payload.data.id].status = APPROVED;
};

const resetAvatar = (state, type) => {
  state[type].selectedCount = 0;
  state[type].selectedAvatars = {};
  state[type].availableAvatars = {};
};
