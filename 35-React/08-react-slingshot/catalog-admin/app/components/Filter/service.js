import AxiosBuilder from '../../common/axiosBuilder';
import { queryParamsFromDict } from '../../helpers/common';
import {
  BRANDS_MAPPED_TO_SHOTS,
  LOCATION_MAPPED_TO_SHOTS,
} from '../../common/constants';
import { parseChoices } from './helper';
import { storeFilterData } from './action';
import { StringHelper } from '../../helpers/utils';
import {
  getCategoryList,
  getSetUpList,
  getLocationTypeList,
} from '../../helpers/services';
import { getAllowedToStatusList } from '../ShotDetailsView/helper';

export const fetchBrandsMappedToShotsForFilters = (
  activeScreen,
  filterKey,
  dispatch,
) => {
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const queryParams = queryParamsFromDict({
    for_timezone: currentTimezone,
  });
  new AxiosBuilder(
    `${StringHelper.format(
      BRANDS_MAPPED_TO_SHOTS,
      activeScreen,
    )}?${queryParams}`,
  )
    .withAuth()
    .fetch()
    .then(response => {
      const parsedData = {
        [filterKey]: parseChoices(response.data),
      };
      dispatch(storeFilterData(parsedData));
    });
};
export const fetchLocationMappedToShotsForFilters = (
  activeScreen,
  filterKey,
  dispatch,
) => {
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const queryParams = queryParamsFromDict({
    for_timezone: currentTimezone,
  });
  new AxiosBuilder(
    `${StringHelper.format(
      LOCATION_MAPPED_TO_SHOTS,
      activeScreen,
    )}?${queryParams}`,
  )
    .withAuth()
    .fetch()
    .then(response => {
      const parsedData = {
        [filterKey]: parseChoices(response.data),
      };
      dispatch(storeFilterData(parsedData));
    });
};

// Get All Categories
export const getCategoryListForFilters = (filterKey, dispatch) => {
  getCategoryList(choices => {
    const parsedData = {
      [filterKey]: parseChoices(choices),
    };
    dispatch(storeFilterData(parsedData));
  });
};

// Get All Location Types
export const getLocationTypesForFilters = (filterKey, dispatch) => {
  getLocationTypeList(choices => {
    const parsedData = {
      [filterKey]: parseChoices(choices),
    };
    dispatch(storeFilterData(parsedData));
  });
};

// Get All Setups
export const getSetupListForFilters = (filterKey, dispatch) => {
  getSetUpList(choices => {
    const parsedData = {
      [filterKey]: parseChoices(choices),
    };
    dispatch(storeFilterData(parsedData));
  });
};

// Get All Statuses
export const getStatusForFilters = (filterKey, dispatch) => {
  const parsedData = {
    [filterKey]: parseChoices(getAllowedToStatusList()),
  };
  dispatch(storeFilterData(parsedData));
};
