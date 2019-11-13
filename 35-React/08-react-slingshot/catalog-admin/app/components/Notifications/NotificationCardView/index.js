import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import parse from 'html-react-parser';
import { parseStringToHtml } from '../../../helpers/common';
import { pushNavigationStack } from '../../../containers/BasePage/actions';
import { NOTIFICATION_ACTION_TYPES } from '../dataHandler';
import personPlaceholder from '../../../images/common/default_profile_thumbnail.svg';
import Img from '../../Img';

import styles from './NotificationCard.scss';

class NotificationCardView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  render() {
    return (
      <Route
        render={({ history }) => {
          this.history = history;
          return (
            <div
              className={`notification ${this.props.data.unread &&
                'notification-unread'}`}
              style={styles}
              onClick={() => {
                this.props.updateNotificationsHandler(
                  NOTIFICATION_ACTION_TYPES.NOTIFICATION_READ,
                  this.props.data,
                );
                this.props.data.redirection(this.props.pushNavigationStack);
              }}
            >
              {this.getNotificationHeader()}
              {this.getNotificationBody()}
              <span className={this.props.data.chipColorClass}>
                {this.props.data.chipDisplay}
              </span>
            </div>
          );
        }}
      />
    );
  }

  getNotificationBody() {
    return (
      <div className="notification-content">
        {parse(parseStringToHtml(this.props.data.message))}
      </div>
    );
  }

  getNotificationHeader() {
    return (
      <div className="notification-header d-flex align-items-center">
        <div className="notification-header-left d-flex align-items-center">
          <div className="profile-wrapper position-relative">
            <Img
              className="profile-logo d-block"
              src={this.props.data.fromUser.thumb}
              errSrc={personPlaceholder}
            />
            {this.props.data.unread && (
              <span className="notification-light red-light" />
            )}
          </div>
          <div className="profile-details d-flex align-items-center">
            <div className="profile-name">{this.props.data.fromUser.name}</div>
            <div className="profile-date" title={this.props.data.addedOnHover}>
              {this.props.data.addedOn}
            </div>
          </div>
        </div>
        <div className="notification-header-right">
          {/* Space reserved for Edit & Delete dropdown */}
        </div>
      </div>
    );
  }
}

NotificationCardView.propTypes = {
  data: PropTypes.object.isRequired,
  updateNotificationsHandler: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  pushNavigationStack,
};

export default connect(
  null,
  mapDispatchToProps,
)(NotificationCardView);
