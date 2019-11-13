import React from 'react';
import axios from 'axios';
import config from '../config/appConfig';

const BASE_URL = `${config.API_ROOT_URL}api/v1`;

const DEFAULT_TIMEOUT = 0;
const DEFAULT_RESPONSE_TYPE = 'json';
const DEFAULT_XSRF_COOKIE_NAME = '';
const DEFAULT_XSRF_HEADER_NAME = '';
const DEFAULT_MAX_CONTENT_LENGTH = 2000;
const DEFAULT_MEX_REDIRECTS = 0;

axios.defaults.baseURL = BASE_URL;
axios.defaults.responseType = DEFAULT_RESPONSE_TYPE;
axios.defaults.timeout = DEFAULT_TIMEOUT;
axios.defaults.maxContentLength = DEFAULT_MAX_CONTENT_LENGTH;
axios.defaults.maxRedirects = DEFAULT_MEX_REDIRECTS;
axios.defaults.xsrfCookieName = DEFAULT_XSRF_COOKIE_NAME;
axios.defaults.xsrfHeaderName = DEFAULT_XSRF_HEADER_NAME;

export function redirectToLoginPage() {
  window.location.href = `${config.API_ROOT_URL}admin`;
}
