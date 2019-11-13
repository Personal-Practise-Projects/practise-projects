import React from 'react';
import PropTypes from 'prop-types';

import './CopyToClipboard.scss';

class CopyToClipboard extends React.Component {
  copyClipBoard = () => {
    // Create a "hidden" input
    const aux = document.createElement('input');
    // Assign it the value of the specified element
    // eslint-disable-next-line react/prop-types
    aux.setAttribute('value', this.props.value);
    // Append it to the body
    document.body.appendChild(aux);
    // Highlight its content
    aux.select();
    // Copy the highlighted text
    document.execCommand('copy');
    // Remove it from the body
    document.body.removeChild(aux);
  };

  render() {
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <i
        className="copy-to-clipboard-component icon-copy"
        onClick={event => {
          event.stopPropagation();
          this.copyClipBoard();
        }}
        title="Click to copy"
      />
    );
  }
}

CopyToClipboard.propType = {
  value: PropTypes.string.isRequired,
};

export default CopyToClipboard;
