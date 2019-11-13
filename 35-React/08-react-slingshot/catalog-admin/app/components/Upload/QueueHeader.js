import React from "react";

import { getUploadedQueueHeaderMessage } from "./helpers";
import { getMinimizedBoxIcon } from "../ContentsChooser/minimized";
import { WIDGET_ACTIONS } from "../ContentsChooser/common/constants";

export default function QueueHeader(props) {
  const firstActionType = props.minimize
    ? WIDGET_ACTIONS.MAXIMIZE
    : WIDGET_ACTIONS.MINIMIZE;
  return (
    <div className="queue-header"
         onClick={event => props.callbackRef(firstActionType, event)}>
      <div className="queue-status">
        {getUploadedQueueHeaderMessage(props.queue)}
      </div>
      <div className="queue-right-widget">
        <div className="queue-minimize-icon">
          {getMinimizedBoxIcon(
            firstActionType,
            props.callbackRef,
          )}
        </div>
        <div className="queue-close-icon">
          {getMinimizedBoxIcon(
            WIDGET_ACTIONS.CLOSE_WHITE,
            props.callbackRef,
          )}
        </div>
      </div>
    </div>
  )
}
