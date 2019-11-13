import React from 'react';

import { connect } from 'react-redux';
import {
  fetchLocations,
  resetLocationsData,
} from '../../actions/locationActions';
import LocationPaginationHandler from './service';

import Table from '../Table';

class LocationList extends React.Component {
  constructor(props) {
    super(props);
    this.createLocationFetchHandler();
  }

  componentDidMount() {
    this.locationPaginatedDataHandler.fetch();
  }

  render() {
    return (
      <div className="location-page position-relative">
        <Table
          headers={this.props.metaInfo.headers}
          data={this.props.locations}
          handleSelectedRow={this.onSelect}
          onEndScroll={this.locationPaginatedDataHandler.fetch}
          showLoader={false}
        />
      </div>
    );
  }

  onSelect = locationId => {
    this.props.onSelect(this.props.locationDict[locationId]);
  };

  createLocationFetchHandler = () => {
    this.locationPaginatedDataHandler &&
      this.locationPaginatedDataHandler.cancelExistingRequests();
    this.props.resetLocationsData();
    this.locationPaginatedDataHandler = new LocationPaginationHandler(
      this.props.fetchLocationsDispatcher,
    );
  };
}

const mapStateToProps = state => ({
  locations: state.locations.data,
  metaInfo: state.locations.metaInfo,
  locationDict: state.locations.locationDict,
});

const mapDispatchToProps = {
  fetchLocationsDispatcher: fetchLocations,
  resetLocationsData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationList);
