import React from 'react';
import InlineEdit from 'react-edit-inline2';
import PropTypes from 'react-proptypes';

// Import Component Specific Styling
import './InlineEditTextBox.scss';

class InlineEditTextBox extends React.Component {
  render() {
    return (
      <InlineEdit
        activeClassName="input-inline"
        text={this.props.message}
        paramName="message"
      />
    );
  }
}

InlineEditTextBox.propTypes = {
  message: PropTypes.string,
};

export default InlineEditTextBox;
