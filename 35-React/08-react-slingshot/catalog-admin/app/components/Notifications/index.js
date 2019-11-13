import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchNotifications, updateNotifications } from './actions';
import { closeNotifications } from '../../containers/BasePage/actions';

import NotificationCardView from './NotificationCardView';
import NotificationDataHandler from './dataHandler';
// Import Component Specific Styling
import styles from './Notification.scss';

class NotificationList extends React.Component {
  constructor(props) {
    super(props);
    this.dataHandler = new NotificationDataHandler(props);
  }

  render() {
    return (
      <div className="notifications" style={styles}>
        <div
          className="notifications-overlay position-relative"
          onClick={this.props.closeNotifications}
        >
          <div
            className="notifications-panel animated slideInRight"
            onClick={event => {
              event.stopPropagation();
            }}
          >
            <div className="notifications-panel-header position-relative">
              <button
                className="panel-close"
                onClick={this.props.closeNotifications}
              >
                <i className="icon-cross" />
              </button>
              <div className="panel-description">
                <div className="panel-description-left d-flex align-items-center justify-content-start">
                  <h3>Notifications</h3>
                  {this.props.unreadCount > 0 && (
                    <span className="pill-count">{this.props.unreadCount}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="notifications-panel-content">
              {this.props.newerNotifications.length > 0 && (
                <div className="notifications-section new-notifications">
                  <h5 className="notifications-section-title">New</h5>
                  {this.getNotificationCards(this.props.newerNotifications)}
                </div>
              )}
              {this.props.olderNotifications.length > 0 && (
                <div className="notifications-section old-notifications">
                  <h5 className="notifications-section-title">Old</h5>
                  {this.getNotificationCards(this.props.olderNotifications)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.props.fetchNotification();
  }

  getNotificationCards = notifications =>
    notifications.map((notification, index) => (
      <NotificationCardView
        key={index}
        data={notification}
        updateNotificationsHandler={this.dataHandler.updateNotificationsHandler}
      />
    ));
}

NotificationList.propTypes = {
  notifications: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};

const mapStateToProps = state => ({
  newerNotifications: state.notification.notifications.newer,
  olderNotifications: state.notification.notifications.older,
  unreadCount: state.notification.unreadCount,
  isLoading: state.notification.isLoading,
});

const mapDispatchToProps = {
  fetchNotification: fetchNotifications,
  updateNotifications,
  closeNotifications,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationList);
