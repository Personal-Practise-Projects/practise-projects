import React from 'react';
import { connect } from 'react-redux';
import LocationHeader from '../LocationHeader';
import ComponentRenderFactory from '../ComponentFactory';
import {
  updateLocation,
  updateLocationImages,
} from '../../actions/locationActions';
import {
  closeContentWidget,
  openContentWidget,
} from '../../containers/BasePage/actions';

import LocationDataHandler from './dataHandler';
import { COMMON_ACTIONS } from '../../common/constants';
import Logger from '../../logging/logger';

const logger = Logger.createLogger('Location details');

class LocationDetail extends React.Component {
  constructor(props) {
    super(props);
    this.dataHandler = new LocationDataHandler(
      { eventListener: this.eventListener, ...props },
      this.props.selectedLocation,
    );
    this.dataVersion = this.dataHandler.dataVersion;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.selectedLocation === nextProps.selectedLocation &&
      this.dataVersion > this.dataHandler.dataVersion
    ) {
      return false;
    }
    this.dataHandler.setData(nextProps, nextProps.selectedLocation);
    this.dataVersion = this.dataHandler.dataVersion;
    return true;
  }

  render() {
    return (
      <div className="splitpage-drawer animated slideInRight">
        <LocationHeader
          name={this.props.selectedLocation.name}
          onClick={() => {
            this.eventListener({ action: COMMON_ACTIONS.CLOSE_DETAILS_PANEL });
          }}
        />
        <div className="splitpage-drawer-body">
          {this.props.headers.map((header, index) =>
            ComponentRenderFactory.component(header, index, this.dataHandler),
          )}
        </div>
      </div>
    );
  }

  eventListener = args => {
    switch (args.action) {
      case COMMON_ACTIONS.CLOSE_DETAILS_PANEL:
        this.props.closePanel(null);
        break;
      default:
        logger.error(`Un-supported action ${args.action}`);
    }
  };

  onClick = action => {
    this.props.onAction(action);
  };
}

const mapStateToProps = state => ({
  headers: state.locations.metaInfo.detail_headers,
  locations: state.locations.data,
  locationDict: state.locations.locationDict,
});

const mapDispatchToProps = {
  onUpdateLocation: updateLocation,
  updateLocationImages,
  openContentWidget,
  closeContentWidget,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationDetail);
