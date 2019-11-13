import AxiosBuilder from "../common/axiosBuilder";
import Logger from "../logging/logger";
import ttlLocalStorage from "../common/localStorage";
import { DEFAULT_API_CLEAR_TIME } from "../actions/search/constants";

const logger = Logger.createLogger('BaseStorageApiHelper');

/**
 * BaseStorageApiHelper will manage life cycle of search and user can provide basic required config in constructor
 * it will also provide support for cancel the on going result.
 * This helper will be useful for the only api non paginated api as it will look for the only data key in response
 */
export default class BaseStorageApiHelper {
  /**
   *
   * @param apiUrl Api base url
   * @param responseParser Response parser or else it will return response.data
   * @param storageKey Localstorage key for result caching
   * @param cancelOnNew true if existing request need to cancel on new request default behaviour is true
   * @param globalData true if no need to store tenant specific
   * @param apiClearTime
   * for latest search result
   */
  constructor(apiUrl, responseParser, storageKey, cancelOnNew = true, globalData = true,
              apiClearTime = DEFAULT_API_CLEAR_TIME) {
    this.url = apiUrl;
    this.apiClearTime = apiClearTime;
    this.responseParser = responseParser || __defaultResponseParser;
    this.storageKey = storageKey;
    this.cancelOnNew = cancelOnNew;
    this.globalData = globalData;
    this.requestMap = {};
  }

  /**
   * @param callback callback listener
   */
  fetch(callback) {
    //Cancel on going existing request if new search is fired
    this.cancelOnNew && this.cancelExistingRequests();

    let dataList = null;
    //If search string is none and data is saved in storage get it from there
    if (this.storageKey) {
      dataList = ttlLocalStorage.getItem(this.storageKey, this.globalData);
    }

    //If data is available then pass the data from here
    if (dataList) {
      callback(JSON.parse(dataList));
      return;
    }
    this.__fetchFromNetwork(callback);
  }

  /**
   * If data is not available in storage then request api to get the data and pass the data in callback
   * listener with apply filters
   * @param callback callback listener
   * @private
   */
  __fetchFromNetwork(callback) {
    new AxiosBuilder(this.url)
      .withAuth()
      .withCancelToken(this.requestMap)
      .fetch()
      .then(response => {
        //Save the data into local storage if storage key is available and data without any search
        // parameter for caching purpose
        const parsedData = JSON.stringify(this.responseParser(response));
        if (this.storageKey) {
          ttlLocalStorage.setItem(
            this.storageKey,
            parsedData,
            this.apiClearTime,
            this.globalData
          );
        }

        //If data is available then pass the data from here
        callback(JSON.parse(parsedData));
      })
      .catch(error => {
        logger.error('In search api with url' + this.url + ' failed with error:- ' + error);
        callback && callback([]);
      });
  }

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
}


function __defaultResponseParser(response) {
  return response.data;
}
