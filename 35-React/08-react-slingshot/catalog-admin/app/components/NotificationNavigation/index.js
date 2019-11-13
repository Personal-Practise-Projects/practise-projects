import React from 'react';
import { connect } from 'react-redux';
import { Route } from "react-router-dom";

import NotificationDataHandler, { NOTIFICATION_ACTION_TYPES } from '../Notifications/dataHandler';
import { removeParamFromRoute } from '../../helpers/common';
import { getNotificationById, parseNotificationDate, updateNotifications } from "../Notifications/actions";
import { pushNavigationStack } from "../../containers/BasePage/actions";

class NotificationNavigation extends React.Component {
  constructor(props) {
    super(props);
    const params = new URL(document.location).searchParams;
    this.state = {
      notificationId: params.get('notification_id')
    }
  }

  componentDidMount() {
    this.__handleNotificationNavigation();
  }

  render() {
    return <Route render={({ history }) => {
      this.history = history;
      return (
        <React.Fragment/>
      )
    }}
    />
  }

  __handleNotificationNavigation() {
    if (this.state.notificationId) {
      getNotificationById(this.state.notificationId, notification => {
        const parsedNotification = parseNotificationDate(notification);
        new NotificationDataHandler(this.props).updateNotificationsHandler(
          NOTIFICATION_ACTION_TYPES.NOTIFICATION_READ, parsedNotification
        );
        parsedNotification.redirection(this.props.pushNavigationStack);
        removeParamFromRoute('notification_id', window.location.href)
      });
    }
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  pushNavigationStack,
  updateNotifications,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationNavigation);
