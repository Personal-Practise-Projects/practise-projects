import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getParamForKeyFromUrl } from '../../helpers/url';
import Table from '../Table';

import Loader from '../Loader';
import { fetchBrands, resetBrandData } from '../../actions/brandActions';
import BrandPaginationHandler from './paginationHandler';
import brandListParser from './parser';

class BrandListView extends React.Component {
  constructor(props) {
    super(props);
    const redirected = getParamForKeyFromUrl('redirected', false);
    let brandId;
    if (redirected) {
      brandId = getParamForKeyFromUrl('brand', undefined);
    }
    this.state = {
      showLoader: true,
      redirected,
      brandId,
    };
    this.createBrandFetchHandler();
  }

  componentDidMount() {
    this.brandPaginatedDataHandler.fetch();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const redirected = getParamForKeyFromUrl('redirected', false);
    let brandId;
    if (redirected) {
      brandId = getParamForKeyFromUrl('brand', undefined);
    }
    if (prevState.searchString !== nextProps.searchString) {
      return { searchString: nextProps.searchString, showLoader: true };
    }
    if (prevState.brandId !== brandId) {
      return { redirected, brandId };
    }
    return {};
  }

  render() {
    const data = brandListParser(this.props.brands);
    return this.state.showLoader ? (
      <Loader />
    ) : (
      <div className="brand-page position-relative">
        <Table
          data={data}
          headers={this.props.metaInfo.list_meta_info}
          handleSelectedRow={this.onSelection}
          onEndScroll={this.brandPaginatedDataHandler.fetch}
          showLoader={this.state.showLoader}
        />
      </div>
    );
  }

  onSelection = selectedBrandId => {
    this.props.onSelection(selectedBrandId);
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.searchString !== this.props.searchString ||
      prevState.brandId !== this.state.brandId
    ) {
      this.createBrandFetchHandler();
      this.brandPaginatedDataHandler.fetch();
    }
  }

  createBrandFetchHandler = () => {
    if (this.brandPaginatedDataHandler) {
      this.brandPaginatedDataHandler.cancelExistingRequests();
    }
    this.props.resetBrandData();
    this.brandPaginatedDataHandler = new BrandPaginationHandler(
      this.props.fetchBrands,
      this.onBrandFetch,
      this.props.searchString,
      this.state.redirected && this.state.brandId
        ? this.state.brandId
        : undefined,
    );
  };

  onBrandFetch = () => {
    this.setState({ showLoader: false });
  };
}

BrandListView.propTypes = {
  brands: PropTypes.array,
  metaInfo: PropTypes.object,
  onSelection: PropTypes.func.isRequired,
  fetchBrands: PropTypes.func.isRequired,
  resetBrandData: PropTypes.func.isRequired,
  searchString: PropTypes.string,
};

const mapStateToProps = state => ({
  metaInfo: state.brands.metaInfo,
  brands: state.brands.brands,
  brandsDict: state.brands.brandsDict,
});

const mapDispatchToProps = {
  fetchBrands,
  resetBrandData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BrandListView);
