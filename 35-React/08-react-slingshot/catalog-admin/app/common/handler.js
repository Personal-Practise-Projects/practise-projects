import AxiosBuilder from './axiosBuilder';
import { USER_LOGOUT, USER_RESET_PASSWORD } from './constants';
import { redirectToLogin } from './helpers';

export function logout() {
  new AxiosBuilder(USER_LOGOUT).POST().then(response => {
    redirectToLogin();
  });
}

export function resetPassword(config, successCallback, errorCallback) {
  new AxiosBuilder(USER_RESET_PASSWORD, config)
    .PATCH()
    .then(response => {
      successCallback(response.data.success_message);
    })
    .catch(error => {
      errorCallback(error.response.data.password[0]);
    });
}
