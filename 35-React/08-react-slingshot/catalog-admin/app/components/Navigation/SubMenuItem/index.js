import React from 'react';
import { NavLink } from 'react-router-dom';
import { createRouterLink } from '../dataHandler';

class SubMenuItem extends React.Component {
  render() {
    return (
      <NavLink
        exact
        activeClassName="navigation-active-link"
        to={createRouterLink(this.props.item.link)}
      >
        <div className="navigation-submenu-item">{this.props.item.title}</div>
      </NavLink>
    );
  }
}

export default SubMenuItem;
