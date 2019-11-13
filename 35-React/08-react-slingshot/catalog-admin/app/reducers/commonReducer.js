import {
  FETCH_SHOTS_META_INFO,
  HIDE_LOADER,
  REFRESH_DETAILS,
  SHOW_LOADER,
} from '../actions/types';
import {
  GLOBAL_EVENT_TYPE,
  PRODUCTION_BOARD_STATE,
  SELECT_ITEMS_TYPE,
} from '../common/constants';
import { generateUniqueId } from '../helpers/common';

export const COMMON_DEFAULT_STATE = {
  [GLOBAL_EVENT_TYPE.SHOT]: {
    header: [],
    details: [],
    list: [],
    bulkMeta: {
      [SELECT_ITEMS_TYPE.SHOT_LIST]: [],
      [PRODUCTION_BOARD_STATE.PRE]: [],
      [PRODUCTION_BOARD_STATE.POST]: [],
    },
    detailsUpdatedVersion: generateUniqueId(),
    allowed_features: [],
    filters: {
      [SELECT_ITEMS_TYPE.SHOT_LIST]: [],
      [PRODUCTION_BOARD_STATE.PRE]: [],
      [PRODUCTION_BOARD_STATE.POST]: [],
      [PRODUCTION_BOARD_STATE.SPRINT]: [],
      [PRODUCTION_BOARD_STATE.PRODUCTION_CALENDAR]: [],
    },
  },
  showLoader: true,
};

export function commonReducer(state = COMMON_DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case FETCH_SHOTS_META_INFO:
      state.shot = {};
      state.shot.header = payload.detail_meta_info.header;
      state.shot.details = payload.detail_meta_info.details;
      state.shot.list = payload.list_meta_info;
      state.shot.bulkMeta = payload.bulk_meta;
      state.shot.allowed_features = payload.allowed_features_meta_info;
      state.shot.productionView = payload.sprint_meta_info;
      state.shot.detailsUpdatedVersion = generateUniqueId();
      state.shot.filters = payload.filters;
      return {
        ...state,
      };
    case REFRESH_DETAILS:
      state[payload.type].detailsUpdatedVersion = generateUniqueId();
      return { ...state };
    case SHOW_LOADER:
      state.showLoader = true;
      return { ...state };
    case HIDE_LOADER:
      state.showLoader = false;
      return { ...state };
    default:
      return state;
  }
}
