import AxiosBuilder from '../common/axiosBuilder';
import {
  FCM_TOKEN_KEY,
  REGISTER_NOTIFICATION_TOKEN,
  SHOT_LIST_CONFIG_ENDPOINT,
  USER_CONFIG,
} from '../common/constants';
import {
  FETCH_SHOTS_META_INFO,
  FETCH_SHOTS_META_INFO_FAILED,
  REFRESH_DETAILS,
  UPDATE_SHOT_PAYLOAD,
  SHOW_LOADER,
  HIDE_LOADER,
} from './types';
import Logger from '../logging/logger';
import { persistUserConfig } from '../helpers/user';

const logger = Logger.createLogger();
export const fetchShotsMetaInfo = () => dispatch => {
  new AxiosBuilder(SHOT_LIST_CONFIG_ENDPOINT)
    .withAuth()
    .fetch()
    .then(metaInfoRes => {
      dispatch({
        type: FETCH_SHOTS_META_INFO,
        payload: metaInfoRes.data,
      });
    })
    .catch(error => {
      dispatch({
        type: FETCH_SHOTS_META_INFO_FAILED,
        payload: error,
      });
    });
};

export const loadBasicConfig = () => {
  new AxiosBuilder(USER_CONFIG)
    .withAuth()
    .fetch()
    .then(response => {
      const responseData = response.data;
      persistUserConfig(responseData);
    })
    .catch(error => {
      logger.error(error);
    });
};

export function registerPushToken(token) {
  const config = {
    data: JSON.stringify({ token }),
  };
  new AxiosBuilder(REGISTER_NOTIFICATION_TOKEN, config)
    .withAuth()
    .POST()
    .then(res => {
      localStorage.setItem(FCM_TOKEN_KEY, true);
      logger.log(`PUSH token register ${token}`);
    })
    .catch(error => {
      logger.error(`PUSH token register failed ${token} with error ${error}`);
    });
}

export function updateShotByPayload(payload) {
  return {
    type: UPDATE_SHOT_PAYLOAD,
    payload,
  };
}

export const refreshDetails = type => ({
  type: REFRESH_DETAILS,
  payload: {
    type,
  },
});

export const showLoader = () => ({
  type: SHOW_LOADER,
});

export const hideLoader = () => ({
  type: HIDE_LOADER,
});
