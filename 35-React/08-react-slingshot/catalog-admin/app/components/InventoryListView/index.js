import React from 'react';

import { styles } from './InventoryListView.scss';

export default class InventoryListView extends React.Component {
  handleInventorySwitch = () => {
    this.forceUpdate();
  };

  render() {
    return (
      <div className="inventory-lists position-relative" style={styles}>
        <div className="inventory-lists-header d-flex align-items-center justify-content-end">
          {this.props.dataHandler.getHeader(this.handleInventorySwitch)}
        </div>
        <div className="inventory-lists-content">
          {this.props.dataHandler.getList({contentRequestId:this.props.contentRequestId})}
        </div>
      </div>
    );
  }
}
