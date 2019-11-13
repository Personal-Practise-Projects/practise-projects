import React from 'react';
import { connect } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import ContentChooserWidget from '../../components/ContentsChooser';
import Logger from '../../logging/logger';
import NotificationList from '../../components/Notifications';
import Singleton from '../../common/events';
import UploadList from '../../components/Upload/upload';
import { getBulkUploadComponent } from '../../components/ShotsBulkOperationView/components/Factory';
import LightBox from '../../components/LightBox';

import { initializePush } from '../../common/notifications/notification';
import { fetchNotifications } from '../../components/Notifications/actions';
import { AppEvents } from '../../common/constants';
import { fetchShotsMetaInfo } from '../../actions/commonActions';
import { isLogin } from '../../common/helpers';

import 'react-toastify/dist/ReactToastify.css';
import ConfirmDialogBox from '../../components/ConfirmDialogBox';
import NavigationStack from '../../components/NavigationStack';
import { generateUniqueId } from '../../helpers/common';
import { openLightBox } from './actions';
import NotificationNavigation from '../../components/NotificationNavigation';

const logger = Logger.createLogger('BasePage');

class BasePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateVersionId: generateUniqueId(),
    };
  }

  componentDidMount() {
    if (isLogin()) {
      // Fetch shot meta info as it is required in most of the all pages
      this.props.fetchShotsMetaInfo();
      initializePush();
    }
    Singleton.getInstance().subscribe(
      this.__notify,
      AppEvents.EVENT_NOTIFICATION_RECEIVED,
      AppEvents.REFRESH_BASE_PAGE,
    );
  }

  componentWillUnmount() {
    Singleton.getInstance().unsubscribe(
      this.__notify,
      AppEvents.EVENT_NOTIFICATION_RECEIVED,
      AppEvents.REFRESH_BASE_PAGE,
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.props.uploadWidget && this.props.uploadWidget.injectors && (
          <ContentChooserWidget {...this.props.uploadWidget} />
        )}
        <React.Fragment key={this.state.updateVersionId}>
          {this.props.children}
        </React.Fragment>
        {this.props.showNotificationList && <NotificationList />}
        {this.props.bulkUpdateController &&
          getBulkUploadComponent(
            this.props.bulkUpdateController.type,
            this.props.bulkUpdateController,
          )}
        <ToastContainer autoClose={3000} hideProgressBar closeOnClick />
        {this.props.confirmDialogController && (
          <ConfirmDialogBox controller={this.props.confirmDialogController} />
        )}
        <NotificationNavigation />
        <UploadList />
        <NavigationStack />
        {this.props.lightBox && <LightBox dataHandler={this.props.lightBox} />}
      </React.Fragment>
    );
  }

  __notify = (eventType, ...params) => {
    if (eventType === AppEvents.EVENT_NOTIFICATION_RECEIVED) {
      this.props.fetchNotifications();
    } else if (eventType === AppEvents.REFRESH_BASE_PAGE) {
      this.setState({ updateVersionId: generateUniqueId() });
    } else {
      logger.log(`Event type not register ${eventType}`);
    }
  };
}

const mapStateToProps = state => ({
  uploadWidget: state.base.uploadWidget,
  lightBox: state.base.lightBox,
  showNotificationList: state.base.showNotificationList,
  bulkUpdateController: state.base.bulkUpdateController,
  confirmDialogController: state.base.confirmDialogController,
  changePasswordController: state.base.changePasswordController,
});

const mapDispatchToProps = {
  fetchShotsMetaInfo,
  fetchNotifications,
  openLightBox,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BasePage);
