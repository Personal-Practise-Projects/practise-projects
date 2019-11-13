import React from 'react';
import { SelectBulkUpdateFieldsController } from './selectBulkUpdateFieldsController';
import { GLOBAL_EVENT_TYPE } from '../../../common/constants';

export class ShotBulkUpdateController {
  constructor(headers, shots) {
    this.dataVersion = -1;
    this.initialController = new SelectBulkUpdateFieldsController(
      JSON.parse(JSON.stringify(headers)),
      shots,
    );
    this.type = GLOBAL_EVENT_TYPE.SHOT;
  }
}
