import React from 'react';

class SubMenuItemStatic extends React.Component {
  render() {
    return (
      <a href={this.props.item.link} target="_blank">
        <div className="navigation-submenu-item">{this.props.item.title}</div>
      </a>
    );
  }
}

export default SubMenuItemStatic;
