import AxiosBuilder from './axiosBuilder';

import { queryParamsFromDict } from '../helpers/common';
import Logger from '../logging/logger';
import { STATUS_DONE, STATUS_FAILED } from '../actions/types';

const logger = Logger.createLogger('Pagination handler');
/** *
 * Pagination handler class will manage state of ongoing pagination for api it will resolved the url from received
 * query param and base url and save it in resolved url.
 * When an api return the next url the resolved url will be change with next url so if view component request for
 * next data it can be fetched using same
 */
export class PaginationHandler {
  /**
   * Construct reference of pagination handler
   * @param baseUrl Provide base url for API
   * @param queryParams provide query params for the get api like search string or any extra query params in dict form
   * if any query param value is null it won't be pass in url
   * @param successCallback Provide success callback function here
   * @param errorCallback Provide error callback function here
   */
  constructor(
    baseUrl,
    queryParams,
    successCallback = undefined,
    errorCallback = undefined,
    defaultDataParser = defaultDataProvider,
  ) {
    this.requestMap = {};
    this.queryParams = queryParams;
    this.defaultDataParser = defaultDataParser;
    this.url = baseUrl;
    this.resolvedUrl = `${this.url}?${queryParamsFromDict(this.queryParams)}`;
    if (successCallback) this.successCallback = successCallback;
    if (errorCallback) this.errorCallback = errorCallback;
    this.fetch = this.fetch.bind(this);
  }

  /**
   *
   * Fetch function can be frequently call for the first time or on scroll so it will fetch the result from server
   */
  // The fetch method needs to be in old style function instead of arrow function
  // to be attached to the prototype, so that components extending it can call
  // super.fetch().
  fetch(callback) {
    if (this.resolvedUrl) {
      this.cancelExistingRequests();
      new AxiosBuilder(this.resolvedUrl)
        .withAuth()
        .withCancelToken(this.requestMap)
        .fetch()
        .then(response => {
          this.responseListener(STATUS_DONE, response);
          // Pass callback on successful to the called
          if (callback) callback();
        })
        .catch(errorResponse => {
          this.responseListener(STATUS_FAILED, errorResponse);
          // Pass callback on successful to the called
          if (callback) callback();
        });
      return true;
    }
    return false;
  }

  /**
   *
   * @param status On success get the next url from response
   * @param response api response should contains data with following format:-
   * {
   *    count:{total count}
   *    previous:{url},
   *    next:{url},
   *    result:{data}
   * }
   * On failure pass the error response to register callback listener
   */
  responseListener = (status, response) => {
    if (status === STATUS_DONE) {
      delete this.requestMap[this.resolvedUrl];
      this.resolvedUrl = response.data.next;
      if (this.successCallback) {
        this.successCallback(this.defaultDataParser(response));
      }
    } else if (this.errorCallback) {
      this.errorCallback(response);
    }
  };

  /**
   * Cancel all existing ongoing api request in request map
   * they are stored with key as url and cancel token as value
   */
  cancelExistingRequests = () => {
    Object.keys(this.requestMap).forEach(key => {
      logger.log(`cancel request with key ${key}`);
      // Request map is keeping cancel token function as value just call the function to cancel the request
      this.requestMap[key]();
      delete this.requestMap[key];
    });
  };
}

function defaultDataProvider(response) {
  return response.data.results;
}
