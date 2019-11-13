import React from 'react';
import { WIDGET_ACTIONS } from './common/constants';

import maximizeIcon from '../../images/content-widget/maximize-icon.svg';
import minimizeIcon from '../../images/content-widget/minimize-icon.svg';
import closeIcon from '../../images/content-widget/close-widget.svg';
import closeIconWhite from '../../images/content-widget/close-widget-white.svg';

const ACTION_ICONS = {
  CLOSE: closeIcon,
  CLOSE_WHITE: closeIconWhite,
  MAXIMIZE: maximizeIcon,
  MINIMIZE: minimizeIcon,
};

export function getMinimizedBoxIcon(firstActionType, actionCallback) {
  return (
    <button
      className="btn minimized-widget-action d-flex align-items-center justify-content-center"
      onClick={event => actionCallback(firstActionType, event)}
    >
      <span
        className="widget-icon d-inline-block"
        style={{
          background: `url("${
            ACTION_ICONS[firstActionType]
          }") center no-repeat`,
          backgroundSize: 'contain',
        }}
      />
    </button>
  );
}
