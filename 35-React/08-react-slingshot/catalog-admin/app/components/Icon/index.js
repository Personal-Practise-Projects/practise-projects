import React from 'react';

import './Icon.scss';

export function Icon(props) {
  return (
    <span className={`icon-wrap ${props.disabled || ''}`} {...props.extraProps}>
      <i
        className={`${props.className} ${props.disabled || ''}`}
        onClick={event => {
          event.stopPropagation();
          props.dataHandler.onUpdate(props.header, props.header.updateWithData);
        }}
      />
    </span>
  );
}
