import {
  UPDATE_USER_NOTIFICATIONS_COUNT,
  NOTIFICATION_LAST_READ_TIME,
} from '../../actions/types';
import AxiosBuilder from '../../common/axiosBuilder';
import { USER_INFO } from '../../common/constants';
import { getUnreadNotificationCount } from '../Notifications/actions';

export const fetchUnreadNotificationCount = () => dispatch => {
  // dispatch unread notification count
  new AxiosBuilder(USER_INFO)
    .withAuth()
    .fetch()
    .then(response => {
      localStorage.setItem(
        NOTIFICATION_LAST_READ_TIME,
        JSON.stringify(response.data.notification_read_time),
      );
    });
  dispatch({
    type: UPDATE_USER_NOTIFICATIONS_COUNT,
    payload: getUnreadNotificationCount(),
  });
};
