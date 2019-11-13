import React from 'react';
import { closeDropdowns } from '../dataHandler';

class MenuItemStatic extends React.Component {
  render() {
    if (this.props.item.link) {
      return (
        <a href={this.props.item.link} target="_blank">
          <div
            className="navigation-option d-flex align-items-center justify-content-center position-relative"
            onClick={() => closeDropdowns()}
          >
            <i className={`navigation-icon ${this.props.item.icon}`}/>
            <div className="navigation-tooltip">{this.props.item.title}</div>
          </div>
        </a>
      );
    }
    return <></>
  }
}

export default MenuItemStatic;
