import { buildDataForObject } from '../../components/ShotDetailsView/helper';
import { bulkUpdateShotDetails } from '../../components/ShotsBulkOperationView/service';
import { DONE } from '../../common/constants';

export class BulkLockUnlockController {
  constructor(type) {
    this.type = type;
  }

  register(eventListener) {
    this.eventListener = eventListener;
  }

  setData(selectedShots, lockedItems) {
    this.selectedShots = selectedShots[this.type].data;
    this.lockedItems = lockedItems;
  }

  onUpdate(header, updateWithData) {
    this.bulkData = buildDataForObject(header, updateWithData);
    switch (header.uid) {
      case '#bulkLock':
        this.shotIds = this.selectedShots.map(shot => shot.id);
        break;
      case '#bulkUnlock':
        this.shotIds = this.lockedItems.map(shot => shot.id);
        break;
    }
    bulkUpdateShotDetails(this.shotIds, this.bulkData, status => {
      if (status === DONE) {
        this.eventListener();
      }
    });
  }
}
