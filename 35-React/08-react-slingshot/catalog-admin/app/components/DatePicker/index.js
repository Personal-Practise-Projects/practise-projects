import React from 'react';
import PropTypes from 'prop-types';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { formatDateToString, getDateTimeInUTC } from '../../helpers/common';
import {
  DATE_FORMAT,
  DATE_TIME_PICKER_FORMAT,
  DONE,
  FAILED,
} from '../../common/constants';
import ReadOnlyComponentRenderFactory from '../ComponentFactory/readOnlyComponentFactory';

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.existingValue = props.dataHandler.getExistingData(props.header);
    const extraConfig = props.dataHandler.getExtraConfig
      ? props.dataHandler.getExtraConfig(props.header)
      : {};
    this.state = {
      selected: this.existingValue,
      errorMessage: null,
      ...extraConfig,
    };
  }

  render() {
    const {
      placeholder,
      title,
      isClearable,
      showTimePicker,
      dateFormat,
    } = this.props.header;

    const opts = {};
    if (this.state.selected) {
      opts.selected = this.state.selected;
    }
    if (this.props.header.selected) {
      opts.selected = this.props.header.selected;
    }
    if (this.props.customInput) opts.customInput = this.props.customInput;

    opts.isClearable = isClearable;
    opts.showTimeSelect = showTimePicker;

    if (this.state.readonly) {
      return ReadOnlyComponentRenderFactory.component(
        this.props.header.type,
        0,
        title,
        formatDateToString(this.state.selected, DATE_FORMAT) ||
          this.state.readPlaceholder,
      );
    }
    return (
      <div
        className={`input-wrapper${
          this.state.errorMessage ? ' error-wrapper' : ''
        }`}
      >
        <label className="input-label">{title}</label>
        <ReactDatePicker
          {...opts}
          placeholderText={placeholder}
          onChange={this.handleChange}
          minDate={this.props.minDate ? this.props.minDate : new Date()}
          timeFormat="HH:mm"
          timeIntervals={60}
          dateFormat={dateFormat || DATE_TIME_PICKER_FORMAT}
          timeCaption="Time"
          disabled={this.props.disabled ? this.props.disabled : false}
          onKeyDown={this.onKeyDown}
          shouldCloseOnSelect={false}
          onClickOutside={() => this.updateDetailsOnBlur(this.state.selected)}
        />
        {this.state.errorMessage && (
          <span className="validation-message error-message red-error">
            {this.state.errorMessage}
          </span>
        )}
      </div>
    );
  }

  onKeyDown = event => event.preventDefault();

  handleChange = date => {
    this.setState({
      selected: date,
    });

    if (!date) this.updateDetailsOnBlur(null);
  };

  updateDetailsOnBlur = selectedDate => {
    const value = getDateTimeInUTC(selectedDate);
    const header = this.props.header;
    this.props.dataHandler.onUpdate(header, value, (status, payload) => {
      if (status === DONE) {
        this.existingValue = value;
        this.setState({ value: this.existingValue, errorMessage: null });
      } else if (status === FAILED) {
        this.setState({ errorMessage: payload[header.data_key][0] });
      }
    });
  };
}

DatePicker.propTypes = {
  header: PropTypes.object.isRequired,
  dataHandler: PropTypes.object.isRequired,
};

export default DatePicker;
