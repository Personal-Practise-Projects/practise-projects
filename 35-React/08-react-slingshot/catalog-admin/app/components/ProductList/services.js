import AxiosBuilder from '../../common/axiosBuilder';

import { PaginationHandler } from "../../common/PaginationHandler";
import { PRODUCT_LIST_API_ENDPOINT, PRODUCT_LIST_CONFIG_ENDPOINT, } from '../../common/constants';


export const productListHandler = (successCallback, errorCallback, searchString = '', contentRequestId = null) => {
  return new PaginationHandler(PRODUCT_LIST_API_ENDPOINT, {
    page_size: 30, search: searchString, crd: contentRequestId
  }, successCallback, errorCallback);
};

export const fetchProductMetaInfo = successCallback => {
  new AxiosBuilder(PRODUCT_LIST_CONFIG_ENDPOINT)
    .withAuth()
    .fetch()
    .then(response => successCallback(response.data));
};
