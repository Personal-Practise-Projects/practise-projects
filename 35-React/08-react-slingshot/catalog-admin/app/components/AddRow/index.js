import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './AddRow.scss';

export const TYPE = {
  DEFAULT: 'DEFAULT',
  WITH_ERROR: 'WITH_ERROR',
};

export default class AddRow extends Component {
  constructor(props) {
    super(props);
    this.addAction = this.props.addAction;
    this.type = this.props.type || TYPE.DEFAULT;
    this.displayText = this.props.displayText || 'Add Row';
    this.state = {
      errorMessage: null,
      addClasses: '',
      cancelClasses: 'd-none',
    };
  }

  handleAddRow = () => {
    this.setState({ addClasses: 'd-none', cancelClasses: '' }, () => {
      this.inputArea.value = '';
      this.inputArea.focus();
    });
  };

  handleCancelRow = () =>
    this.setState({ addClasses: '', cancelClasses: 'd-none' });

  validateTextArea = value => !!value;

  onAddAction = event => {
    // TODO merge when all implementation is changed
    if (this.validateTextArea(event.target.value)) {
      if (this.type === TYPE.DEFAULT) {
        this.addAction(event);
        this.handleCancelRow();
      } else if (this.type === TYPE.WITH_ERROR) {
        this.addAction(event, (isSuccess, message) => {
          if (isSuccess) {
            this.handleCancelRow();
          } else {
            this.setState({ errorMessage: message });
          }
        });
      }
    }
    this.setState({ errorMessage: null });
    this.handleCancelRow();
  };

  render() {
    return (
      <div className="create-area" style={styles}>
        <button
          type="button"
          className={`btn btn-link btn-add-row ${this.state.addClasses}`}
          onClick={this.handleAddRow}
        >
          <i className="icon-circle-plus" /> {this.displayText}
        </button>
        <div
          className={`create-area-wrapper position-relative ${
            this.state.cancelClasses
          }`}
        >
          <input
            type="text"
            placeholder={this.props.placeHolder}
            onBlur={this.onAddAction}
            ref={input => (this.inputArea = input)}
          />
          <button
            type="button"
            className={`btn btn-link btn-cancel-row ${
              this.state.cancelClasses
            }`}
            onClick={this.handleCancelRow}
          >
            Cancel
          </button>
        </div>
        {this.state.errorMessage && (
          <div className="create-area-validation error-wrapper">
            <span className="validation-message error-message red-error">
              {this.state.errorMessage}
            </span>
          </div>
        )}
      </div>
    );
  }
}

AddRow.propTypes = {
  addAction: PropTypes.func,
  placeHolder: PropTypes.string,
};
