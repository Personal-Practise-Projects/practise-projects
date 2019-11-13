import { GLOBAL_EVENT_TYPE } from '../../../common/constants';
import { getLockConfig } from '../../../common/shot/helpers';

export default class LockUnLockController {
  constructor(ref, header, updateListener) {
    this.ref = ref;
    this.header = header;
    this.onUpdateListener = updateListener;
    this.globalEventType = GLOBAL_EVENT_TYPE.SHOT;
  }

  getExtraConfig = () => getLockConfig(this.ref);

  isChecked() {
    return this.ref.shot_info.locked;
  }

  onUpdate = (updateWithData, callback) => {
    this.onUpdateListener(this.header, updateWithData, callback);
  };
}
