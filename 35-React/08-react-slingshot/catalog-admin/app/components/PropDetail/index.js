import React from 'react';
import { connect } from 'react-redux';

import PropDetailHeader from '../PropDetailHeader';
import {
  closeContentWidget,
  openContentWidget,
} from '../../containers/BasePage/actions';
import { propsDispatcher } from '../../actions/propActions';
import ComponentRenderFactory from '../ComponentFactory';
import { DETAILS_VIEW_EVENT } from '../ShotDetailsView/constants';
import { DataHandler } from './dataHandler';

import './PropsDetail.scss';

class PropDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const dataHandler = new DataHandler(
      this.props.selectedProp,
      this.props.propsDispatcher,
      this.eventListener,
    );
    return (
      <div className="splitpage-drawer animated slideInRight">
        <PropDetailHeader
          name={this.props.selectedProp.name}
          onClick={this.closePanel}
          classes="prop-header"
        />
        <div className="splitpage-drawer-body">
          {this.props.headers.map((header, index) =>
            ComponentRenderFactory.component(header, index, dataHandler),
          )}
        </div>
      </div>
    );
  }

  eventListener = args => {
    if (args && args.event) {
      switch (args.event) {
        case DETAILS_VIEW_EVENT.OPEN_IMAGE_WIDGET:
          this.props.openContentWidget(args.uploadWidget);
          this.setState({});
          break;
        case DETAILS_VIEW_EVENT.CLOSE_IMAGE_WIDGET:
          this.props.closeContentWidget();
          this.setState({});
          break;
      }
    } else {
      this.props.eventListener(args);
    }
  };

  closePanel = () => {
    this.props.eventListener({
      event: DETAILS_VIEW_EVENT.CLOSE_DETAILS_PANEL,
    });
  };
}

const mapDispatchToProps = {
  propsDispatcher,
  openContentWidget,
  closeContentWidget,
};
export default connect(
  null,
  mapDispatchToProps,
)(PropDetail);
