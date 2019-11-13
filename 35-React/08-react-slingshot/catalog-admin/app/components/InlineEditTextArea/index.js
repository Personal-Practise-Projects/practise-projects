import React, { Component } from 'react';
import PropTypes from 'prop-types';

import InlineEditable from 'react-inline-editable-field';

// Import Component Specific Styling
import './InlineEditTextArea.scss';

class InlineEditTextArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: props.message,
    };
  }

  onDataChanged = (isChanged, value) => {
    if (isChanged) {
      this.setState({ message: value });
    }
  };

  render() {
    return (
      <InlineEditable
        content={this.state.message}
        inputType="textarea"
        onBlur={(val, isChanged) => {
          this.onDataChanged(isChanged, val);
        }}
      />
    );
  }
}

InlineEditTextArea.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default InlineEditTextArea;
