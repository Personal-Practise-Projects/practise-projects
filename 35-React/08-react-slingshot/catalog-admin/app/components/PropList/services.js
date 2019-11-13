import AxiosBuilder from '../../common/axiosBuilder';

import { PaginationHandler } from "../../common/PaginationHandler";
import { PROP_LIST_CONFIG_ENDPOINT, PROP_LIST_END_POINT, } from '../../common/constants';


export const propListHandler = (successCallback, errorCallback, searchString = '', contentRequestId = null) => {
  return new PaginationHandler(PROP_LIST_END_POINT, {
    page_size: 30, search: searchString, crd: contentRequestId
  }, successCallback, errorCallback);
};

export const fetchPropsConfig = successCallback => {
  new AxiosBuilder(PROP_LIST_CONFIG_ENDPOINT)
    .withAuth()
    .fetch()
    .then(response => successCallback(response.data));
};
