import React from 'react';
import PropTypes from 'prop-types';
import { getErrorSrcForFileName } from './helper';

import styles from './AttachedFiles.scss';

export default function AttachedFiles(props) {
  const { url } = props;
  const filename = url.split('/').pop();
  return (
    <div className="file" style={styles}>
      <img
        className="file-icon"
        src={getErrorSrcForFileName(filename)}
        alt={filename}
      />
      <a className="file-link" href={props.url} target="_blank">
        {filename}
      </a>
    </div>
  );
}

AttachedFiles.propTypes = {
  url: PropTypes.string,
};
