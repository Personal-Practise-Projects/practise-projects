import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Span extends Component {
  constructor(props) {
    super(props);
    this.existingValue = props.dataHandler.getExistingData(props.header);
    this.state = {
      value: this.existingValue,
    };
  }

  render() {
    return (
      <div className="input-wrapper">
        <label className="input-label d-block">{this.props.header.title}</label>
        <span>{this.state.value}</span>
      </div>
    );
  }
}

Span.propTypes = {
  header: PropTypes.object.isRequired,
  dataHandler: PropTypes.object.isRequired,
};
