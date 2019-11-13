import {
  ADD_ACTOR,
  DELETE_ACTOR,
  RESET_ACTOR_STORE,
  UPDATE_ACTOR,
  UPDATE_ACTOR_STORE,
} from '../actions/types';

export const ACTOR_DEFAULT_STATE = {
  meta_info: {
    headers: [],
    detail_headers: [],
  },
  data: [],
  actorDict: {},
};

export function actorReducer(state = ACTOR_DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case ADD_ACTOR:
      state.data.unshift(payload);
      state.actorDict = Object.assign({}, state.actorDict);
      state.actorDict[payload.id] = payload;
      return {
        ...state,
        data: [...state.data],
      };
    case DELETE_ACTOR:
      // TODO Need to implement we are going to have delete functionality for actors.
      const newActors = state.actors.data.filter(
        actor => actor.id !== payload.id,
      );
      return {
        data: newActors,
      };

    case UPDATE_ACTOR:
      state.data = [...state.data];
      return {
        ...state,
      };
    case UPDATE_ACTOR_STORE:
      const { meta_info, data } = payload;
      const actorDict = { ...state.actorDict };
      data.map(actor => {
        actorDict[actor.id] = actor;
      });
      return { meta_info, data: state.data.concat(data), actorDict };
    case RESET_ACTOR_STORE:
      return ACTOR_DEFAULT_STATE;
    default:
      return state;
  }
}
