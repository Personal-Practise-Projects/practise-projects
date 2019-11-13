import {
  FETCH_COMMENTS,
  FETCH_SHOTS,
  FILTER,
  UPDATE_SHOTS,
  UPDATE_TIMESTAMP,
} from './types';
import { searchObject } from '../../helpers/common';
import ProductionViewCommentHandler from './commentHandler';

export const PRODUCTION_VIEW_DEFAULT_STATE = {
  shots: [],
  shotsDict: {},
  selectableShots: [],
  filteredShots: [],
  selectedTimestamp: new Date().getTime() / 1000,
  quickFilters: {
    shots: [],
    fields: ['shot_info.id'],
  },
};

export function productionViewReducer(
  state = PRODUCTION_VIEW_DEFAULT_STATE,
  { type, payload },
) {
  switch (type) {
    case FETCH_SHOTS:
      state.shots = parseShots(payload);
      state.shots.forEach(shot => {
        state.shotsDict[shot.id] = shot;
      });
      state.filteredShots = state.shots;
      state.selectableShots = state.shots.filter(shot => !shot.disabled);
      return { ...state };
    case UPDATE_SHOTS:
      state.shotsDict[payload.id] = payload;
      return { ...state };
    case FILTER:
      state = Object.assign({}, state);
      // Other Filters (i.e. Status)
      // eslint-disable-next-line no-case-declarations
      const filterKeys = Object.keys(payload.selectedFilters);
      // eslint-disable-next-line no-case-declarations
      let filteredShots = [];
      if (filterKeys.length) {
        const statusArray = payload.selectedFilters[filterKeys[0]].status.map(
          choice => choice.value,
        );
        statusArray.forEach(status => {
          state.shots.forEach(shot => {
            if (shot.shot_info.status === status) {
              filteredShots.push(shot);
            }
          });
        });
      } else {
        filteredShots = state.shots;
      }
      state.filteredShots = [...filteredShots];

      // Collaborator Filters
      state.quickFilters.shots = [...new Set(payload.shotIdsArray)];
      state = filterShots(state);
      state.selectableShots = state.shots.filter(shot => !shot.disabled);
      return state;
    case FETCH_COMMENTS:
      // eslint-disable-next-line no-case-declarations
      const shot = state.shotsDict[payload];
      // Initialize Comment Controller if not found in shot
      if (!shot.commentController) {
        shot.commentController = new ProductionViewCommentHandler(shot);
      }
      return state;
    case UPDATE_TIMESTAMP:
      state.shotsDict = {};
      state.shot = [];
      state.selectableShots = [];
      state.filteredShots = [];
      state.quickFilters = {
        shots: [],
        fields: ['shot_info.id'],
      };
      state.selectedTimestamp = payload;
      return { ...state };
    default:
      return state;
  }
}

function parseShots(shots) {
  return shots.map(shot => {
    shot.selectableData = shot.shot_info.locked_info.readonly ? null : shot;
    shot.disabled = shot.shot_info.locked_info.readonly;
    return shot;
  });
}

export const filterShots = state => {
  state.filteredShots = searchShots(state.filteredShots, state.quickFilters);
  return { ...state };
};

const searchShots = (shots, quickFilters) => {
  if (quickFilters && quickFilters.shots.length) {
    const searchData = quickFilters.shots
      .map(shotId => searchObject(shots, shotId, quickFilters.fields))
      .flat();
    return searchData;
  }
  return shots;
};
