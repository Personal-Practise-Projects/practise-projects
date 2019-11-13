import React from 'react'
import { connect } from "react-redux";
import { Route } from "react-router-dom";

import Logger from "../../logging/logger";
import ScrollToElementId from "../NavigationStack/scrollToElementId";
import { NAVIGATION_STACK_TYPE } from "../Notifications/common/constants";
import { popNavigationStack } from "../../containers/BasePage/actions";
import PerformActionForNavigation from "./handleActionNavigation";
import { ELEMENT_NO_FOUND_FUNCTION_DELAY } from "./constants";
import Singleton from "../../common/events";
import { AppEvents } from "../../common/constants";


const logger = Logger.createLogger('NavigationStack');

class NavigationStack extends React.Component {
  render() {
    return <Route render={({ history }) => {
      this.history = history;
      return (
        this.props.topStackElement && this.stackRendererFactory() || <React.Fragment/>
      )
    }}
    />;
  }

  stackRendererFactory = () => {
    switch (this.props.topStackElement.type) {
      case NAVIGATION_STACK_TYPE.SCROLL:
        return <ScrollToElementId
          key={this.props.topStackElement.uid}
          navigationData={this.props.topStackElement}
          callbackFn={this.eventListener}
        />;
      case NAVIGATION_STACK_TYPE.ACTION:
        return <PerformActionForNavigation
          key={this.props.topStackElement.uid}
          navigationData={this.props.topStackElement}
          callbackFn={this.eventListener}
        />;
      case NAVIGATION_STACK_TYPE.INTERNAL_REDIRECTION:
        this.history && this.history.push(this.props.topStackElement.payload);
        Singleton.getInstance().notify(AppEvents.REFRESH_BASE_PAGE);
        setTimeout(this.eventListener, ELEMENT_NO_FOUND_FUNCTION_DELAY,);
        return undefined;
      default:
        logger.log('Event not implemented', this.props.topStackElement.type);
        return undefined;
    }
  };

  eventListener = () => {
    this.props.popNavigationStack();
  };
}

const mapStateToProps = state => ({
  topStackElement: state.base.navigationStack.length > 0 ? state.base.navigationStack[0] : undefined,
});

const mapDispatchToProps = {
  popNavigationStack,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationStack);
