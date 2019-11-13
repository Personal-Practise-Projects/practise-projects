import React from 'react';
import { OVERLAY } from '../../common/constants';
import Carat from '../Carat/index';

// TODO useless flow need to be changed
export default class OverlayHandler {
  setEventListener = eventListener => {
    this.eventListener = eventListener;
  };

  getViewMoreShots = shots => (
    <button
      className="view-more-trigger"
      onClick={event => {
        event.stopPropagation();
        this.overlayData = shots;
        this.eventListener({ event: OVERLAY, data: true });
      }}
    >{`${shots.length - 2} More`}</button>
  );

  parseDetailsToShow = shot => (
    <li className="item">
      <Carat
        size="12px"
        color={shot.color_tag}
        className="carat"
        radius="2px"
      />
      <div className="info-wrapper">
        <h3>{shot.brand.brand_name}</h3>
        <span>{shot.shot_info.shot_number}</span>
      </div>
    </li>
  );
}
