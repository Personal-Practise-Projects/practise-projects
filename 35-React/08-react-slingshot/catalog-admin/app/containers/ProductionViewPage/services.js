import AxiosBuilder from '../../common/axiosBuilder';
import {
  dateToServerTimestamp,
  getFirstLetterCapitalizedWithoutUnderscore,
  queryParamsFromDict,
} from '../../helpers/common';
import {
  AVATAR_STAGE,
  LOADER,
  PRODUCTION_SHOTS,
  PRODUCTION_COLLABORATOR_END_POINT,
} from '../../common/constants';
import { StringHelper } from '../../helpers/utils';
import { shotCollaboratorParser } from '../../common/shot/helpers';
import { updateAvatarList } from '../../actions/avatarWrapperActions';
import { parseChoices } from '../../components/Filter/helper';
import { storeFilterData } from '../../components/Filter/action';
import { FETCH_SHOTS } from './types';

const SPRINT_VIEW = 'SPRINT_VIEW';

function forStartDate(timestamp) {
  return dateToServerTimestamp(
    new Date(`${new Date(timestamp * 1000).toDateString()} 00:00:00`).getTime(),
  );
}

export const fetchProductionViewCards = (
  timestamp,
  eventListener,
) => dispatch => {
  const queryParams = queryParamsFromDict({
    for_start_date: forStartDate(timestamp),
    range: 1,
    page_size: 1000,
    for_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const url = StringHelper.format(
    '##?##',
    StringHelper.format(PRODUCTION_SHOTS, SPRINT_VIEW),
    queryParams,
  );
  new AxiosBuilder(url)
    .withAuth()
    .fetch()
    .then(response => {
      dispatch({
        type: FETCH_SHOTS,
        payload: response.data.results,
      });
      if (eventListener) {
        eventListener({ event: LOADER, data: false });
      }
    });
};

export const fetchProductionViewCollaborators = timestamp => dispatch => {
  const queryParams = queryParamsFromDict({
    for_start_date: forStartDate(timestamp),
    range: 1,
    for_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const url = `${PRODUCTION_COLLABORATOR_END_POINT}SPRINT/?${queryParams}`;
  new AxiosBuilder(url)
    .withAuth()
    .fetch()
    .then(response => {
      dispatch(
        updateAvatarList({
          type: AVATAR_STAGE.PRODUCTION_VIEW,
          data: shotCollaboratorParser(response.data),
        }),
      );
    });
};

// Get statuses that are mapped to shots
export const storeStatusesMappedToShotsForFilters = (
  filterKey,
  dispatch,
  uniqueStatusArray,
) => {
  const parsedData = {
    [filterKey]: parseChoices(uniqueStatusArray),
  };
  dispatch(storeFilterData(parsedData));
};

function getStatusArrayFromShots(shotsArray) {
  const statusArray = shotsArray.map(shot => shot.shot_info.status);
  const uniqueStatusArray = [...new Set(statusArray)];
  return parseStatusArray(uniqueStatusArray);
}

// Get Filter Data
export const getFilterData = (
  activeScreen,
  filtersConfig,
  shotsArray,
) => dispatch => {
  if (filtersConfig) {
    filtersConfig.forEach(filterConfig => {
      switch (filterConfig.uid) {
        case '#status':
          storeStatusesMappedToShotsForFilters(
            filterConfig.data_key,
            dispatch,
            getStatusArrayFromShots(shotsArray),
          );
          break;
        default:
          break;
      }
    });
  }
};

export function parseStatusArray(uniqueStatusArray) {
  return uniqueStatusArray.map((statusName, index) => ({
    id: index,
    name: getFirstLetterCapitalizedWithoutUnderscore(statusName),
    value: statusName,
  }));
}
