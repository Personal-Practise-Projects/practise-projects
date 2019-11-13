import React, { Component } from 'react';

import InlineEditTextBox from '../InlineEditTextBox';

export default class ActorDetailHeader extends Component {
  render() {
    return (
      <div className="splitpage-drawer-header d-flex align-items-center justify-content-between">
        <div className="header-left text-left">
          <div className="shot-meta d-flex align-items-center">
            <h4>{this.props.name}</h4>
          </div>
        </div>
        <div className="header-right d-flex align-items-center justify-content-end">
          <button
            type="button"
            className="btn btn-close"
            onClick={this.props.onClick}
          >
            <i className="icon-cross" />
          </button>
        </div>
      </div>
    );
  }
}
