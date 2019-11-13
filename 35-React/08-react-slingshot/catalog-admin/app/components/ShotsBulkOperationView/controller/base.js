import React from 'react';
import { BULK_ACTIONS } from "../constants";

export class BaseBulkUpdate {
  constructor() {
    this.enableNext = true;
  }

  register = (callbackRef) => {
    this.callbackRef = callbackRef;
  };

  notify() {
    this.callbackRef && this.callbackRef(BULK_ACTIONS.RELOAD_STATE)
  }
}
