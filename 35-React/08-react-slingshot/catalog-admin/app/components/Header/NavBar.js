import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Avatar from 'react-avatar';
import { fetchUnreadNotificationCount } from './actions';
import { NavHeaderDropDownController } from './controller';
import MenuDropDown from '../../form-components/MenuDropDown';
import ComponentRenderFactory from '../ComponentFactory';
import { NAVIGATION_EVENT_TYPE } from './constants';
import { getHeadersConfig } from '../../helpers/user';
import {
  openNotifications,
  toggleConfirmDialog,
} from '../../containers/BasePage/actions';
// Begin Import of Styles
import styles from './NavBar.scss';
import { CHANGE_PASSWORD_MODAL } from '../../actions/types';
import { updateLastReadTime } from '../Notifications/actions';
import { resetAvatarList } from '../../actions/avatarWrapperActions';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.dataHandler = new NavHeaderDropDownController();
  }

  render() {
    const headerConfig = getHeadersConfig();
    if (this.props.userProfile) {
      return (
        <Route
          render={({ history }) => {
            this.history = history;
            return (
              <header
                className="header header-light header-padded d-flex align-items-center justify-content-between"
                style={styles}
              >
                <div className="header-left tenant-dropdown">
                  {headerConfig.map((header, index) =>
                    ComponentRenderFactory.component(
                      header,
                      index,
                      this.dataHandler.getController(header),
                    ),
                  )}
                </div>
                <div className="header-right d-flex align-items-center">
                  {this.props.cartCount > 0 && (
                    <a href="/shopping-cart" className="cart-button-link">
                      {/* eslint-disable-next-line react/button-has-type */}
                      <button className="icon-cart">
                        <div className="red-count">
                          <span className="red-count-number">
                            {this.props.cartCount}
                          </span>
                        </div>
                      </button>
                    </a>
                  )}
                  {/* eslint-disable-next-line react/button-has-type */}
                  <button
                    className="notifications-toggle d-flex align-items-center justify-content-center position-relative"
                    onClick={() => {
                      updateLastReadTime();
                      this.props.openNotifications();
                    }}
                  >
                    <i className="icon-bell" />
                    {this.props.unreadNotificationCount > 0 && (
                      <span className="pill-count">
                        {this.props.unreadNotificationCount}
                      </span>
                    )}
                  </button>
                  <MenuDropDown
                    items={this.dataHandler.profileOptions}
                    className="profile-wrapper"
                  >
                    <Avatar
                      initials={this.props.userProfile.name}
                      size="40"
                      round="50%"
                      src={this.props.userProfile.profile_picture_thumbnail}
                      className="logged-profile"
                    />
                    <div className="logged-username d-inline-block">
                      {this.props.userProfile.name}
                    </div>
                  </MenuDropDown>
                </div>
              </header>
            );
          }}
        />
      );
    }
    return <div />;
  }

  componentDidMount() {
    this.props.fetchUnreadNotificationCount();
    this.dataHandler.registerEventListener(this.navigationOptionListener);
  }

  componentWillUnmount() {
    this.dataHandler.registerEventListener();
  }

  navigationOptionListener = (eventType, args) => {
    switch (eventType) {
      case NAVIGATION_EVENT_TYPE.TENANT_CHANGED:
        this.props.resetAvatarList();
        break;
      case CHANGE_PASSWORD_MODAL:
        this.props.toggleConfirmDialog(args);
        break;
      default:
        break;
    }
  };
}

NavBar.propTypes = {
  cartCount: PropTypes.number,
  unreadNotificationCount: PropTypes.number,
  userProfile: PropTypes.object,
  openNotifications: PropTypes.func,
  toggleConfirmDialog: PropTypes.func,
  resetAvatarList: PropTypes.func,
  fetchUnreadNotificationCount: PropTypes.func,
};

const mapDispatchToProps = {
  fetchUnreadNotificationCount,
  openNotifications,
  resetAvatarList,
  toggleConfirmDialog,
};

const mapStateToProps = state => ({
  cartCount: state.cart.count,
  unreadNotificationCount: state.notification.unreadCount,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavBar);
