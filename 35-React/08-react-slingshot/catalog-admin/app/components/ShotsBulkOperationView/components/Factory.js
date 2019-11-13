import React from "react";

import ConfirmBulkFieldsComponent from "./confirmBulkUpdateFileds";
import EditBulkFieldsComponent from "./editBulkUpdateFileds";
import SelectBulkFieldsComponent from "./selectBulkUpdateFileds";
import BulkUpdateContainer from "../index";
import { GLOBAL_EVENT_TYPE } from "../../../common/constants";
import CheckBox from "../../CheckBox";
import NestedCheckBox from "../../NestedCheckBox";

export const BULK_SELECT_TYPE = {
  MULTI_LEVEL_OPTION: 'multiLevelOption',
};

export function getBulkUploadComponent(type, controller) {
  switch (type) {
    case GLOBAL_EVENT_TYPE.SHOT:
      return <BulkUpdateContainer controller={controller}/>;
    case 'SHOT_EDIT':
      return <EditBulkFieldsComponent controller={controller}/>;
    case 'SHOT_CONFIRM':
      return <ConfirmBulkFieldsComponent controller={controller}/>;
    case 'SHOT_SELECT':
      return <SelectBulkFieldsComponent controller={controller}/>;
  }
}


export function getBulkSelectComponent(header, controller) {
  if (header.optionType === BULK_SELECT_TYPE.MULTI_LEVEL_OPTION) {
    return <NestedCheckBox key={header.uid} header={header} controller={controller}/>;
  } else {
    return <CheckBox key={header.uid} header={header} dataHandler={controller}/>;
  }
}
