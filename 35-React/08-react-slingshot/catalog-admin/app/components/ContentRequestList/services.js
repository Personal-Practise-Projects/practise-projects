import AxiosBuilder from '../../common/axiosBuilder';
import {
  CONTENT_REQUEST_ACCOUNT_MANAGER_LIST,
  CONTENT_REQUEST_LIST_API_ENDPOINT,
  CONTENT_REQUEST_LIST_CONFIG_ENDPOINT,
} from '../../common/constants';
import { PaginationHandler } from '../../common/PaginationHandler';

export const contentRequestListHandler = (
  successCallback,
  errorCallback,
  searchString = '',
  filterObject,
  selectedBrandId = null,
) =>
  new PaginationHandler(
    CONTENT_REQUEST_LIST_API_ENDPOINT,
    {
      page_size: 30,
      search: searchString,
      brand: selectedBrandId,
      ...filterObject,
    },
    successCallback,
    errorCallback,
  );

export const fetchContentRequestsConfig = successCallback => {
  new AxiosBuilder(CONTENT_REQUEST_LIST_CONFIG_ENDPOINT)
    .withAuth()
    .fetch()
    .then(response => successCallback(response.data));
};

export const fetchAccountManagers = callback => {
  new AxiosBuilder(CONTENT_REQUEST_ACCOUNT_MANAGER_LIST)
    .withAuth()
    .fetch()
    .then(response => {
      callback(response.data);
    });
};
