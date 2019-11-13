import React from 'react';

import LightBoxImage from '../LightBoxImage';

import './ImageSelect.scss';

export default function ImageSelect(props) {
  const classname = `image-select-component ${
    props.item.selected ? 'selected' : ''
  } ${props.item.readonly ? 'disabled' : ''} ${props.item.classes || ''}`;
  return (
    <div
      className={classname}
      onClick={() =>
        props.controller &&
        props.controller.onAction(
          props.header,
          props.item.selected ? '' : props.id,
        )
      }
    >
      <div className="image-wrapper">
        <LightBoxImage
          featureReference={
            props.controller && props.controller.buildLightBoxFeatures
          }
          url={props.item.images.url}
          thumbnail={getThumbnail(props.controller, props.item.images)}
          compressUrl={props.item.images.url}
          alt="image"
          className="image"
          metaInfo={{
            heading: props.item.title,
            subHeading: props.item.desc,
          }}
        />
      </div>
      {props.item.title && <h4 className="title">{props.item.title}</h4>}
      {props.item.desc && <p className="description">{props.item.desc}</p>}
    </div>
  );
}

function getThumbnail(controller, item) {
  return controller
    ? controller.getThumbnail(item)
    : item && (item.thumbnails ? item.thumbnails.large : item.url);
}
