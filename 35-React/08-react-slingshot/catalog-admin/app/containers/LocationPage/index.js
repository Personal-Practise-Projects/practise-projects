import React from 'react';

import { connect } from 'react-redux';

import LocationListView from '../../components/LocationList';
import LocationDetail from '../../components/LocationDetail';
import SplitListPage from '../SplitListTitlePage';
import SubHeader from '../../components/SubHeader';
import AddRow from '../../components/AddRow';

import {
  addLocation,
  fetchLocationsHeader,
} from '../../actions/locationActions';

import './LocationPage.scss';

class LocationsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLocation: '',
    };
  }

  componentDidMount() {
    this.props.fetchLocationsHeader();
  }

  render() {
    return (
      <SplitListPage
        headerComponent={this.getHeaderComponent()}
        listComponent={this.getListComponent()}
        detailComponent={this.getDetailComponent()}
      />
    );
  }

  getHeaderComponent = () => {
    const leftChildren = [];
    const rightChildren = [
      <AddRow
        addAction={this.onAddLocation}
        placeHolder="Please type location name."
      />,
    ];

    return (
      <SubHeader
        data={{ title: 'Locations' }}
        leftChildren={leftChildren}
        rightChildren={rightChildren}
      />
    );
  };

  getListComponent = () => <LocationListView onSelect={this.onSelect} />;

  getDetailComponent = () =>
    this.state.selectedLocation && (
      <LocationDetail
        selectedLocation={this.state.selectedLocation}
        closePanel={this.onSelect}
      />
    );

  setLocalState = newState => {
    this.setState(newState);
  };

  onAddLocation = event =>
    this.props.addLocation(event.target.value, location => {
      this.onSelect(location);
    });

  onSelect = selectedLocation => {
    this.setLocalState({ selectedLocation });
  };
}

export const mapDispatchToProps = {
  addLocation,
  fetchLocationsHeader,
};

export default connect(
  null,
  mapDispatchToProps,
)(LocationsPage);
