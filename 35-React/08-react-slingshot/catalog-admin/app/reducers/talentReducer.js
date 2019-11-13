import {
  ON_FETCH_TALENT,
  ON_FETCH_TALENT_CONFIG,
} from '../actions/types';

export const TALENT_DEFAULT_STATE = {
  data: {
    actor_info: [],
    brand_name: '',
    cr_id: null,
  },
  metaInfo: [],
  dataDict: {},
};

export function talentReducer(
  state = TALENT_DEFAULT_STATE,
  { type, payload },
) {
  switch (type) {
    case ON_FETCH_TALENT: {
      state.data = { ...payload };
      state.data.actor_info.forEach(talent => {
        state.dataDict[talent.id] = talent;
      });
      state.dataDict = { ...state.dataDict };
      return {
        ...state,
      };
    }
    case ON_FETCH_TALENT_CONFIG: {
      return {
        ...state,
        metaInfo: payload,
      };
    }
    default:
      return state;
  }
}
