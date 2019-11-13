import { ShotBulkUpdateController } from '../ShotsBulkOperationView/controller/shotBulkUpdate';
import { GLOBAL_EVENT_TYPE } from '../../common/constants';

export function createBulkController(type, args) {
  switch (type) {
    case GLOBAL_EVENT_TYPE.SHOT:
      return new ShotBulkUpdateController(args.bulkHeaders, args.selectedItems,);
  }
}
