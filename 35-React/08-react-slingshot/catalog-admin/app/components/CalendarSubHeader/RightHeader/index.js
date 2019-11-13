import React from 'react';

import { Icon } from '../../Icon';
import { DECREMENT, INCREMENT } from '../../../common/constants';
import ButtonGroup from '../../../form-components/ButtonGroup';

export default function RightHeader(props) {
  return (
    <React.Fragment>
      <div className="date">{props.dataHandler.getDateDetailsToShow()}</div>
      <div className="icon-wrapper">
        <Icon
          className={`${
            props.dataHandler.disableArrow() ? 'disabled' : ''
          } icon icon-caret-left`}
          dataHandler={props.dataHandler}
          header={{ uid: DECREMENT }}
        />
        <Icon
          className="icon icon-caret-right"
          dataHandler={props.dataHandler}
          header={{ uid: INCREMENT }}
        />
      </div>
      <ButtonGroup
        classes="calendar-toggle"
        header={{ uid: '#calendarButtonGroup' }}
        dataHandler={props.dataHandler}
      />
    </React.Fragment>
  );
}
