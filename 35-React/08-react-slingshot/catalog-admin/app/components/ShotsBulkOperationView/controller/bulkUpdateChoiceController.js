import { ChoiceController } from '../../ShotDetailsView/controller/choiceController';
import { BULK_ACTIONS } from '../constants';

export class BulkUpdateChoiceController extends ChoiceController {
  onAction = (header, value) => {
    if (this.ref[header.data_key] && this.getExistingData(header)) {
      this.selectedValue = value;
      this.eventListener(BULK_ACTIONS.TOGGLE_CONFIRM);
    } else {
      this.ref[header.data_key] = value;
      this.eventListener(BULK_ACTIONS.RELOAD_STATE);
    }
  };

  onUpdate = (header, updateWithData, callback) => {
    this.ref[header.data_key] = updateWithData;
    callback();
  };
}
