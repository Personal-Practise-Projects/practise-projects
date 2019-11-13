import {
  ADD_SHOT,
  DELETE_SHOT,
  EMPTY_SHOTS,
  FETCH_SHOTS,
  FETCH_SHOTS_FAILED,
  UPDATE_SHOT_PAYLOAD,
} from '../actions/types';

export const SHOTS_DEFAULT_STATE = function() {
  return {
    shots: {
      data: [],
      brand_id: null,
      title: '',
    },
    shotDict: {},
  };
};

export function shotReducer(state = SHOTS_DEFAULT_STATE(), { type, payload }) {
  switch (type) {
    case ADD_SHOT:
      const shots = { ...state.shots };
      shots.data = [...state.shots.data];
      shots.data.unshift(payload);
      state.shots = shots;
      state.shotDict[payload.id] = payload;
      return {
        ...state,
      };
    case FETCH_SHOTS:
      state.shots = payload;
      state.shots.data = [...payload.data];
      state.shotDict = {};
      payload.data.map(shot => {
        state.shotDict[shot.id] = shot;
      });
      return { ...state };
    case UPDATE_SHOT_PAYLOAD: {
      const shotDetails = [];
      state.shots.data.map(shot => {
        shotDetails.push(shot.id === payload.id ? payload : shot);
      });
      state.shotDict[payload.id] = payload;
      const shots = Object.assign({}, state.shots);
      shots.data = shotDetails;
      return { ...state, shots };
    }
    case FETCH_SHOTS_FAILED:
    case EMPTY_SHOTS:
      return SHOTS_DEFAULT_STATE();
    case DELETE_SHOT: {
      const shotDetails = state.shots.data.filter(
        shotDetail => shotDetail.id !== payload,
      );
      delete state.shotDict[payload];
      const shots = Object.assign({}, state.shots);
      shots.data = shotDetails;
      return { ...state, shots };
    }
    default:
      return state;
  }
}
