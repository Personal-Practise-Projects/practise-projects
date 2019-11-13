import {
  FETCH_USER_NOTIFICATIONS,
  FETCH_USER_NOTIFICATIONS_FAILED,
  UPDATE_USER_NOTIFICATIONS,
  UPDATE_USER_NOTIFICATIONS_COUNT,
  UPDATE_USER_NOTIFICATIONS_FAILED
} from '../../actions/types';


export const NOTIFICATION_INITIAL_STATE = {
  unreadCount: 0,
  notifications: {
    newer: [],
    older: []
  },
  isLoading: true,
  lastFetchTime: 0,
};

export default function reducer(state = NOTIFICATION_INITIAL_STATE, { type, payload }) {
  switch (type) {
    case FETCH_USER_NOTIFICATIONS:
      state = { ...state, ...payload };
      state.isLoading = false;
      state.unreadCount = payload.unread_count;
      return state;
    case UPDATE_USER_NOTIFICATIONS:
      state = { ...state };
      state.notifications = { ...state.notifications };
      state.notifications.newer = [...state.notifications.newer];
      state.notifications.older = [...state.notifications.older];
      return state;
    case UPDATE_USER_NOTIFICATIONS_COUNT:
      state = { ...state };
      state.unreadCount = payload;
      return state;
    case FETCH_USER_NOTIFICATIONS_FAILED:
    case UPDATE_USER_NOTIFICATIONS_FAILED:
      state = { ...state, ...payload };
      state.isLoading = false;
      return state;
    default:
      return state;
  }
}
