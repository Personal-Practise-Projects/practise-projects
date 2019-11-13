import {
  getFirstLetterCapitalizedWithoutUnderscore,
  getShotColorFromStatus,
  getValueByKeyFromObject,
} from '../../../helpers/common';
import { getCategoryList, getSetUpList } from '../../../helpers/services';
import { buildDataForObject, getAllowedToStatusList } from '../helper';
import { updateShotDetails } from '../service';
import { categoryOptions, shotHeaderParser } from '../parser';
import LockUnLockController from './shotLockController';
import { SHOT_STATUS } from '../../../common/shot/constants';
import { StringHelper } from '../../../helpers/utils';

export class ShotHeaderController {
  constructor(shot, header, dataHandler) {
    this.ref = shot;
    this.dataHandler = dataHandler;
    this.headers = shotHeaderParser(this.ref, header);
    this.dropDownOptions = {
      '#status': [],
      '#setUp': [],
      '#category': [],
    };
  }

  setData(shot) {
    this.ref = shot;
  }

  getExtraConfig = header => ({
    readonly: this.ref.shot_info.locked_info.readonly || header.disabled,
  });

  // eslint-disable-next-line consistent-return
  getController = header => {
    if (header.uid === '#lockShot') {
      return new LockUnLockController(this.ref, header, this.onUpdate);
    }
  };

  getExistingData = header =>
    getValueByKeyFromObject(header.data_key, this.ref);

  getOptionalInfo = (header, callback) => {
    switch (header.uid) {
      case '#status':
        this.dropDownOptions[header.uid] = getAllowedToStatusList();
        callback(this.dropDownOptions[header.uid]);
        break;
      case '#setUp':
        getSetUpList(parsedData => {
          this.dropDownOptions[header.uid] = parsedData;
          callback(this.dropDownOptions[header.uid]);
        });
        break;
      case '#category':
        getCategoryList(parsedData => {
          this.dropDownOptions[header.uid] = categoryOptions(
            this.ref.shot_info.category,
            parsedData,
          );
          callback(this.dropDownOptions[header.uid]);
        });
        break;
      default:
        break;
    }
  };

  getDropDownTitle = (header, value) => {
    if (header.uid === '#status') {
      return getFirstLetterCapitalizedWithoutUnderscore(value);
    }
    const headerData =
      this.dropDownOptions[header.uid] &&
      this.dropDownOptions[header.uid].find(data => data.id === value);
    return headerData && headerData.title;
  };

  displayChildClassRenderer = (header, selectedOption) => {
    if (header.uid === '#status') {
      return `shot-status ${getShotColorFromStatus(selectedOption)}`;
    }
    return '';
  };

  onUpdate = (header, updateWithData, callback) => {
    const passCallbackResult = (status, response) => {
      if (callback) {
        callback(status, response);
      }
    };
    switch (header.uid) {
      case '#status': {
        const updatedObjects = { shot_info: { status: updateWithData } };
        if (updateWithData === SHOT_STATUS.BACKLOG) {
          updatedObjects.shot_info.schedule_on = null;
          updatedObjects.order_rank = 0;
        }
        const config = {
          data: JSON.stringify(updatedObjects),
        };
        this.updateShot(config, passCallbackResult);
        break;
      }
      default: {
        const config = {
          data: JSON.stringify(buildDataForObject(header, updateWithData)),
        };
        this.updateShot(config, passCallbackResult);
        break;
      }
    }
  };

  eventListener = action => {
    this.dataHandler.eventListener({
      event: action,
    });
  };

  updateShot = (config, callback) => {
    updateShotDetails(
      config,
      this.ref,
      this.dataHandler.eventListener,
      callback,
    );
  };

  getShotNumberLink = () => ({
    link: StringHelper.format(
      'shots?q=##&shotId=##',
      this.headers.contentRequestId,
      this.headers.id,
    ),
    title: this.headers.subTitle,
  });
}
