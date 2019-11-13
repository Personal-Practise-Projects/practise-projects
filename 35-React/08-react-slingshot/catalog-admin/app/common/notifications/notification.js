import firebase from 'firebase/app';
import 'firebase/messaging';

import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import Logger from '../../logging/logger';
import { registerPushToken } from '../../actions/commonActions';
import { AppEvents, FCM_TOKEN_KEY } from '../constants';
import Singleton from '../events';

const logger = Logger.createLogger('Notification');
const firebaseConfig = { messagingSenderId: '218268204602' };

export const initializeFirebase = () => {
  firebase.initializeApp(firebaseConfig);
};

export function initializePush() {
  if (firebase.messaging.isSupported()) {
    const messaging = firebase.messaging();
    messaging
      .requestPermission()
      .then(() => {
        logger.log('Permission received');
        getToken();
      })
      .catch(error => {
        if (error.code === 'messaging/permission-blocked') {
          logger.log('Please Unblock Notification Request  Manually');
        } else {
          logger.log('Error Occurred', error);
        }
      });
  }
}

export function getToken() {
  if (
    localStorage.getItem(FCM_TOKEN_KEY) &&
    JSON.parse(localStorage.getItem(FCM_TOKEN_KEY))
  ) {
    startFirebaseListening();
    return;
  }
  if (firebase.messaging.isSupported()) {
    if ('serviceWorker' in navigator) {
      const messaging = firebase.messaging();
      // Required as without it getRegistrations gives no registrations
      runtime.register();
      navigator.serviceWorker
        .getRegistrations()
        .then(registrations => {
          if (registrations.length <= 0) {
            throw new Error('No registrations');
          }
          messaging.useServiceWorker(registrations[0]);
          return messaging.getToken();
        })
        .then(token => {
          localStorage.setItem(FCM_TOKEN_KEY, '');
          registerPushToken(token);
          startFirebaseListening();
        })
        .catch(err => {
          logger.log('Service worker registration failed, error:', err);
        });
    }
  }
}

function startFirebaseListening() {
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a service worker
  //   `messaging.setBackgroundMessageHandler` handler.
  if (firebase.messaging.isSupported()) {
    const messaging = firebase.messaging();
    messaging.onMessage(() => {
      Singleton.getInstance().notify(AppEvents.EVENT_NOTIFICATION_RECEIVED);
    });
    messaging.onTokenRefresh(() => {
      messaging
        .getToken()
        .then(token => {
          localStorage.setItem(FCM_TOKEN_KEY, false);
          registerPushToken(token);
          startFirebaseListening();
        })
        .catch(err => {
          logger.log('Unable to retrieve refreshed token ', err);
        });
    });
  }
}
