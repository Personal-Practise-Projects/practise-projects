import React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from '../CopyToClipboard';
import Button from '../Button';
import { DETAILS_VIEW_EVENT } from '../ShotDetailsView/constants';
import HeaderRenderFactory from '../ComponentFactory/headerFactory';
import AnchorTag from '../../form-components/AnchorTag';

export default class SidePanelHeaderView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.dataHandler.headers !== prevState.headers) {
      return {
        headers: nextProps.dataHandler.headers,
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.headers !== this.state.headers;
  }

  render() {
    return (
      this.state.headers && (
        <div className="splitpage-drawer-header d-flex align-items-start justify-content-between">
          <div className="header-left text-left">
            <span className="shot-brand">{this.state.headers.title}</span>
            <div className="shot-meta d-flex align-items-center">
              <h4 className="d-flex align-items-center">
                <AnchorTag
                  className="link-text"
                  targetBlank
                  message={this.props.dataHandler.getShotNumberLink()}
                />
                <CopyToClipboard value={this.state.headers.subTitle} />
              </h4>
            </div>
            {this.state.headers.features.map(feature =>
              HeaderRenderFactory(feature, feature.uid, this.props.dataHandler),
            )}
          </div>
          <div className="header-right d-flex align-items-center justify-content-end">
            <Button
              className="btn btn-close"
              onClick={() =>
                this.props.dataHandler.eventListener(
                  DETAILS_VIEW_EVENT.CLOSE_DETAILS_PANEL,
                )
              }
              displayElement={<i className="icon-cross" />}
            />
          </div>
        </div>
      )
    );
  }
}
SidePanelHeaderView.propTypes = {
  dataHandler: PropTypes.object,
};
