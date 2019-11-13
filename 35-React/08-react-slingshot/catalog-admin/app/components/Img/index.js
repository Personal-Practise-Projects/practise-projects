/**
 *
 * Img.js
 *
 * Renders an image, enforcing the usage of the alt="" tag
 */

import React from 'react';
import PropTypes from 'prop-types';
import { getErrorSrcForFileName } from '../AddImages/AttachedFiles/helper';

function Img(props) {
  const src = props.src || props.errSrc || getErrorSrcForFileName(props.src);
  return (
    <img
      ref={props.reference}
      src={src}
      className={props.className || ''}
      title={props.title ? props.title : ''}
      onClick={props.onClick}
      onLoad={props.onLoad || null}
      onError={e => {
        props.onError && props.onError();
        e.target.onError = null;
        e.target.src = props.errSrc || getErrorSrcForFileName(props.src);
        e.target.alt = props.src.split('/').pop();
        e.target.title = props.title ? props.title : props.src.split('/').pop();
        e.target.className = `${props.className} ${props.errorClassName ||
          'no-thumbnail'}`;
      }}
    />
  );
}

// We require the use of src and alt, only enforced by react in dev mode
Img.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
};

export default Img;
