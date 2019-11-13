import React from "react";
import { EditBulkUpdateFieldsController } from "./editBulkUpdateFieldsController";
import { BULK_ACTIONS } from "../constants";
import { BaseBulkUpdate } from "./base";
import { BULK_SELECT_TYPE } from "../components/Factory";
import { getCollaboratorTypeSearch } from "../../ShotDetailsView/services/collaborators";
import { parseBulkShotCollaboratorChoices } from "../common/collaboratorHelpers";
import { FIELDS_UID } from "../common/constants";

export class SelectBulkUpdateFieldsController extends BaseBulkUpdate {
  constructor(headers, shots) {
    super();
    this.enableNext = false;
    this.dataVersion = -1;
    this.prev = null;
    this.next = new EditBulkUpdateFieldsController(this, shots);
    this.headers = headers;
    this.type = 'SHOT_SELECT';
    this.nextLabel = 'Next';
    this.choicesSearch = {
      [FIELDS_UID.COLLABORATORS]: getCollaboratorTypeSearch(),
    };
    this.choices = {
      [FIELDS_UID.COLLABORATORS]: [],
    };
  }

  getExistingData = header => {
    if (header.optionType === BULK_SELECT_TYPE.MULTI_LEVEL_OPTION) {
      return this.choices[header.uid]
    }
    return { isChecked: header.applyBulkAction }
  };

  fetchChoices = (header, callback) => {
    if (header.optionType === BULK_SELECT_TYPE.MULTI_LEVEL_OPTION) {
      if (!this.choices[header.uid] || !this.choices[header.uid].length) {
        this.choicesSearch[header.uid] && this.choicesSearch[header.uid].search(
          null, null, (_, choices) => {
            this.choices[FIELDS_UID.COLLABORATORS] = parseBulkShotCollaboratorChoices(choices);
            callback && callback(this.choices[header.uid])
          });
      } else {
        callback && callback(this.choices[header.uid])
      }
    }
  };

  onUpdate = (header,) => {
    header.applyBulkAction = !header.applyBulkAction;
    //On unselect check box remove already populated data if it has any
    if (!header.applyBulkAction) {
      delete this.next.ref[header.data_key];
    }
    this.dataVersion++;
    const enableNext = this.selectedOptions().length > 0;
    if (enableNext !== this.enableNext) {
      this.enableNext = enableNext;
      this.notify();
    }
  };

  applyNext = (callbackRef) => {
    this.next.headers = this.selectedOptions();
    if (this.next.headers.length > 0) {
      callbackRef && callbackRef(BULK_ACTIONS.NEXT_LOAD)
    } else {
      callbackRef && callbackRef(BULK_ACTIONS.SHOW_ERROR, 'Please select some field for bulk update!')
    }
  };

  selectedOptions() {
    const selectedHeaders = this.headers.filter(header => header.applyBulkAction) || [];
    //Find multi level select header
    selectedHeaders.forEach(header => {
      if (header.optionType === BULK_SELECT_TYPE.MULTI_LEVEL_OPTION) {
        header.choices = this.choices[header.uid].filter(choice => choice.checked);
      }
    });
    return selectedHeaders;
  }
}
