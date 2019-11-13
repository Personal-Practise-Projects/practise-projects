import React from 'react';

import { CALENDAR_HEADER_DATE_FORMAT, DAY } from '../../common/constants';
import { formatDate } from '../../helpers/common';

export default function CalendarHeader(props) {
  return (
    <div className="header">
      {props.calendarViewType.id === DAY && (
        <p
          className="back-to-weekview"
          onClick={() => props.dataHandler.switchBetweenViews()}
        >
          <i className="icon-arrow-left" />
          Week view
        </p>
      )}
      <h3>{formatDate(props.timestamp, CALENDAR_HEADER_DATE_FORMAT)}</h3>
      {props.shotsCount > 0 && <p>{props.shotsCount} Shots</p>}
    </div>
  );
}
