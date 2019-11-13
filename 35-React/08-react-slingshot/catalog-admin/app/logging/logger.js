/* eslint-disable no-console */
import config from '../config/appConfig';
import bugsnagClient from './bugsnag';

const LOGS_API_END_POINT =
  'https://kmjw9jcp1a.execute-api.us-west-1.amazonaws.com/stag/admin/logs/';
const DEFAULT_LOGGER_NAME = 'default';
const LOGGED_IN_USER_EMAIL =
  (localStorage.getItem('user') &&
    JSON.parse(localStorage.getItem('user')).email) ||
  'ANONYMOUS';

export default class Logger {
  constructor(name) {
    this.name = name;
    if (config.LOCAL_ENV) {
      this.logger = new ConsoleLogger();
    } else {
      this.logger = new RemoteLogger();
    }
  }

  static createLogger(name) {
    return new Logger(name || DEFAULT_LOGGER_NAME);
  }

  log = message => {
    const logMessage = formatLogMessage.call(this, 'DEBUG', message);
    this.logger.log(logMessage);
  };

  warn = message => {
    const logMessage = formatLogMessage.call(this, 'WARNING', message);
    this.logger.warn(logMessage);
  };

  error = message => {
    const logMessage = formatLogMessage.call(this, 'ERROR', message);
    this.logger.error(logMessage);
  };
}

class ConsoleLogger {
  log = message => console.log(message);

  warn = message => console.warn(message);

  error = message => console.error(message);
}

class RemoteLogger {
  // Ignore normal logging in case of simple logs
  log = () => {};

  warn = message => pushLog(message);

  error = message => {
    pushLog(message);
    bugsnagClient.notify(message);
  };
}

function pushLog(message) {
  const data = {
    environment: config.ENV,
    log_message: message,
  };

  fetch(LOGS_API_END_POINT, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
}

let formatLogMessage = function(type, message) {
  return `${this.name} : ${type} : {timestamp} : ${LOGGED_IN_USER_EMAIL} : ${message}`;
};
