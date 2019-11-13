import { COMMON_ACTIONS } from '../../common/constants';
import { ShotDeleteConfirmation } from './shotDeleteConfirmation';

export class ShotListController {
  setEventListener(eventListener) {
    this.eventListener = eventListener;
  }

  onUpdate(header, updateWithData) {
    switch (header.uid) {
      case 'shot_delete':
        this.eventListener({
          event: COMMON_ACTIONS.TOGGLE_CONFIRM,
          data: new ShotDeleteConfirmation(updateWithData, this.eventListener),
        });
    }
  }
}
