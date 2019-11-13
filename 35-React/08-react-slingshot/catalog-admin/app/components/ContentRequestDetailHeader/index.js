import React from 'react';

import DropDown from '../DropDown';
import MenuDropDown from '../../form-components/MenuDropDown/index';

import { headerParser, menuParser } from './parser';
import styles from './ContentRequestDetailHeader.scss';

export default class ContentRequestDetailHeader extends React.Component {

  render() {
    const headerData = headerParser(this.props.contentRequest);
    const menu_items = menuParser(this.props.contentRequest);
    return (
      <div
        className={`splitpage-drawer-header ${
          this.props.classes
        } d-flex align-items-center justify-content-between`}
        style={styles}
      >
        <div className="header-left text-left">
          <div className="content-request-meta d-flex align-items-center">
            <h4>{`CR_${this.props.contentRequest.id}`}</h4>
          </div>
          <div className="content-request-controls d-flex align-items-center">
            <DropDown
              key={this.props.dataHandler.id}
              header={headerData.status}
              dataHandler={this.props.dataHandler}
            />
          </div>
        </div>
        <div className="header-right d-flex align-items-center justify-content-end">
          <MenuDropDown items={menu_items} id={this.props.contentRequest.id}>
            <i className="icon-vertical-hamburger" />
          </MenuDropDown>
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
