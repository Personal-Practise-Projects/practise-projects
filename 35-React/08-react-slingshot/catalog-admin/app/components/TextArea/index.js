import React from 'react';
import PropTypes from 'prop-types';

import ReadOnlyComponentRenderFactory from "../ComponentFactory/readOnlyComponentFactory";
import { DONE, FAILED } from '../../common/constants';

export default class TextArea extends React.Component {
  constructor(props) {
    super(props);
    this.existingValue = props.dataHandler.getExistingData(props.header);
    const extraConfig = props.dataHandler.getExtraConfig ? props.dataHandler.getExtraConfig(props.header) : {};
    this.state = {
      value: this.existingValue,
      errorMessage: null,
      disabled: false,
      ...extraConfig,
    };
  }

  render() {
    const { name, placeholder, title, readonly } = this.props.header;
    if (this.state.readonly) {
      return ReadOnlyComponentRenderFactory.component(
        this.props.header.type, 0, title, this.state.value || this.state.readPlaceholder
      )
    }
    return (
      <div className="input-wrapper">
        <label className="input-label d-block">{title}</label>
        <textarea
          name={name}
          value={this.state.value}
          placeholder={placeholder}
          className="input-field d-block"
          onBlur={this.updateDetailsOnBlur}
          onChange={this.onChange}
          readOnly={readonly || false}
        />
        {this.state.errorMessage && (
          <span className="validation-message error-message red-error">
            {this.state.errorMessage}
          </span>
        )}
      </div>
    );
  }

  updateDetailsOnBlur = () => {
    const newValue = this.state.value;

    if (newValue !== this.existingValue) {
      const header = this.props.header;
      this.props.dataHandler.onUpdate(header, newValue, (status, payload) => {
        if (status === DONE) {
          this.existingValue = newValue;
          this.setState({ value: this.existingValue, errorMessage: null });
        } else if (status === FAILED) {
          this.setState({ errorMessage: payload[header.data_key][0] });
        }
      });
    }
  };

  onChange = event => this.setState({ value: event.target.value });
}

TextArea.propTypes = {
  header: PropTypes.object.isRequired,
  dataHandler: PropTypes.object.isRequired,
};
