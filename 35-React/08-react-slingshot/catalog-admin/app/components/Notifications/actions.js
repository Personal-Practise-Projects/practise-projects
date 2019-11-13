import {
  FETCH_USER_NOTIFICATIONS,
  FETCH_USER_NOTIFICATIONS_FAILED,
  NOTIFICATION_LAST_READ_TIME,
  NOTIFICATION_STORAGE_KEY,
  UPDATE_USER_NOTIFICATIONS,
  UPDATE_USER_NOTIFICATIONS_COUNT,
  UPDATE_USER_NOTIFICATIONS_FAILED,
} from '../../actions/types';
import AxiosBuilder from '../../common/axiosBuilder';
import { NOTIFICATIONS, USER_INFO } from '../../common/constants';
import { NOTIFICATION_TYPES } from './common/constants';
import { handleNotificationRedirection } from './common/resolver';
import {
  getDateTimeInLocalTimeZone,
  getDisplayDate,
  getShotColorFromStatus,
} from '../../helpers/common';
import Logger from '../../logging/logger';

const logger = Logger.createLogger('NotificationActions');
const FETCH_TIME_KEY = 'lastFetchTimeV2';

export const fetchNotifications = () => dispatch => {
  // Get all the saved notifications from local storage
  const existingNotifications =
    JSON.parse(localStorage.getItem(NOTIFICATION_STORAGE_KEY)) || {};
  // dispatch already available notification
  dispatch({
    type: FETCH_USER_NOTIFICATIONS,
    payload: {
      notifications: parseNotifications(existingNotifications.notifications),
      unread_count: getUnreadNotificationCount(),
    },
  });
  // Fetch latest notification from server from last fetch time
  fetchLatestNotifications(existingNotifications[FETCH_TIME_KEY] || 0, args => {
    if (args.type === FETCH_USER_NOTIFICATIONS) {
      const existingData = existingNotifications.notifications || [];
      args.payload[FETCH_TIME_KEY] = latestFetchTime(args);
      args.payload.notifications = mergeNotifications(args, existingData);
      args.payload.unread_count = getUnreadNotificationCount();
      localStorage.setItem(
        NOTIFICATION_STORAGE_KEY,
        JSON.stringify(args.payload),
      );
      args.payload = {
        notifications: parseNotifications(args.payload.notifications),
        unread_count: getUnreadNotificationCount(),
      };
    }
    // Dispatch the event
    dispatch(args);
  });
};

export const updateLastReadTime = () => {
  new AxiosBuilder(USER_INFO)
    .withAuth()
    .PATCH()
    .then(response => {
      localStorage.setItem(
        NOTIFICATION_LAST_READ_TIME,
        JSON.stringify(response.data.notification_read_time),
      );
    });
};

export function getUnreadNotificationCount() {
  const existingNotifications =
    JSON.parse(localStorage.getItem(NOTIFICATION_STORAGE_KEY)) || {};
  const lastReadTime = localStorage.getItem(NOTIFICATION_LAST_READ_TIME);
  let unreadCount = 0;
  if (existingNotifications.notifications) {
    // eslint-disable-next-line array-callback-return, consistent-return
    existingNotifications.notifications.some(notification => {
      if (notification.added_on <= lastReadTime || notification.is_read) {
        return true;
      }
      unreadCount += 1;
    });
  }
  return unreadCount;
}

export const updateNotifications = (ref, data) => dispatch => {
  const config = {
    data: JSON.stringify(data),
  };
  dispatch({
    type: UPDATE_USER_NOTIFICATIONS,
    payload: ref,
  });
  new AxiosBuilder(`${NOTIFICATIONS}${ref.id}/`, config)
    .withAuth()
    .PATCH()
    .then(response => {
      if (response.data) {
        Object.assign(ref, {
          ...parseNotificationDate(response.data.notification),
        });
        updateUnreadCount(response.data, dispatch);
      } else {
        dispatch({
          type: UPDATE_USER_NOTIFICATIONS_FAILED,
        });
      }
    })
    .catch(error => {
      logger.error(error);
      dispatch({
        type: UPDATE_USER_NOTIFICATIONS_FAILED,
      });
    });
};

export const getNotificationById = (id, callback) => {
  new AxiosBuilder(`${NOTIFICATIONS}${id}`)
    .withAuth()
    .fetch()
    .then(response => {
      callback(response.data);
    })
    .catch(error => {
      logger.error(error);
    });
};

function updateUnreadCount(response, dispatch) {
  // get unread count on the basis of last read time
  const unReadCount = getUnreadNotificationCount();
  // Dispatch updated count event to reducer
  dispatch({
    type: UPDATE_USER_NOTIFICATIONS_COUNT,
    payload: unReadCount,
  });
  // Update local storage for latest unread count
  const existingNotifications =
    JSON.parse(localStorage.getItem(NOTIFICATION_STORAGE_KEY)) || {};
  // Update with latest received notification count
  existingNotifications.unread_count = unReadCount;
  // Update object reference in local storage
  existingNotifications.notifications.forEach(notification => {
    if (notification.id === response.notification.id) {
      Object.assign(notification, { ...response.notification });
    }
  });
  localStorage.setItem(
    NOTIFICATION_STORAGE_KEY,
    JSON.stringify(existingNotifications),
  );
}

function fetchLatestNotifications(lastFetchTime, callback) {
  new AxiosBuilder(NOTIFICATIONS)
    .withAuth()
    .withParams({ latest_sync_timestamp: lastFetchTime || 0 })
    .fetch()
    .then(response => {
      if (response.data) {
        callback({
          type: FETCH_USER_NOTIFICATIONS,
          payload: response.data,
        });
      } else {
        callback({
          type: FETCH_USER_NOTIFICATIONS_FAILED,
        });
      }
    })
    .catch(error => {
      logger.error(error);
      callback({
        type: FETCH_USER_NOTIFICATIONS_FAILED,
      });
    });
}

function parseNotifications(notifications) {
  const parsedNotifications = {
    newer: [],
    older: [],
  };
  if (notifications) {
    const todayDate =
      new Date(`${new Date().toDateString()} 00:00:00`).getTime() / 1000;
    notifications = notifications.filter(
      notification => notification.payload && notification.payload.reference,
    );
    notifications.forEach(notification => {
      // eslint-disable-next-line no-unused-expressions
      notification.added_on >= todayDate
        ? parsedNotifications.newer.push(parseNotificationDate(notification))
        : parsedNotifications.older.push(parseNotificationDate(notification));
    });
  }
  return parsedNotifications;
}

export function parseNotificationDate(notification) {
  notification.from_user.thumb =
    notification.from_user.profile_picture_thumbnail &&
    notification.from_user.profile_picture_thumbnail.medium;
  return {
    id: notification.id,
    fromUser: notification.from_user || {},
    message: notification.payload.message,
    chipDisplay: notification.payload.reference,
    chipColorClass: getChipDisplayClass(notification),
    redirection: handleNotificationRedirection.bind(notification),
    type: notification.payload.notification_type,
    addedOn: getDisplayDate(
      getDateTimeInLocalTimeZone(notification.added_on * 1000),
    ),
    unread: !notification.is_read,
  };
}

function mergeNotifications(args, existingData) {
  const allNotifications = [...args.payload.notifications];
  allNotifications.forEach(notification => {
    existingData = existingData.filter(obj => obj.id !== notification.id);
  });
  return [...allNotifications, ...existingData];
}

function latestFetchTime(args) {
  return (
    (args.payload.notifications &&
      args.payload.notifications.length > 0 &&
      args.payload.notifications[0].added_on) ||
    0
  );
}

function getChipDisplayClass(notification) {
  let statusValue = null;
  if (notification.notification_type === NOTIFICATION_TYPES.SHOT_COMMENT) {
    statusValue = notification.payload.status;
  }
  return `chip-display rubik-semibold d-inline-block ${getShotColorFromStatus(
    statusValue,
  )}`;
}
