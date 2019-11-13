import AxiosBuilder from '../../common/axiosBuilder';

export function fetchLocations(successCallback) {
  new AxiosBuilder('/locations?page_size=500', {})
    .withAuth()
    .fetch()
    .then(response => successCallback(response.data));
}
