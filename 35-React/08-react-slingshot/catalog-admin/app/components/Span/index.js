import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import Component Specific Styling
import './Span.scss';

class Span extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: props.message,
      className: props.className,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.message !== this.props.message) {
      this.setState({
        ...this.state,
        message: this.props.message,
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.message && Array.isArray(this.state.message) ? (
          this.state.message.map((data, index) => (
            <span key={index} className={this.state.className}>
              {data}
            </span>
          ))
        ) : (
          <span className={this.state.className}>{this.state.message}</span>
        )}
      </React.Fragment>
    );
  }
}

Span.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
    PropTypes.array.isRequired,
  ]),
  className: PropTypes.string,
};

export default Span;
