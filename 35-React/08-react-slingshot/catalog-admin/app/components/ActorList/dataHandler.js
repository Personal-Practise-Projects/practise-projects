import AxiosBuilder from '../../common/axiosBuilder';

const requestMap = {};

export class FetchActor {
  constructor(successCallback, errorCallback, talent = 'models', searchString = '') {
    this.talent = talent;
    this.url = `/${this.talent}/?page_size=50${
      searchString ? `&search=${encodeURIComponent(searchString)}` : ''
    }`;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
  }

  __successCallback = response => {
    const metaInfo = response.data.meta_info;
    const data = response.data.data.results;
    this.url = response.data.data.next;
    this.successCallback(metaInfo, data);
  };

  cancelPreviousRequests = () =>
    Object.keys(requestMap).map(key => {
      requestMap[key]();
      delete requestMap[key];
    });

  fetch = () => {
    if (this.url) {
      this.cancelPreviousRequests();
      new AxiosBuilder(this.url)
        .withAuth()
        .withCancelToken(requestMap)
        .fetch()
        .then(response => this.__successCallback(response))
        .catch(errorResponse => this.errorCallback(errorResponse));
      return true;
    }
    return false;
  };
}
