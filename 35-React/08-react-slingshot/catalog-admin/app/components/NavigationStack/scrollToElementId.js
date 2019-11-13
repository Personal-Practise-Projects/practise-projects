import React from "react";
import PropTypes from "prop-types";

import { ELEMENT_NO_FOUND_FUNCTION_DELAY, MAX_RETRY_ALLOWED } from "./constants";

export default class ScrollToElementId extends React.Component {
  constructor(props) {
    super(props);
    this.retryCount = -1;
  }
  render() {
    this.__scroll();
    return <React.Fragment/>
  }

  __scroll = () => {
    this.retryCount++;
    if (this.retryCount > MAX_RETRY_ALLOWED) {
      this.props.callbackFn && this.props.callbackFn();
    } else {
      const element = document.getElementById(this.props.navigationData.payload);
      if (element) {
        element.scrollIntoView();
        this.props.callbackFn && this.props.callbackFn()
      } else {
        setTimeout(this.__scroll, ELEMENT_NO_FOUND_FUNCTION_DELAY,);
      }
    }
  };
}

ScrollToElementId.propTypes = {
  callbackFn: PropTypes.func,
  navigationData: PropTypes.object.isRequired,
};

