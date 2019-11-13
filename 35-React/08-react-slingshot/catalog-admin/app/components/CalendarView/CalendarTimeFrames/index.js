import React from 'react';

export default class CalendarTimeFrames extends React.Component {
  render() {
    return Array.apply(0, Array(24)).map((value, index) => (
      <div className="timeframe" key={index}>
        {`${index}`.length === 1 ? `0${index}:00` : `${index}:00`}
      </div>
    ));
  }
}
