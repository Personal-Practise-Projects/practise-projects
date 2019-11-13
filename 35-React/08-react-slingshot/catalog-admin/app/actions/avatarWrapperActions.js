import {
  UPDATE_AVATAR_LIST,
  ON_AVATAR_SELECT,
  RESET_AVATAR_LIST,
} from './types';

export function updateAvatarList({ type, data }) {
  return {
    type: UPDATE_AVATAR_LIST,
    payload: { type, data },
  };
}

export function onAvatarSelect({ type, data }) {
  return {
    type: ON_AVATAR_SELECT,
    payload: { type, data },
  };
}

export function resetAvatarList(type) {
  return {
    type: RESET_AVATAR_LIST,
    payload: { type },
  };
}
