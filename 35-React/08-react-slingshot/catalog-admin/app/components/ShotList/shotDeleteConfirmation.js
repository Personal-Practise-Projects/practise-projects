import { COMMON_ACTIONS } from '../../common/constants';
import { deleteShot } from './services';

export class ShotDeleteConfirmation {
  constructor(shotDeleteId, eventListener) {
    this.shotDeleteId = shotDeleteId;
    this.parentEventListener = eventListener;
  }

  getFooterConfig = () => [
    {
      title: 'Ok',
      isDisabled: false,
      actionType: { event: COMMON_ACTIONS.CONFIRM_OK },
    },
  ];

  eventListener = (args, callback) => {
    switch (args.event) {
      case COMMON_ACTIONS.CONFIRM_OK: {
        const toggleDialogBox = true;
        deleteShot(this.shotDeleteId, this.parentEventListener);
        callback(toggleDialogBox);
        break;
      }
    }
  };

  getChildren() {
    return 'Do you really want to delete this shot?';
  }
}
