export const NOTIFICATION_ACTION_TYPES = {
  NOTIFICATION_READ: '#notificationRead',
};
export default class NotificationDataHandler {
  constructor(props) {
    this.props = props;
  }

  updateNotificationsHandler = (type, notification) => {
    switch (type) {
      case NOTIFICATION_ACTION_TYPES.NOTIFICATION_READ:
        const data = { is_read: true };
        if (notification.unread) {
          this.props.updateNotifications(notification, data);
        }
        this.props.closeNotifications && this.props.closeNotifications();
        break;
      default:
        break;
    }
  };
}
