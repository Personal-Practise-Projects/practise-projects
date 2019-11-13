import axios from 'axios';
import config from '../config/appConfig';
import { redirectToLogin } from './helpers';
import { getCurrentSelectedTenant, getDefaultTenant } from '../helpers/user';

const BASE_URL = `${config.API_ROOT_URL}api/v1`;
const DEFAULT_HEADERS = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
};
const DEFAULT_HTTP_METHOD = 'GET';
const DEFAULT_TIMEOUT = 0;
const DEFAULT_RESPONSE_TYPE = 'json';
const DEFAULT_RESPONSE_ENCODING = 'utf8';
const DEFAULT_XSRF_COOKIE_NAME = '';
const DEFAULT_XSRF_HEADER_NAME = '';
const DEFAULT_MAX_CONTENT_LENGTH = 2000;
const DEFAULT_PARAMS = {};
const DEFAULT_MEX_REDIRECTS = 0;

class AxiosBuilder {
  /**
   * Create a options for XMLHttpRequest request.
   * @param {string} path - The server URL that will be used for the request
   * @param {Object.<string, string|number|Function|Object<string, string>>} options - Request arguments.
   *
   * {Function} transformRequest:
   *   Allows changes to the request data before it is sent to the server.
   * {Function} transformResponse: Allows changes to the response data to be made before.
   * {Object.<string, string>} headers: The custom headers to be sent.
   * {Object.<string, string>} data: The data to be sent as the request body.
   * {Number} timeout: Specifies the number of milliseconds before the request times out.
   * {string} responseType: Indicates the type of data that the server will respond with.
   * {string} responseEncoding: Indicates encoding to use for decoding responses.
   * {string} xsrfCookieName: The name of the cookie to use as a value for xsrf token.
   * {string} xsrfHeaderName: The name of the http header that carries the xsrf token value.
   * {Function} onUploadProgress: Allows handling of progress events for uploads.
   * {Function} onDownloadProgress: Allows handling of progress events for downloads.
   * {Number} maxContentLength: The max size of the http response content in bytes allowed.
   * {Number} maxRedirects: The maximum number of redirects to follow.
   */
  constructor(path, options = {}) {
    this.url = path;
    this.options = {
      url: this.url,
      baseURL: BASE_URL,
      method: DEFAULT_HTTP_METHOD,
      params: DEFAULT_PARAMS,
      timeout: options.timeout || DEFAULT_TIMEOUT,
      responseType: options.responseType || DEFAULT_RESPONSE_TYPE,
      responseEncoding: options.responseEncoding || DEFAULT_RESPONSE_ENCODING,
      xsrfCookieName: options.xsrfCookieName || DEFAULT_XSRF_COOKIE_NAME,
      xsrfHeaderName: options.xsrfHeaderName || DEFAULT_XSRF_HEADER_NAME,
      maxContentLength: options.maxContentLength || DEFAULT_MAX_CONTENT_LENGTH,
      maxRedirects: DEFAULT_MEX_REDIRECTS,
      headers: options.headers || DEFAULT_HEADERS,
      data: options.data || {},
      transformRequest: [
        (data, headers) =>
          options.transformRequest
            ? options.transformRequest(data, headers)
            : data,
      ],
      transformResponse: [
        data =>
          options.transformResponse ? options.transformResponse(data) : data,
      ],
      validateStatus(status) {
        return status >= 200 && status < 300;
      },
      onUploadProgress(progressEvent) {
        if (options.onUploadProgress) options.onUploadProgress(progressEvent);
      },
      onDownloadProgress(progressEvent) {
        if (options.onDownloadProgress)
          options.onDownloadProgress(progressEvent);
      },
    };
  }

  withParams = params => {
    this.options.params = params;
    return this;
  };

  withAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      this.options.headers.Authorization = `Token ${token}`;
      this.options.headers[
        'tenant-requested-with'
      ] = getCurrentSelectedTenant();
    }
    return this;
  };

  withDefaultAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      this.options.headers.Authorization = `Token ${token}`;
      this.options.headers['tenant-requested-with'] = getDefaultTenant();
    }
    return this;
  };

  // TODO need to provide in promise instead of updating a map not every provider is having map
  withCancelToken = requestMap => {
    this.options.cancelToken = new axios.CancelToken(cancel => {
      Object.assign(requestMap, {
        [this.url]: cancel,
      });
    });
    return this;
  };

  PUT = () => {
    this.options.method = 'PUT';
    return axios(this.options);
  };

  POST = () => {
    this.options.method = 'POST';
    return axios(this.options);
  };

  DELETE = () => {
    this.options.method = 'DELETE';
    return axios(this.options);
  };

  PATCH = () => {
    this.options.method = 'PATCH';
    return axios(this.options);
  };

  fetch() {
    return axios(this.options);
  }
}

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      redirectToLogin();
      return Promise.resolve();
    }
    return Promise.reject(error);
  },
);
export default AxiosBuilder;
