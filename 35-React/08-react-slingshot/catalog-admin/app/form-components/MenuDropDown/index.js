import React from 'react';
import PropTypes from 'prop-types';

import items from './menubuilder';

class MenuDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { menuOpen: false };
  }

  onClick = () => {
    this.setState(prevState => ({ menuOpen: !prevState.menuOpen }));
  };

  handleClickOutside = () => {
    this.setState({ menuOpen: false });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.setState({ menuOpen: false });
    }
  }

  render() {
    const { menuOpen } = this.state;
    const classname = this.props.className ? this.props.className : '';
    return (
      <div
        className={`menu-dropdown position-relative ${
          menuOpen ? 'expanded-dropdown' : 'collapsed-dropdown'
        } ${classname}`}
        onBlur={this.handleClickOutside}
      >
        <button
          className="dropdown-trigger"
          onClick={this.onClick}
          type="button"
        >
          {this.props.children}
        </button>
        <div className="dropdown-drawer">
          {this.props.items.map((item, index) => items(item, index))}
        </div>
      </div>
    );
  }
}

MenuDropDown.defaultProps = {
  items: [],
};

MenuDropDown.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  children: PropTypes.node,
  items: PropTypes.array,
};

export default MenuDropDown;
