import { PRODUCTION_SHOTS } from '../../common/constants';
import { PaginationHandler } from '../../common/PaginationHandler';
import {
  APPEND_TO_SWIMLANE,
  FETCH_SWIMLANE,
  FETCH_SWIMLANE_FAILED,
} from '../../actions/types';
import UrlBuilder from '../../common/urlBuilder';
import { StringHelper } from '../../helpers/utils';

export default class ShotSwimlaneDataHandler extends PaginationHandler {
  constructor(
    actionDispatcher,
    swimlaneType,
    { paginate = true, shotsPerPage = 30 } = {},
  ) {
    const baseParams = {
      for_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    if (paginate) {
      baseParams.page_size = shotsPerPage;
    }
    const baseUrl = StringHelper.format(PRODUCTION_SHOTS, swimlaneType);
    super(baseUrl, baseParams);
    this.baseParams = baseParams;
    this.swimlaneType = swimlaneType;
    this.paginate = paginate || false;
    this.actionDispatcher = actionDispatcher;
    this.dispatch_type = FETCH_SWIMLANE;
  }

  fetch(filterParams = {}, callback = undefined) {
    const queryParams = { ...filterParams, ...this.baseParams };
    const urlBuilder = new UrlBuilder(this.url)
      .addPathParam('PRODUCTION_SHOTS', PRODUCTION_SHOTS)
      .addPathParam('type', this.type);
    if (queryParams) {
      urlBuilder.addQueryParams(queryParams);
    }
    this.resolvedUrl = urlBuilder.buildUrl();
    this.dispatch_type = FETCH_SWIMLANE;
    super.fetch(callback);
  }

  successCallback(response) {
    this.actionDispatcher(this.dispatch_type, {
      swimlaneType: this.swimlaneType,
      data: response,
    });
    // Fetch next result on success of current one
    if (this.paginate && this.resolvedUrl) {
      this.dispatch_type = APPEND_TO_SWIMLANE;
      super.fetch();
    }
  }

  errorCallback = errorResponse => {
    this.actionDispatcher(FETCH_SWIMLANE_FAILED, {
      swimlaneType: this.swimlaneType,
      data: errorResponse,
    });
  };
}
