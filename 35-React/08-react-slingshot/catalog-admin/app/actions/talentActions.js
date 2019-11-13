import {
  ON_FETCH_TALENT,
  ON_FETCH_TALENT_CONFIG,
} from './types';

export function updateTalentData(payload) {
  return {
    type: ON_FETCH_TALENT,
    payload,
  };
}

export function updateTalentConfig(payload) {
  return {
    type: ON_FETCH_TALENT_CONFIG,
    payload,
  };
}
