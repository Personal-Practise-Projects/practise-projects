import React from 'react';

import './CounterInfo.scss';

export function CounterInfo(props) {
  const counterInfo = props.data;
  const displayString = `${counterInfo} ${counterInfo === 1 ? 'day' : 'days'}`;
  return (
    counterInfo && (
      <div className="counter-info-component">
        <i className="icon icon-clock" />
        <span className="text">{displayString}</span>
      </div>
    )
  );
}
