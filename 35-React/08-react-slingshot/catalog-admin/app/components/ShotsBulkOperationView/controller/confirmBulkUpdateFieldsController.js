import deepmerge from 'deepmerge';

import { bulkUpdateShotDetails } from '../service';
import { buildDataForObject } from '../../ShotDetailsView/helper';
import { BULK_ACTIONS } from '../constants';
import { CHOICE_FIELDS, DONE } from '../../../common/constants';
import { BaseBulkUpdate } from './base';
import { getComponent } from '../helper';
import { FIELDS_UID } from '../common/constants';

export class ConfirmBulkUpdateFieldsController extends BaseBulkUpdate {
  constructor(shots) {
    super();
    this.enableNext = false;
    this.shots = shots;
    this.dataVersion = -1;
    this.headers = [];
    this.bulkData = {};
    this.type = 'SHOT_CONFIRM';
    this.nextLabel = 'Apply changes';
    this.prevLabel = 'Back';
  }

  getExistingData = header => {
    this.__addInConfig(header);
    return header;
  };

  setHeaders = headers => {
    this.headers = headers;
    this.enableNext = this.headers.length > 0;
    this.bulkData = {};
  };

  __addInConfig = header => {
    switch (header.uid) {
      case '#color_tag':
        this.bulkData.color_tag = header.data.id;
        break;
      case '#category':
      case '#setUp':
        this.bulkData = deepmerge(
          this.bulkData,
          buildDataForObject(header, header.data && header.data.id),
        );
        break;
      case FIELDS_UID.COLLABORATORS:
        this.bulkData.collaborators = [];
        header.choices.forEach(choice => {
          this.bulkData.collaborators.push({
            role: choice.unique_key,
            user: choice.selectedData && choice.selectedData.id,
          });
        });
        break;
      case CHOICE_FIELDS.CAMERA_ANGLE:
      case CHOICE_FIELDS.LIGHTING:
      case CHOICE_FIELDS.CROPPING:
      case CHOICE_FIELDS.SHADOWS:
        this.bulkData = deepmerge(
          this.bulkData,
          buildDataForObject(header, header.subtitle),
        );
        break;
      default:
        this.bulkData = deepmerge(
          this.bulkData,
          buildDataForObject(header, header.data),
        );
        break;
    }
  };

  applyNext = callbackRef => {
    bulkUpdateShotDetails(
      this.shots.map(shot => shot.id),
      this.bulkData,
      status => {
        if (status === DONE) {
          callbackRef && callbackRef(BULK_ACTIONS.CLOSE_RELOAD);
        }
      },
    );
  };

  applyBack = callbackRef => {
    callbackRef && callbackRef(BULK_ACTIONS.PREV_LOAD);
  };

  getComponent(header) {
    this.getExistingData(header);
    return getComponent(header);
  }
}
