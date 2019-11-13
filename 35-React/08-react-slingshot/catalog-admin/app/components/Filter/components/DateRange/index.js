import React from 'react';

import {
  COMMON_ACTIONS,
  DATE_PICKER_FORMAT,
} from '../../../../common/constants';
import DatePicker from '../../../DatePicker';

import './DateRange.scss';

export default class DateRange extends React.Component {
  constructor(props) {
    super(props);
    const existingData = this.props.controller.getExistingData;
    this.state = {
      fromDate: existingData({ uid: this.props.controller.fromKey }),
      toDate: existingData({ uid: this.props.controller.toKey }),
    };
  }

  render() {
    return (
      <div className="date-range-component">
        <h3 className="title">
          {this.props.controller.filterConfig.select_title}
        </h3>
        <div className="wrapper">
          <DatePicker
            key={`${this.props.timestamp || new Date().getTime()}_from_date`}
            header={{
              title: 'From',
              uid: this.props.controller.fromKey,
              placeholder: 'mm/dd/yyyy',
              isClearable: false,
              showTimePicker: false,
              dateFormat: DATE_PICKER_FORMAT,
              selected: this.state.fromDate,
            }}
            minDate={new Date(0)}
            dataHandler={this.props.controller}
          />
          <DatePicker
            key={`${this.props.timestamp || new Date().getTime()}_to_date`}
            header={{
              title: 'To',
              uid: this.props.controller.toKey,
              placeholder: 'mm/dd/yyyy',
              isClearable: false,
              showTimePicker: false,
              dateFormat: DATE_PICKER_FORMAT,
              selected: this.state.toDate,
            }}
            disabled={!this.state.fromDate}
            minDate={this.state.fromDate}
            dataHandler={this.props.controller}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.props.controller.setEventListener(this.eventListener);
  }

  componentWillUnmount() {
    this.props.controller.setEventListener(null);
  }

  eventListener = type => {
    if (type === COMMON_ACTIONS.REFRESH) {
      const existingData = this.props.controller.getExistingData;
      this.setState({
        fromDate: existingData({ uid: this.props.controller.fromKey }),
        toDate: existingData({ uid: this.props.controller.toKey }),
      });
    }
  };
}
