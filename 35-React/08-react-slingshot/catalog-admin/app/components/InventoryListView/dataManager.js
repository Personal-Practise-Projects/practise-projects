import React from 'react';
import InventoryListView from './index';

import InventoryHandler from './dataHandler';

export default class InventoryDataManager {
  constructor(eventListener) {
    this.eventListener = eventListener;
    this.selectedDropDown = 'PRODUCT';
    this.dataHandler = new InventoryHandler(eventListener);
  }

  onDropdownSwitch = selectedDropDown => {
    this.dataHandler.selectedOption = selectedDropDown.value;
  };

  getRenderingList = (props) => (
    <InventoryListView
      dataHandler={this.dataHandler}
      onSelect={this.onSelect}
      {...props}
    />
  );

  getParentStyleClass = () => 'splitpage-heightened splitpage-noicons';

  getDetailComponent = () => this.dataHandler.getDetail();
}
