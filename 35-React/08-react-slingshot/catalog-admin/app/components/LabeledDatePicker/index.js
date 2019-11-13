import React from 'react';

// Import Component Specific Styling
import './LabeledDatePicker.scss';

export default class LabeledDatePicker extends React.Component {
  render() {
    return (
      <button className="schedule-date-trigger" onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}
