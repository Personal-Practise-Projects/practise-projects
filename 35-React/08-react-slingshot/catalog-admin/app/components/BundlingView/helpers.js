import { PaginationHandler } from '../../common/PaginationHandler';
import { PRODUCTION_SHOTS, SORT_PAGE_TYPES } from '../../common/constants';
import { SCHEDULE_PAGE_TYPE } from '../../containers/SchedulePage/constants';
import { FETCH_BUNDLING, FETCH_BUNDLING_FAILED } from '../../actions/types';
import { StringHelper } from '../../helpers/utils';

export default class BundlingPaginationHandler extends PaginationHandler {
  constructor(actionDispatcher, searchValue = null, queryParams = {}) {
    const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    super(StringHelper.format(PRODUCTION_SHOTS, SORT_PAGE_TYPES.BUNDLING), {
      for_timezone: currentTimezone,
      page_size: 30,
      search: searchValue,
      ...queryParams,
    });
    this.actionDispatcher = actionDispatcher;
  }

  successCallback = response => {
    this.actionDispatcher(FETCH_BUNDLING, response);
    // Fetch next result on success of current one
    if (this.resolvedUrl) {
      this.fetch();
    }
  };

  errorCallback = errorResponse => {
    this.actionDispatcher(FETCH_BUNDLING_FAILED, errorResponse);
  };
}

export function isDestinationCalendar(droppedShotDetail) {
  return (
    droppedShotDetail.source === SCHEDULE_PAGE_TYPE.BUNDLING &&
    droppedShotDetail.destination === SCHEDULE_PAGE_TYPE.CALENDAR
  );
}
