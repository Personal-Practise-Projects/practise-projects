import React from 'react';
import { connect } from 'react-redux';

import AddRow from '../../components/AddRow';
import PropDetail from '../../components/PropDetail';
import PropList from '../../components/PropList';
import Search from '../../components/Search';
import SplitListPage from '../SplitListTitlePage';
import SubHeader from '../../components/SubHeader';
import { DETAILS_VIEW_EVENT } from '../../components/ShotDetailsView/constants';

import { createProp } from '../../actions/propActions';
import styles from './PropPage.scss';

const SEARCH_PLACEHOLDER = 'Search by Name, color and shape';

class PropPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProp: '',
      searchString: '',
      detailHeader: '',
    };
  }

  getHeaderComponent = () => (
    <SubHeader
      data={{ title: 'Props' }}
      rightChildren={[
        <AddRow
          displayText="Add Prop"
          addAction={this.onAddProp}
          type="DEFAULT"
          placeHolder="Please type prop name."
        />,
        <Search
          searchString={this.state.searchString}
          placeholder={SEARCH_PLACEHOLDER}
          handler={this.onSearch}
          classes="expanded-search"
        />,
      ]}
    />
  );

  getListComponent = () => (
    <PropList
      searchString={this.state.searchString}
      onSelection={this.onSelect}
    />
  );

  getDetailComponent = () =>
    this.state.selectedProp && (
      <PropDetail
        selectedProp={this.state.selectedProp}
        headers={this.state.detailHeader}
        eventListener={this.eventListener}
      />
    );

  render() {
    return (
      <SplitListPage
        style={styles}
        headerComponent={this.getHeaderComponent()}
        listComponent={this.getListComponent()}
        detailComponent={this.getDetailComponent()}
      />
    );
  }

  onSelect = selectedProp => {
    this.setState({
      selectedProp: selectedProp.prop,
      detailHeader: selectedProp.headers,
    });
  };

  onSearch = result => {
    this.setState({ searchString: result, selectedProp: '' });
  };

  onAddProp = event => {
    this.props.createProp(event.target.value, prop => {
      this.eventListener(prop);
    });
  };

  eventListener = args => {
    switch (args.event) {
      case DETAILS_VIEW_EVENT.CLOSE_DETAILS_PANEL:
        this.setState({ selectedProp: null });
        break;
      default:
        this.setState({
          selectedProp: args,
          detailHeader: this.props.detail_header,
        });
    }
  };
}

const mapStateToProps = state => ({
  detail_header: state.props.metaInfo.detail_header,
});

const mapDispatchToProps = {
  createProp,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PropPage);
