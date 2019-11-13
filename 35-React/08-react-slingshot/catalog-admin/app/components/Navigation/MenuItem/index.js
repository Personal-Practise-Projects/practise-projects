import React from 'react';
import { NavLink } from 'react-router-dom';
import { createRouterLink, closeDropdowns } from '../dataHandler';

class MenuItem extends React.Component {
  render() {
    return (
      <NavLink
        exact
        activeClassName="navigation-active"
        to={createRouterLink(this.props.item.link)}
      >
        <div
          className="navigation-option d-flex align-items-center justify-content-center position-relative"
          onClick={() => closeDropdowns()}
        >
          <i className={`navigation-icon ${this.props.item.icon}`} />
          <div className="navigation-tooltip">{this.props.item.title}</div>
        </div>
      </NavLink>
    );
  }
}

export default MenuItem;
