import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { NAVIGATION_ACTION_TYPE } from "../Notifications/common/constants";
import LightBoxHandler from "../LightBox/dataHandler";
import { closeContentWidget, openContentWidget, openLightBox } from "../../containers/BasePage/actions";
import { dataReducersFactory } from "../ContentsChooser/DataHandler/factory";
import { SHOT_CONTENT } from "../ContentsChooser/actions/types";

class PerformActionForNavigation extends React.Component {
  render() {
    this.__performAction();
    return <React.Fragment/>
  }

  __performAction = () => {
    switch (this.props.navigationData.event) {
      case NAVIGATION_ACTION_TYPE.OPEN_EDIT_WIDGET:
        this.__openContentWidget();
        break;
      case NAVIGATION_ACTION_TYPE.OPEN_LIGHT_BOX:
        this.props.openLightBox(new LightBoxHandler(this.props.navigationData.payload));
        this.props.callbackFn && this.props.callbackFn();
        break;
    }
  };

  __openContentWidget = () => {
    const uploadWidget = dataReducersFactory(
      SHOT_CONTENT,
      this.props.closeContentWidget,
      this.props.navigationData.payload.ref,
    );
    uploadWidget.selectedTab = this.props.navigationData.payload.selectTabId;
    this.props.openContentWidget(uploadWidget);
    this.props.callbackFn && this.props.callbackFn()
  };
}

PerformActionForNavigation.propTypes = {
  callbackFn: PropTypes.func,
  navigationData: PropTypes.object.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  openLightBox,
  openContentWidget,
  closeContentWidget,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PerformActionForNavigation);

