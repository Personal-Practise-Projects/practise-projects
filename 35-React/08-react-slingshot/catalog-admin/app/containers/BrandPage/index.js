import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SubHeader from '../../components/SubHeader';
import SplitListPage from '../SplitListTitlePage';
import BrandListView from '../../components/BrandList';
import BrandDetailsView from '../../components/BrandDetails';

import { createBrands, fetchBrandConfig } from '../../actions/brandActions';
import AddRow, { TYPE } from '../../components/AddRow';
import { CREATE_BRAND } from '../../actions/types';
import Search from '../../components/Search';
import { getParamForKeyFromUrl } from '../../helpers/url';
import { queryParamsFromDict } from '../../helpers/common';

// Import Component Specific Styling
import './BrandPage.scss';
import '../../styles/SidePanel.scss';

class BrandPage extends React.Component {
  constructor(props) {
    super(props);
    const brandId = getParamForKeyFromUrl('brand');
    this.state = {
      searchString: '',
      isLoading: false,
      brandId,
      brand: this.props.brandsDict[brandId],
    };
  }

  componentDidMount() {
    this.props.fetchBrandConfig();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const brandId = getParamForKeyFromUrl('brand');
    const brand = nextProps.brandsDict[brandId];
    if (prevState.brand !== brand) {
      return { brandId, brand };
    }
    return {};
  }

  onSearch = result => this.setState({ searchString: result });

  onAddBrand = (event, callback) => {
    this.props.createBrands(event.target.value, (action, response) => {
      let isSuccess = false;
      if (action === CREATE_BRAND) {
        isSuccess = true;
        this.onSelection(response.id);
      }
      const errorMsg = isSuccess
        ? ''
        : response.response.data.name &&
          response.response.data.name.length > 0 &&
          response.response.data.name[0];
      callback(isSuccess, errorMsg);
    });
  };

  getHeaderComponent = () => {
    const leftChildren = [];
    const rightChildren = [
      <AddRow
        key={0}
        addAction={this.onAddBrand}
        type={TYPE.WITH_ERROR}
        placeHolder="Type the brand name"
        displayText="Add Brand"
      />,
      <Search
        key={1}
        searchString={this.state.searchString}
        placeholder="Search by brand name"
        handler={this.onSearch}
      />,
    ];

    return (
      <SubHeader
        data={{ title: 'Brands' }}
        leftChildren={leftChildren}
        rightChildren={rightChildren}
        className="brand-subheader"
      />
    );
  };

  getDetailsComponent = () =>
    this.state.brand && (
      <BrandDetailsView
        key={this.state.brandId}
        closePanel={this.onSelection}
      />
    );

  getListingComponent = () => (
    <BrandListView
      searchString={this.state.searchString}
      onSelection={this.onSelection}
    />
  );

  render() {
    return (
      <SplitListPage
        isLoading={this.state.isLoading}
        headerComponent={this.getHeaderComponent()}
        detailComponent={this.getDetailsComponent()}
        listComponent={this.getListingComponent()}
      />
    );
  }

  onSelection = selectedBrandId => {
    // eslint-disable-next-line react/prop-types
    this.props.history.push({
      search: queryParamsFromDict({
        brand: selectedBrandId,
      }),
    });
    this.setState({});
  };
}

BrandPage.propTypes = {
  brandsDict: PropTypes.object.isRequired,
  fetchBrandConfig: PropTypes.func.isRequired,
  createBrands: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  brandsDict: state.brands.brandsDict,
});

const mapDispatchToProps = {
  createBrands,
  fetchBrandConfig,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(BrandPage));
