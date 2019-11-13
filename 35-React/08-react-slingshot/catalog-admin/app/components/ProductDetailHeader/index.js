import React from 'react';

import { productHeaderParser } from './parser';
import DropDown from '../DropDown';

export default class ProductDetailHeader extends React.Component {
  render() {
    const headerData = productHeaderParser(this.props.product);
    return (
      <div
        className={`splitpage-drawer-header ${
          this.props.classes
        } d-flex align-items-center justify-content-between`}
      >
        <div className="header-left text-left">
          <div className="shot-meta d-flex align-items-center">
            <h4>{`PRODUCT-${this.props.product.id}`}</h4>
          </div>
          <div className="shot-controls d-flex align-items-center">
            <DropDown
              key={`status-${this.props.product.id}`}
              header={headerData.status}
              dataHandler={this.props.dataHandler}
            />
          </div>
        </div>
        <div className="header-right d-flex align-items-center justify-content-end">
          <button
            type="button"
            className="btn btn-close"
            onClick={this.props.onClick}
          >
            <i className="icon-cross" />
          </button>
        </div>
      </div>
    );
  }
}
