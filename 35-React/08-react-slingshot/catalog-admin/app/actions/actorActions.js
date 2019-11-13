import {
  ADD_ACTOR,
  DELETE_ACTOR,
  RESET_ACTOR_STORE,
  UPDATE_ACTOR,
  UPDATE_ACTOR_IMAGES,
  UPDATE_ACTOR_STORE,
} from './types';

import AxiosBuilder from '../common/axiosBuilder';
import Logger from "../logging/logger";

const logger = Logger.createLogger('ActorActions');

export function resetActorStore() {
  return {
    type: RESET_ACTOR_STORE,
  };
}

export function updateActorImages(payload) {
  return {
    type: UPDATE_ACTOR_IMAGES,
    payload,
  };
}

export function updateActor(payload) {
  return {
    type: UPDATE_ACTOR,
    payload,
  };
}

export function updateActorStore(meta_info, data) {
  return {
    type: UPDATE_ACTOR_STORE,
    payload: {
      data,
      meta_info,
    },
  };
}

export function deleteActor(id) {
  return {
    type: DELETE_ACTOR,
    payload: {
      id,
    },
  };
}

export const addActor = (actorType, actorName, callback) => dispatch => {
  const config = {
    data: JSON.stringify({
      actor_data: {
        name: actorName,
      },
    }),
  };
  new AxiosBuilder(`/${actorType}/`, config)
    .withAuth()
    .POST()
    .then(response => {
      let actor = response.data;

      callback(actor);

      dispatch({
        type: ADD_ACTOR,
        payload: actor,
      });
    })
    .catch(error => {
      logger.log('Error encountered in API call ' + error);
    });
};
