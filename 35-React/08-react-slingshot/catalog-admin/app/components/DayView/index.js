import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { parseShotDetails } from '../CalendarView/helpers';
import CalendarLanes from '../CalendarView/CalendarLanes';
import CalendarHeader from '../CalendarHeader';
import { formatDate } from '../../helpers/common';
import {
  CALENDAR_OVERLAY_HEADER_DATE_FORMAT,
  WEEK,
} from '../../common/constants';
import { buildConditionalString } from '../../common/helpers';

function isTodayDate() {
  return (
    this.props.calendarViewType.id === WEEK &&
    new Date().getDate() === this.props.timestamp.date
  );
}

class DayView extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.shots !== nextProps.shots ||
      this.props.calendarViewType !== nextProps.calendarViewType
    );
  }

  render() {
    const slotClass = buildConditionalString(
      'day-view ',
      isTodayDate.call(this),
      'current-slot',
    );
    return (
      this.props.shots && (
        <div className="day-wrapper">
          <CalendarHeader
            timestamp={this.props.timestamp}
            shotsCount={this.props.shots.length}
            dataHandler={this.props.dataHandler}
            calendarViewType={this.props.calendarViewType}
          />
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div className={slotClass} onClick={() => this.switchToDayView()}>
            {this.getTimeSlots()}
          </div>
        </div>
      )
    );
  }

  switchToDayView = () => {
    if (this.props.calendarViewType.id === WEEK) {
      this.props.dataHandler.switchBetweenViews(this.props.timestamp);
    }
  };

  getTimeSlots = () => {
    const hoursShotMap = parseShotDetails(this.props.shots);
    let timeSlot = '';
    const slots = [];
    for (let index = 0; index < 24; index += 1) {
      timeSlot = `${index}`.length === 1 ? `0${index}` : `${index}`;
      slots.push(
        <CalendarLanes
          key={buildConditionalString(this.props.timestamp, timeSlot)}
          header={{
            title: formatDate(
              this.props.timestamp,
              CALENDAR_OVERLAY_HEADER_DATE_FORMAT,
            ),
          }}
          hour={timeSlot}
          shotList={hoursShotMap[timeSlot] || []}
          dataHandler={this.props.dataHandler}
        />,
      );
    }
    return slots;
  };
}

DayView.propTypes = {
  shots: PropTypes.array,
  calendarViewType: PropTypes.object,
  timestamp: PropTypes.object,
  dataHandler: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  // redux structure is {'16/07/2019' : [list of shots], '17/06/2017': [list of shots]}
  // to get list of shots for a particular date, convert timestamp to date in string format
  shots: state.calendar.shots[formatDate(ownProps.timestamp)] || [],
  calendarViewType: state.calendar.calendarViewType,
});

export default connect(
  mapStateToProps,
  null,
)(DayView);
