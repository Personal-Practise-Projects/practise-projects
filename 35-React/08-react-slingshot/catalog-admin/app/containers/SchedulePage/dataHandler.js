import React from 'react';

import { SchedulePageSearchHandler } from './searchHandler';
import {
  DATE_PICKER_FORMAT,
  DAY,
  DECREMENT,
  INCREMENT,
  WEEK,
} from '../../common/constants';
import {
  addDaysInTimestamp,
  compareDate,
  getCalendarButtonGroup,
  getDateRangeDetails,
  getDateTimeInUTC,
  getMinDateForDayView,
  getStartDateOfWeek,
  lessDaysInTimestamp,
} from '../../helpers/common';
import LabeledDatePicker from '../../components/LabeledDatePicker';
import DatePicker from '../../components/DatePicker';

export const CALENDAR_BUTTON_GROUP = getCalendarButtonGroup();
export default class ScheduleDataHandler {
  constructor(props, searchHandler) {
    this.props = { ...props };
    this.searchHandler = searchHandler;
    this._draggedShot = { info: null, source: null, destination: null };
    this._droppedOverShot = { id: null };
    this._shotsObject = { bundling: null, calendar: null };
  }

  updateProps = props => {
    Object.assign(this.props, { ...props });
  };

  setShotsDict = shotsObjectDict => {
    this._shotsObject = shotsObjectDict;
  };

  getSearchHandler = () => new SchedulePageSearchHandler(this.searchHandler);

  getExistingData = header => {
    switch (header.uid) {
      case '#datePicker':
        return this.props.timestamp * 1000 || new Date().getTime();
      case '#calendarButtonGroup':
        return this.props.calendarViewType;
      default:
        return '';
    }
  };

  getButtonGroups = callback => {
    callback(CALENDAR_BUTTON_GROUP);
  };

  onUpdate = (header, updateWithData, callback) => {
    switch (header.uid) {
      case '#datePicker':
        this.props.updateTimeStampAndSelectedView({
          calendarViewType: CALENDAR_BUTTON_GROUP[0],
          timestamp: updateWithData ? updateWithData / 1000 : null,
        });
        break;
      case '#todayPicker':
        this.props.updateTimeStampAndSelectedView({
          calendarViewType: CALENDAR_BUTTON_GROUP[0],
          timestamp: parseInt(getDateTimeInUTC(new Date()) / 1000),
        });
        break;
      case DECREMENT:
      case INCREMENT:
        let timestampSelected;
        if (header.uid === DECREMENT) {
          timestampSelected = lessDaysInTimestamp(
            this.props.timestamp * 1000,
            this.props.calendarViewType.range,
          ).unix();
        } else {
          timestampSelected = addDaysInTimestamp(
            this.props.timestamp * 1000,
            this.props.calendarViewType.range,
          ).unix();
        }
        this.props.updateTimeStampAndSelectedView({
          calendarViewType: this.props.calendarViewType,
          timestamp: timestampSelected,
        });
        break;
      default: {
        const selectedTimeStamp =
          updateWithData.id === WEEK
            ? getStartDateOfWeek(this.props.timestamp)
            : getMinDateForDayView(this.props.timestamp);
        this.props.updateTimeStampAndSelectedView({
          calendarViewType: updateWithData,
          timestamp: selectedTimeStamp,
        });
        break;
      }
    }
  };

  getDateDetailsToShow = () => {
    switch (this.props.calendarViewType.id) {
      case DAY:
        return (
          <DatePicker
            key={this.props.timestamp || new Date().getTime()}
            customInput={<LabeledDatePicker />}
            header={{
              title: '',
              uid: '#datePicker',
              placeholder: '',
              isClearable: false,
              showTimePicker: false,
              dateFormat: DATE_PICKER_FORMAT,
            }}
            dataHandler={this}
          />
        );
      case WEEK:
        return getDateRangeDetails(this.props.timestamp * 1000);
    }
  };

  setDraggedShotInfo = (shotId, source) => {
    this._draggedShot.info = this.getShot(shotId, source);
    this._draggedShot.source = source;
  };

  setDraggedShotDestination = destination =>
    (this._draggedShot.destination = destination);

  getDraggedShotDetail = () => this._draggedShot;

  setDroppedOverShotId = id => (this._droppedOverShot.id = id);

  getDroppedOverShotInfo = () => this._droppedOverShot;

  getShot = (shotId, source) => this._shotsObject[source][shotId];

  clearAll = () => {
    this._draggedShot = {
      info: null,
      source: null,
      destination: null,
    };
    this._droppedOverShot = {
      id: null,
    };
  };

  disableArrow = () =>
    this.props.calendarViewType.id === DAY &&
    compareDate(new Date(this.props.timestamp * 1000)) <= 0;
}
