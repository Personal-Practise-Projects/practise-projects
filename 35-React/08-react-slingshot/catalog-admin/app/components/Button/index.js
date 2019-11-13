import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Button.scss';

export default class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: props.isDisabled || false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        ...this.state,
        isDisabled: this.props.isDisabled || false,
      });
    }
  }

  handleClick = event => {
    this.setState({ ...this.state, isDisabled: true }, () => {
      if (this.props.onClick) {
        this.props.onClick(event);
      }
      this.setState({ ...this.state, isDisabled: false });
    });
  };

  render() {
    return (
      <React.Fragment>
        <button
          type="button"
          className={this.props.className}
          onClick={this.handleClick}
          disabled={this.state.isDisabled}
          style={styles}
        >
          {this.props.displayElement}
        </button>
      </React.Fragment>
    );
  }
}

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  displayElement: PropTypes.any,
  isDisabled: PropTypes.bool,
};
