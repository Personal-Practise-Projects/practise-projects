import React from 'react';

import { OVERLAY } from '../../common/constants';
import styles from './Overlay.scss';

export default function Overlay(props) {
  return (
    <div className="view-more-modal" style={styles}>
      <i
        className="icon-cross"
        onClick={event => {
          event.stopPropagation();
          props.onClose({ event: OVERLAY, data: false });
        }}
      />
      <h2>{props.header.title}</h2>
      <ul className="list">
        {props.dataHandler.overlayData.map(data =>
          props.dataHandler.parseDetailsToShow(data),
        )}
      </ul>
    </div>
  );
}
