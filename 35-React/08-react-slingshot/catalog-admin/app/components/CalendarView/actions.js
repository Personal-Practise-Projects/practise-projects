import AxiosBuilder from '../../common/axiosBuilder';
import { createDateMapToShots } from './helpers';
import { queryParamsFromDict } from '../../helpers/common';
import { StringHelper } from '../../helpers/utils';
import { PRODUCTION_SHOTS, SORT_PAGE_TYPES } from '../../common/constants';

export const FETCH_CALENDAR = 'calendar:fetchCalendar';
export const FETCH_CALENDAR_FAILED = 'calendar:fetchCalendar';
export const UPDATE_CALENDAR = 'calendar:updateCalendar';
export const CALENDAR_DATE_CHANGED = 'calendar:calendarDateChanged';
export const REARRANGE_CALENDAR_SHOTS = 'calendar:rearrangeCalendarShots';
export const RESET_CALENDAR_SHOTS = 'calendar:resetShots';
export const UPDATE_TIMESTAMP_SELECTED_VIEW =
  'calendar:updateTimeStampSelectedView';

export const fetchProductionCalenderCards = (
  forStartDate,
  range,
  searchParams,
  queryParams = {},
  callback,
) => dispatch => {
  queryParams = queryParamsFromDict({
    for_start_date: forStartDate,
    for_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    page_size: 1000,
    range,
    ...searchParams,
    ...queryParams,
  });
  const url = StringHelper.format(
    '##?##',
    StringHelper.format(PRODUCTION_SHOTS, SORT_PAGE_TYPES.CALENDAR),
    queryParams,
  );
  new AxiosBuilder(url)
    .withAuth()
    .fetch()
    .then(response => {
      dispatch({
        type: FETCH_CALENDAR,
        payload: createDateMapToShots(response.data.results),
      });
      callback();
    })
    .catch(err => {
      dispatch({
        type: FETCH_CALENDAR_FAILED,
        payload: err,
      });
      callback();
    });
};

export function calendarDateChanged(timestamp) {
  return {
    type: CALENDAR_DATE_CHANGED,
    payload: timestamp,
  };
}

export function updateCalendar(payload) {
  return {
    type: UPDATE_CALENDAR,
    payload,
  };
}

export function rearrangeCalendarShots(payload) {
  return {
    type: REARRANGE_CALENDAR_SHOTS,
    payload,
  };
}

export function resetCalendarShots() {
  return {
    type: RESET_CALENDAR_SHOTS,
  };
}

export function updateTimeStampAndSelectedView(payload) {
  return {
    type: UPDATE_TIMESTAMP_SELECTED_VIEW,
    payload,
  };
}

export const updateShotCard = (shotId, payload) => dispatch => {
  new AxiosBuilder(`/shot/${shotId}/`, { data: payload })
    .withAuth()
    .PATCH()
    .then(response =>
      dispatch({
        type: UPDATE_CALENDAR,
        payload: response.data,
      }),
    );
};
