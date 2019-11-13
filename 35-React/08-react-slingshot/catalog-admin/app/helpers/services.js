import AxiosBuilder from '../common/axiosBuilder';

import { CHOICE_END_POINT, COLOR_END_POINT } from '../common/constants';
import {
  DEFAULT_API_CLEAR_TIME,
  MAX_API_CLEAR_TIME,
  SEARCH_KEYS,
} from '../actions/search/constants';
import ttlLocalStorage from '../common/localStorage';
import { parseCategory } from './shotHelpers';
import BaseStorageApiHelper from './storageApi';

export function getCategoryList(successCallback) {
  const parseCategories = response =>
    response.data.map(category => parseCategory(category));
  new BaseStorageApiHelper(
    'content-category/image/',
    parseCategories,
    SEARCH_KEYS.CATEGORY,
    true,
    true,
    MAX_API_CLEAR_TIME,
  ).fetch(successCallback);
}

export function getLocationTypeList(successCallback) {
  const parseLocationTypes = response => response.data;
  new BaseStorageApiHelper(
    'location-types/',
    parseLocationTypes,
    SEARCH_KEYS.LOCATION_TYPE,
    true,
    true,
    MAX_API_CLEAR_TIME,
  ).fetch(successCallback);
}

export function getSetUpList(successCallback) {
  const setupParser = response =>
    response.data.map(setup => ({
      id: setup.id,
      title: setup.name,
    }));
  new BaseStorageApiHelper(
    'shot/setup/',
    setupParser,
    SEARCH_KEYS.SET_UP,
    true,
    true,
    MAX_API_CLEAR_TIME,
  ).fetch(successCallback);
}

export function getColorList(colorType, successCallback) {
  const data = ttlLocalStorage.getItem(SEARCH_KEYS.SHOT_COLOR_LABEL);
  if (data) {
    const parsedData = JSON.parse(data);
    successCallback(parsedData);
  } else {
    new AxiosBuilder(`${COLOR_END_POINT}?color_type=${colorType}`)
      .withAuth()
      .fetch()
      .then(response => {
        const parsedData = response.data.results.map(color => ({
          id: color.id,
          name: color.color_code,
        }));
        if (!parsedData) {
          ttlLocalStorage.setItem(
            SEARCH_KEYS.SHOT_COLOR_LABEL,
            JSON.stringify(parsedData),
            DEFAULT_API_CLEAR_TIME,
          );
        }
        successCallback(parsedData);
      });
  }
}

export function getChoices(choice, successCallback) {
  const data = ttlLocalStorage.getItem(choice);
  if (data) {
    const parsedData = JSON.parse(data);
    successCallback(parsedData);
  } else {
    new AxiosBuilder(`${CHOICE_END_POINT}?choice=${choice}`)
      .withAuth()
      .fetch()
      .then(response => {
        ttlLocalStorage.setItem(choice, JSON.stringify(response.data));
        successCallback(response.data);
      });
  }
}
