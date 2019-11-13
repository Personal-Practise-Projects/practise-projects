import { PaginationHandler } from '../../common/PaginationHandler';
import { LIST_CREATE_BRAND } from '../../common/constants';
import { FETCH_BRAND, FETCH_BRAND_FAILED } from '../../actions/types';

export default class BrandPaginationHandler extends PaginationHandler {
  constructor(
    actionDispatcher,
    onBrandFetch,
    searchString = '',
    brand = undefined,
  ) {
    super(LIST_CREATE_BRAND, {
      page_size: 30,
      search: searchString,
      brand_id: brand,
    });
    this.actionDispatcher = actionDispatcher;
    this.onBrandFetch = onBrandFetch;
  }

  successCallback = response => {
    this.actionDispatcher(FETCH_BRAND, response);
    this.onBrandFetch(response);
  };

  errorCallback = errorResponse => {
    this.actionDispatcher(FETCH_BRAND_FAILED, errorResponse);
  };
}
