import React from 'react';
import PropTypes from 'prop-types';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { getDateTimeInLocalTimeZone, getDateTimeInUTC, } from '../../../helpers/common';
import { DATE_TIME_FORMAT } from '../../../common/constants';

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClearable: true,
      showTimePicker: true,
      selected: props.value
        ? getDateTimeInLocalTimeZone(this.props.value.timestamp)
        : '',
    };
  }

  // TODO not good practice changes
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.setState({
        ...this.state,
        selected: this.props.value
          ? getDateTimeInLocalTimeZone(this.props.value.timestamp)
          : '',
      });
    }
  }

  render() {
    const { title, placeholder } = this.props.header;

    const opts = {};
    if (this.state.selected) {
      opts.selected = this.state.selected;
    }
    if (this.props.customInput) {
      opts.customInput = this.props.customInput;
    }

    opts.isClearable =
      this.props.isClearable === false ? false : this.state.isClearable;
    opts.showTimeSelect =
      this.props.showTimePicker === false ? false : this.state.showTimePicker;

    return (
      <div className="input-wrapper">
        <label className="input-label d-block">{title}</label>
        <ReactDatePicker
          {...opts}
          placeholderText={placeholder}
          onChange={this.handleChange}
          minDate={new Date()}
          timeFormat="HH:mm"
          timeIntervals={60}
          dateFormat={this.props.dateFormat || DATE_TIME_FORMAT}
          timeCaption="Time"
          onKeyDown={this.onKeyDown}
          shouldCloseOnSelect={false}
          onClickOutside={() => this.updateDetailsOnBlur(this.state.selected)}
        />
      </div>
    );
  }

  onKeyDown = event => {
    event.preventDefault();
  };

  handleChange = date => {
    this.setState({ selected: date });
    if (!date) this.updateDetailsOnBlur(null);
  };

  updateDetailsOnBlur = selectedDate => {
    const date = getDateTimeInUTC(selectedDate);
    const scheduledOn = {
      timestamp: date,
    };
    const updatedObject = {
      data_key: this.props.header.data_key,
      value: scheduledOn,
      type: this.props.header.type,
    };

    this.props.updateDetailsOnBlur(updatedObject);
  };
}

DatePicker.propTypes = {
  selected: PropTypes.string,
};

export default DatePicker;
