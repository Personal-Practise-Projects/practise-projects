import React from 'react';

// Import Component Specific Styling
import './MessageBox.scss';

class MessageBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className={`message-pill ${this.props.messageType} position-relative`}
      >
        {this.props.messageText}
        <button
          type="button"
          className="btn btn-action"
          onClick={() => this.props.handleClose()}
        >
          <i className="icon-cross" />
        </button>
      </div>
    );
  }
}

export default MessageBox;
