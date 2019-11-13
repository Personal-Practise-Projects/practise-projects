import { LOCATIONS_API_ENDPOINT } from '../../common/constants';
import { FETCH_LOCATIONS, FETCH_LOCATIONS_FAILED } from '../../actions/types';
import { PaginationHandler } from '../../common/PaginationHandler';

export default class LocationPaginationHandler extends PaginationHandler {
  constructor(actionDispatcher, searchString = '') {
    super(LOCATIONS_API_ENDPOINT, { page_size: 10, search: searchString });
    this.actionDispatcher = actionDispatcher;
  }

  successCallback = response => {
    this.actionDispatcher(FETCH_LOCATIONS, response);
  };

  errorCallback = errorResponse => {
    this.actionDispatcher(FETCH_LOCATIONS_FAILED, errorResponse);
  };
}
