import React from 'react';
import { connect } from 'react-redux';
import { createProduct } from '../../actions/productActions';
import { DETAILS_VIEW_EVENT } from '../../components/ShotDetailsView/constants';

import SplitListPage from '../SplitListTitlePage';
import SubHeader from '../../components/SubHeader';
import ProductDetails from '../../components/ProductDetails';
import ProductList from '../../components/ProductList';
import Search from '../../components/Search';
import AddRow from '../../components/AddRow';
// Import Component Specific Styling
import styles from './ProductPage.scss';

const SEARCH_PLACEHOLDER =
  'Search by Name, Brand, Category, Sub category, Status';

class ProductPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchString: '',
      selectedProduct: null,
      detailHeader: '',
    };
  }

  render() {
    return (
      <SplitListPage
        style={styles}
        headerComponent={this.getHeaderComponent()}
        detailComponent={this.getDetailComponent()}
        listComponent={this.getListComponent()}
      />
    );
  }

  onSearch = result =>
    this.setState({
      searchString: result,
      selectedProduct: '',
      detailHeader: this.props.detail_header,
    });

  onAddProduct = event => {
    this.props.createProduct(event.target.value, product => {
      this.onSelect({
        product,
        headers: this.props.detail_header,
      });
    });
  };

  getHeaderComponent = () => (
    <SubHeader
      data={{ title: 'Products' }}
      rightChildren={[
        <AddRow
          displayText="Add Product"
          addAction={this.onAddProduct}
          type="DEFAULT"
          placeHolder="Please type product name."
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

  getDetailComponent = () =>
    this.state.selectedProduct && (
      <ProductDetails
        selectedProduct={this.state.selectedProduct}
        headers={this.state.detailHeader}
        eventListener={this.eventListener}
      />
    );

  onSelect = selectedInfo =>
    this.setState({
      selectedProduct: selectedInfo ? selectedInfo.product : '',
      detailHeader: selectedInfo ? selectedInfo.headers : '',
    });

  getListComponent = () => (
    <ProductList
      searchString={this.state.searchString}
      onSelection={this.onSelect}
    />
  );

  eventListener = args => {
    if (args) {
      switch (args.event) {
        case DETAILS_VIEW_EVENT.CLOSE_DETAILS_PANEL:
        case DETAILS_VIEW_EVENT.OPEN_DETAILS_PANEL:
          this.setState({
            selectedProduct: args.data,
            detailHeader: this.props.detail_header,
          });
          break;
      }
    }
  };
}

const mapStateToProps = state => ({
  detail_header: state.products.meta_info.detail_header,
});

const mapDispatchToProps = {
  createProduct,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductPage);
