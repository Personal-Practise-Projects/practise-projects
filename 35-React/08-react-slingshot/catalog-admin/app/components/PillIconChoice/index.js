import React from 'react';

import './PillIconChoice.scss';

export default function PillIconChoice(props) {
  return (
    <div
      className={`pill-with-icon-and-text-component ${
        props.item.selected ? 'selected' : ''
      }`}
      onClick={() =>
        props.controller.onAction(
          props.header,
          props.item.selected ? '' : props.id,
        )
      }
    >
      <i className={`icon ${props.item.childClass}`} />
      <div className="text">{props.item.title}</div>
    </div>
  );
}
