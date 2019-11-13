import React from 'react';
import { connect } from 'react-redux';
import { DataHandler } from './dataHandler';
import ComponentRenderFactory from '../ComponentFactory';
import { DETAILS_VIEW_EVENT } from '../ShotDetailsView/constants';
import { updateProduct } from '../../actions/productActions';
import {
  closeContentWidget,
  openContentWidget,
} from '../../containers/BasePage/actions';
import { CONTENT_REQUEST_DETAILS_LISTS } from '../../common/constants';

import ProductDetailHeader from '../ProductDetailHeader/index';

class ProductDetails extends React.Component {
  render() {
    this.dataHandler = new DataHandler(
      this.props.selectedProduct,
      this.props.updateProduct,
      this.eventListener,
    );
    return (
      <div className="splitpage-drawer animated slideInRight">
        <ProductDetailHeader
          product={this.props.selectedProduct}
          onClick={this.closePanel}
          dataHandler={this.dataHandler}
          classes="content-request-header"
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
    if (args && args.event) {
      switch (args.event) {
        case DETAILS_VIEW_EVENT.CLOSE_IMAGE_WIDGET:
          this.props.closeContentWidget();
          this.setState({});
          break;
        case DETAILS_VIEW_EVENT.OPEN_IMAGE_WIDGET:
          this.props.openContentWidget(args.uploadWidget);
          this.setState({});
      }
    }
    this.props.eventListener(args);
  };

  closePanel = () => {
    this.props.eventListener({
      event: DETAILS_VIEW_EVENT.CLOSE_DETAILS_PANEL,
      type: CONTENT_REQUEST_DETAILS_LISTS.PRODUCT_TYPE,
      data: null,
    });
  };
}

const mapDispatchToProps = {
  updateProduct,
  openContentWidget,
  closeContentWidget,
};

export default connect(
  null,
  mapDispatchToProps,
)(ProductDetails);
