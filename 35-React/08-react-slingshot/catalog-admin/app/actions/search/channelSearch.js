import AxiosBuilder from '../../common/axiosBuilder';
import ttlLocalStorage from '../../common/localStorage';
import { filterResultForSearchedString } from "./helpers";
import { DEFAULT_API_CLEAR_TIME, SEARCH_KEYS } from "./constants";


export class ChannelSearch {
  constructor() {
    this.url = '/channels/';
  }

  search(searchString, excludeFromList, callback) {
    const channelList = ttlLocalStorage.getItem(SEARCH_KEYS.CHANNELS);
    if (!searchString && channelList) {
      filterResultForSearchedString(
        searchString,
        ['name'],
        JSON.parse(channelList),
        excludeFromList,
        callback,
      )
    }
    this.fetch(searchString, excludeFromList, callback);
  }

  fetch = (searchString, excludeFromList, callback) => {
    new AxiosBuilder(this.url)
      .fetch()
      .then(response => this.successCallback(response, searchString, excludeFromList, callback));
  };

  buildParsedData = response => {
    return response.map(channel => ({ id: channel.id, name: channel.name }));
  };

  successCallback = (response, searchString, excludeFromList, callback) => {
    let searchedData = [];
    if (response.data.results.length) {
      const parsedData = this.buildParsedData(response.data.results);
      if (!searchString) {
        ttlLocalStorage.setItem(
          SEARCH_KEYS.CHANNELS,
          JSON.stringify(parsedData),
          DEFAULT_API_CLEAR_TIME,
        );
      }
      searchedData = parsedData;
    }

    filterResultForSearchedString(
      searchString,
      ['name'],
      searchedData,
      excludeFromList,
      callback,
    )
  };
}
