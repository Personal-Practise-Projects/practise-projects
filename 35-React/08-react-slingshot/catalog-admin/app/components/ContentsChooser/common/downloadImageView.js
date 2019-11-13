import React from 'react';

import Img from '../../Img';
import errorPlaceHolder from '../../../images/content-widget/imagecontent-placeholder.svg';
import LightBoxLauncher from '../../LightBoxLauncher';
import { ImageDownload } from '../../ImageDownload';

export function DownloadImageView(props) {
  return (
    <div className="photo-version-thumb position-relative">
      <div onMouseOver={event => onThumbMouseHover(props.refId, event)}>
        <Img
          src={props.imageThumb}
          alt="Original Image"
          className="content-card-thumbnail"
          errSrc={errorPlaceHolder}
        />
      </div>

      <div
        id={props.refId}
        className="download-overlay d-none align-items-center justify-content-center"
        onMouseLeave={event => onThumbMouseHover(props.refId, event)}
      >
        <span className="content-id">{props.refId}</span>
        <LightBoxLauncher
          reference={{
            id: props.dataRef.id,
            features: props.dataRef.features,
            src: props.dataRef.compress_url,
            errSrc: errorPlaceHolder,
          }}
          metaInfo={{
            subHeading: props.refId,
          }}
        >
          <div className="flex-wrapper text-center">
            <i className="icon-zoom-in" />
          </div>
        </LightBoxLauncher>
        <ImageDownload url={props.dataRef.url} />
        {props.callbackRef && (
          <button
            className="content-card-cancel"
            onClick={props.callbackRef}
            type="button"
          >
            <i className="icon-cross" />
          </button>
        )}
      </div>
    </div>
  );
}

function onThumbMouseHover(refId, event) {
  const element = document.getElementById(refId);
  if (event.type === 'mouseover' && element) {
    element.classList.remove('d-none');
    element.classList.add('d-flex');
  } else if (event.type === 'mouseleave' && element) {
    element.classList.remove('d-flex');
    element.classList.add('d-none');
  }
}
