import { BULK_ACTIONS } from '../constants';
import React from "react";

export class BulkUpdateConfirmationController {
  constructor(eventListener) {
    this.eventListener = eventListener;
  }

  getFooterConfig = () => {
    return [
      {
        title: 'Ok',
        isDisabled: false,
        actionType: BULK_ACTIONS.CONFIRM_OK,
      },
    ];
  };

  getChildren = () => {
    return 'If you exit now all changes will be discarded';
  }
}
