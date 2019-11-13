import React from 'react';
import { connect } from 'react-redux';

import Loader from '../Loader';
import Table from '../Table';
import { productListParser } from './parser';
import {
  resetProductsData,
  updateProductsData,
  updateProductsMetaInfo,
} from '../../actions/productActions';
import { fetchProductMetaInfo, productListHandler } from './services';
import { CONTENT_REQUEST_DETAILS_LISTS } from '../../common/constants';

import './ProductList.scss';

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchString: props.searchString, showLoader: true };
    this.createProductFetchHandler();
  }

  componentDidMount() {
    fetchProductMetaInfo(this.onFetchProductMetaInfo);
    this.fetchProductData.fetch();
  }

  componentWillUnmount() {
    this.props.resetProductsData();
    this.cancelPreviousRequest();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.searchString !== prevState.searchString) {
      return { searchString: nextProps.searchString, showLoader: true };
    }
    return {};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchString !== this.props.searchString) {
      this.createProductFetchHandler();
      this.fetchProductData.fetch();
    }
  }

  render() {
    const { metaInfo, products } = this.props;
    const { headers, data } = productListParser(metaInfo, products);
    return this.state.showLoader ? (
      <Loader />
    ) : (
      <div className="product-list-component">
        <Table
          data={data}
          handleSelectedRow={this.onSelect}
          headers={headers}
          onEndScroll={this.fetchProductData.fetch}
          showLoader={this.state.showLoader}
        />
      </div>
    );
  }

  onSelect = productId => {
    this.props.onSelection({
      product: this.props.productDict[productId],
      headers: this.props.metaInfo.detail_header,
      type: CONTENT_REQUEST_DETAILS_LISTS.PRODUCT_TYPE,
    });
  };

  onFetchProductMetaInfo = data => {
    this.props.updateProductsMetaInfo(data);
    if (this.props.data) {
      this.setState({ showLoader: false });
    }
  };

  onFetchProducts = data => {
    this.props.updateProductsData(data);
    if (this.props.metaInfo.list_header.length) {
      this.setState({ showLoader: false });
    }
  };

  errorCallback = errorResponse => this.setState({ showLoader: false });

  createProductFetchHandler = () => {
    this.cancelPreviousRequest();
    this.props.resetProductsData();
    this.fetchProductData = productListHandler(
      this.onFetchProducts,
      this.errorCallback,
      this.state.searchString,
      this.props.contentRequestId,
    );
  };

  cancelPreviousRequest = () => {
    this.fetchProductData && this.fetchProductData.cancelExistingRequests();
  };
}

const mapStateToProps = state => ({
  metaInfo: state.products.meta_info,
  products: state.products.products,
  productDict: state.products.productDict,
});

const mapDispatchToProps = {
  updateProductsData,
  updateProductsMetaInfo,
  resetProductsData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductList);
