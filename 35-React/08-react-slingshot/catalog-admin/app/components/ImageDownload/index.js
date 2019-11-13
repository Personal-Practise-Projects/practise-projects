import React from 'react';

export const ImageDownload = props => (
  <a
    className="download"
    href={props.url}
    download={props.url}
    title="Click to download"
  >
    <i className="icon-download" />
  </a>
);
