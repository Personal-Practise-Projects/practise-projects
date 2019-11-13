import React from 'react';

import DropDown from '../../form-components/DropDown';
import ProductList from '../ProductList';
import PropList from '../PropList';
import ProductDetails from '../ProductDetails';
import { DETAILS_VIEW_EVENT } from '../ShotDetailsView/constants';
import PropDetail from '../PropDetail';
import store from '../../store';

export const inventoryDropdownOptions = [
  { id: 'PRODUCT', title: 'Products' },
  { id: 'PROP', title: 'Props' },
];

export default class InventoryHandler {
  constructor(eventListener) {
    this.eventListener = eventListener;
    this.selectedOption = 'PRODUCT';
  }

  getHeader(handleInventorySwitch) {
    return this.getAddDropDown(handleInventorySwitch);
  }

  getAddDropDown = handleInventorySwitch => (
    <DropDown
      title="Select inventory category"
      list={inventoryDropdownOptions}
      selected={inventoryDropdownOptions[0]}
      header={{}}
      id="inventoryListDropdown"
      updateDetailsOnBlur={(updatedObject, event) => {
        this.selectedOption = updatedObject.value;
        handleInventorySwitch(event);
      }}
    />
  );

  getList = (props) => {
    switch (this.selectedOption) {
      case 'PRODUCT':
        return <ProductList onSelection={this.onSelect} {...props}/>;
      case 'PROP':
        return <PropList onSelection={this.onSelect} {...props}/>;
    }
  };

  getDetail = () => {
    switch (this.selectedOption) {
      case 'PRODUCT':
        return (
          <ProductDetails
            selectedProduct={this.selectedInventoryInfo.product}
            headers={store.getState().products.meta_info.detail_header}
            eventListener={this.eventListener}
          />
        );
      case 'PROP':
        return (
          <PropDetail
            selectedProp={this.selectedInventoryInfo.prop}
            headers={store.getState().props.metaInfo.detail_header}
            eventListener={this.eventListener}
          />
        );
    }
  };

  onSelect = selectedInventory => {
    this.selectedInventoryInfo = selectedInventory;
    this.eventListener({ event: DETAILS_VIEW_EVENT.OPEN_DETAILS_PANEL });
  };
}
