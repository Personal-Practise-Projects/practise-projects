// This file instantiates one Bugsnag client for the entire application
//
// Components and modules that want to send handled errors can import the
// exported client to send handled errors
//
// Components can also optionally import the React <ErrorBoundary/>.
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';
import React from 'react';

import config from '../config/appConfig';

// Initialize bugsnag for error/exception handling
// See https://docs.bugsnag.com/platforms/javascript/react/configuration-options/
// for configuration options.
const bugsnagClient = bugsnag({
  apiKey: config.BUGSNAG_CLIENT_TOKEN,
  appVersion: __VERSION__,
  releaseStage: process.env.APP_ENV,
  notifyReleaseStages: ['production', 'staging'],
}).use(bugsnagReact, React);

export const ErrorBoundary = bugsnagClient.getPlugin('react');

export default bugsnagClient;
