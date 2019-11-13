import AxiosBuilder from '../../common/axiosBuilder';
import Logger from '../../logging/logger';
import ttlLocalStorage from '../../common/localStorage';
import { queryParamsFromDict } from '../../helpers/common';
import { StringHelper } from '../../helpers/utils';
import { filterResultForSearchedString } from './helpers';
import { DEFAULT_API_CLEAR_TIME } from './constants';
import { DONE, FAILED } from '../../common/constants';

export const QUERY_URL_FORMAT = '##?##';
const logger = Logger.createLogger('SearchHelper');

/**
 * Base search helper will manage life cycle of search and user can provide basic required config in constructor
 * it will also provide support for cancel the on going result.
 * This helper will be useful for the only api non paginated api as it will look for the only data key in response
 */
export default class BaseSearchHelper {
  /**
   *
   * @param baseUrl Api base url
   * @param queryParams Query param if any default required in every request
   * @param responseParser Response parser or else it will return response.data
   * @param searchableFields Fields on which search projection need to made
   * @param storageKey Localstorage key for result caching
   * @param cancelOnNew true if existing request need to cancel on new request default behaviour is true
   * @param searchLocal true if need to search from local storage else every time it will hit server api
   * @param globalData true if no need to store tenant specific
   * @param onEmptyResponse function to provide some value if no result is available
   * for latest search result
   */
  constructor(
    baseUrl,
    responseParser,
    searchableFields,
    storageKey,
    queryParams,
    cancelOnNew = true,
    searchLocal = false,
    globalData = true,
    onEmptyResponse = null,
  ) {
    this.url = baseUrl;
    this.searchLocal = searchLocal;
    this.responseParser = responseParser || __defaultResponseParser;
    this.searchableFields = searchableFields || [];
    this.storageKey = storageKey;
    this.queryParams = queryParams || {};
    this.cancelOnNew = cancelOnNew;
    this.globalData = globalData;
    this.onEmptyResponse = onEmptyResponse;
    this.requestMap = {};
  }

  /**
   * Provide search string to lookup into data the result will be filter on the provided search string and for
   * making projection on searchableFields
   * @param searchString search string
   * @param excludeFromList exclude data by id
   * @param callback callback listener
   */
  search(searchString, excludeFromList, callback) {
    // Cancel on going existing request if new search is fired
    this.cancelOnNew && this.cancelExistingRequests();

    let dataList = null;
    // If search string is none and data is saved in storage get it from there
    if (this.storageKey && (!this.searchLocal && !searchString)) {
      dataList = ttlLocalStorage.getItem(this.storageKey, this.globalData);
    }

    // If data is available then pass the data from here
    if (dataList) {
      filterResultForSearchedString(
        searchString,
        this.searchableFields,
        JSON.parse(dataList),
        excludeFromList,
        callback,
      );
      return;
    }
    this.__searchOnNetwork(searchString, excludeFromList, callback);
  }

  /**
   * If required to create the same object on the fly then call this function with data
   * @param data initial data required to create the object
   * @param callback callback listener
   */
  create = (data, callback) => {
    const resolvedUrl = StringHelper.format(
      QUERY_URL_FORMAT,
      this.url,
      queryParamsFromDict(this.queryParams),
    );

    const config = { data: JSON.stringify(data) };

    new AxiosBuilder(resolvedUrl, config)
      .withAuth()
      .POST()
      .then(response => {
        const parsedData = this.responseParser(response);
        callback(DONE, parsedData[0]);
      })
      .catch(error => {
        logger.error(
          `Create api with url${resolvedUrl} failed with error:- ${error}`,
        );
        callback(FAILED, error.response);
      });
  };

  /**
   * Cancel all existing ongoing api request in request map
   * they are stored with key as url and cancel token as value
   */
  cancelExistingRequests = () => {
    Object.keys(this.requestMap).map(key => {
      logger.log(`cancel request with key ${key}`);
      // Request map is keeping cancel token function as value just call the function to cancel the request
      this.requestMap[key]();
      delete this.requestMap[key];
    });
  };

  /**
   * If data is not available in storage then request api to get the data and pass the data in callback
   * listener with apply filters
   * @param searchString search string
   * @param excludeFromList exclude data by id if any or
   * @param callback callback listener
   * @private
   */
  __searchOnNetwork(searchString, excludeFromList, callback) {
    const resolvedUrl = StringHelper.format(
      QUERY_URL_FORMAT,
      this.url,
      queryParamsFromDict({ ...this.queryParams, search: searchString }),
    );
    new AxiosBuilder(resolvedUrl)
      .withAuth()
      .withCancelToken(this.requestMap)
      .fetch()
      .then(response => {
        // Save the data into local storage if storage key is available and data without any search
        // parameter for caching purpose
        const parsedData = this.responseParser(response);
        if (!searchString && this.storageKey) {
          ttlLocalStorage.setItem(
            this.storageKey,
            JSON.stringify(parsedData),
            DEFAULT_API_CLEAR_TIME,
            this.globalData,
          );
        }

        // If data is available then pass the data from here
        if (parsedData.length === 0 && searchString && this.onEmptyResponse) {
          this.onEmptyResponse(searchString, callback);
        } else {
          filterResultForSearchedString(
            searchString,
            this.searchableFields,
            parsedData,
            excludeFromList,
            callback,
          );
        }
      })
      .catch(error => {
        logger.error(
          `In search api with url${resolvedUrl} failed with error:- ${error}`,
        );
        callback && callback(searchString, []);
      });
  }
}

function __defaultResponseParser(response) {
  return response.data;
}
