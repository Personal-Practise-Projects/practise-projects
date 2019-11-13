import React from 'react';
import PropTypes from 'prop-types';
import { DONE, FAILED } from '../../common/constants';
import ReadOnlyComponentRenderFactory from "../ComponentFactory/readOnlyComponentFactory";

export const MODE = {
  DEFAULT: 'DEFAULT',
  UN_CHANGEABLE: 'UN_CHANGEABLE',
};

/** *
 * Provide component mode either it can be default or non Changeable once value is provide can't be modified
 */
class Input extends React.Component {
  constructor(props) {
    super(props);
    this.existingValue = props.dataHandler.getExistingData(props.header);
    const extraConfig = props.dataHandler.getExtraConfig ? props.dataHandler.getExtraConfig(props.header) : {};
    this.mode = props.header.mode || MODE.DEFAULT;
    this.state = {
      value: this.existingValue,
      errorMessage: null,
      ...extraConfig
    };
  }

  render() {
    const { type, name, placeholder, title, classes } = this.props.header;
    if (this.state.readonly) {
      return ReadOnlyComponentRenderFactory.component(
        this.props.header.type, 0, title, this.state.value || this.state.readPlaceholder
      )
    }
    return (
      <div
        className={`input-wrapper ${this.state.errorMessage &&
        'error-wrapper'}`}
      >
        <label className="input-label d-block">{title}</label>
        <input
          type={type}
          name={name}
          min={this.props.header.min}
          readOnly={this.mode === MODE.UN_CHANGEABLE && this.existingValue}
          value={this.state.value || ''}
          placeholder={placeholder}
          className={`input-field d-block ${classes} `}
          onBlur={this.updateDetailsOnBlur}
          onChange={this.onChangeValue}
        />
        {
          this.state.errorMessage && (
            <span className="validation-message error-message red-error">
            {this.state.errorMessage}
          </span>)
        }
      </div>
    );
  }

  updateDetailsOnBlur = () => {
    const value = this.state.value;

    if (value !== this.existingValue) {
      const header = this.props.header;
      this.props.dataHandler.onUpdate(header, value, (status, payload) => {
        if (status === DONE) {
          this.existingValue = value;
          this.setState({ value: this.existingValue, errorMessage: null });
        } else if (status === FAILED) {
          this.setState({ errorMessage: payload[header.data_key][0] });
        }
      });
    }
  };

  onChangeValue = event => {
    this.setState({
      value: event.target.value,
    });
  };
}

Input.propTypes = {
  header: PropTypes.object.isRequired,
  dataHandler: PropTypes.object.isRequired,
};

export default Input;
