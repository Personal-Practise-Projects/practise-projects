import { BULK_ACTIONS } from '../ShotsBulkOperationView/constants';

export class ChoiceChangeConfirmation {
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

  getChildren() {
    return 'You have already added some text, If you switch now, changes will be discarded.';
  }
}
