import React from 'react';

import './TitledDescriptionIcon.scss';

export function TitledDescriptionIcon({slide, dataHandler}) {
  return (
    <div className="titled-description-icon-component">
      <div className="wrapper">
        <img className="icon" src={slide.url} alt="" />
        <div className="title">{slide.field_name}</div>
      </div>
      <div className="description">
        {dataHandler.getComponent(slide)}
      </div>
    </div>
  );
}
