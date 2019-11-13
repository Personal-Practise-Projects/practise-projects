import React from 'react';
import PropTypes from 'prop-types';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { getDateTimeInUTC } from '../../helpers/common';
import { DATE_TIME_PICKER_FORMAT, DONE, FAILED } from '../../common/constants';

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.existingValue = props.dataHandler.getExistingData(props.header);
    this.state = {
      selected: this.existingValue,
      errorMessage: null,
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
    if (this.props.customInput) opts.customInput = this.props.customInput;

    opts.isClearable = isClearable;
    opts.showTimeSelect = showTimePicker;

    return (
      <div
        className={`datepicker-component input-wrapper ${
          this.state.errorMessage ? 'error-wrapper' : ''
        }`}
      >
        {title && <label className="input-label">{title}</label>}
        <ReactDatePicker
          {...opts}
          placeholderText={placeholder}
          onChange={this.handleChange}
          timeFormat="HH:mm"
          timeIntervals={60}
          dateFormat={dateFormat || DATE_TIME_PICKER_FORMAT}
          timeCaption="Time"
          onKeyDown={this.onKeyDown}
          shouldCloseOnSelect={this.props.shouldCloseOnSelect || true}
          popperPlacement={this.props.popperPlacement || ''}
          popperModifiers={this.props.popperModifiers || ''}
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
    this.setState(
      {
        selected: date,
      },
      () => this.updateDetailsOnBlur(this.state.selected),
    );
  };

  updateDetailsOnBlur = selectedDate => {
    const value = getDateTimeInUTC(selectedDate);
    const { header } = this.props;
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
