import AxiosBuilder from '../../common/axiosBuilder';

export function loginAction(payload, successCallback, errorCallback) {
  new AxiosBuilder('/login/', { data: payload })
    .POST()
    .then(response => {
      successCallback(response.data);
    })
    .catch(response => {
      errorCallback(response.response);
    });
}
