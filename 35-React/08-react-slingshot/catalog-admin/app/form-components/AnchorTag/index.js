import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Import Component Specific Styling
import './AnchorTag.scss';

class AnchorTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      targetBlank: props.targetBlank ? '_blank' : '',
    };
  }

  render() {
    return (
      <div className={this.props.className || ''}>
        <Link
          to={this.props.message.link}
          target={this.state.targetBlank}
          onClick={event => event.stopPropagation()}
        >
          {this.props.message.title}
        </Link>
      </div>
    );
  }
}

AnchorTag.propTypes = {
  message: PropTypes.object,
  targetBlank: PropTypes.bool,
  className: PropTypes.string,
};

export default AnchorTag;
