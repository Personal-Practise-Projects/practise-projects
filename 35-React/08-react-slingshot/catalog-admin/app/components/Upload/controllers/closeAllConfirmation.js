import React from 'react';
import { WIDGET_ACTIONS } from "../../ContentsChooser/common/constants";

export const CANCEL_MSG = 'You still have upload in progress. Are you sure you want to stop?';

export class ConfirmationController {
  constructor(eventListener) {
    this.eventListener = eventListener;
    this.title = CANCEL_MSG;
  }

  getFooterConfig = () => {
    return [
      {
        title: 'Ok',
        isDisabled: false,
        actionType: WIDGET_ACTIONS.CLOSE_ALL,
      },
    ];
  };

  getChildren() {
    return CANCEL_MSG;
  }
}
