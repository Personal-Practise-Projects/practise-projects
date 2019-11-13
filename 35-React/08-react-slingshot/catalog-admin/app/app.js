/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
// Needed for redux-saga es6 generator support
// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import FontFaceObserver from 'fontfaceobserver';
import { Provider } from 'react-redux';
import 'sanitize.css/sanitize.css';

import 'styles/GlobalStyles.scss';
// Import the Global Application Entry Point
import App from 'containers/App';
// Load the favicon and the .htaccess file
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=.htaccess!./.htaccess'; // eslint-disable-line import/extensions
import { initializeFirebase } from './common/notifications/notification';
import store from './store';
import config from './config/appConfig';
import { ErrorBoundary } from './logging/bugsnag';
import { recordUserSession } from './common/helpers';

const MOUNT_NODE = document.getElementById('app');

const loadAppFonts = function() {
  // Observe loading of Source Sans Pro (to remove Source Sans Pro, remove the <link> tag in
  // When Source Sans Pro is loaded, add a font-family using Source Sans Pro to the body
  // the index.html file and this observer)
  const openSansObserver = new FontFaceObserver('Source Sans Pro', {});
  openSansObserver.load().then(() => {
    document.body.classList.add('fonts-loaded');
  });
  const catalogAdminObserver = new FontFaceObserver('catalog-admin', {});
  catalogAdminObserver.load().then(() => {
    document.body.classList.add('icons-loaded');
  });
};

// Load App fonts
loadAppFonts();
// Initialize firebase for push
initializeFirebase();

const render = () => {
  ReactDOM.render(
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
      ,
    </ErrorBoundary>,
    MOUNT_NODE,
  );
};

render();

// Record exceptions and sessions for remote environments like staging and production
if (config.REMOTE_ENV) {
  recordUserSession();
}
