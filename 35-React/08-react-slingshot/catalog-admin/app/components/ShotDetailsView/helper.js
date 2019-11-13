import { buildPayLoad } from '../../helpers/common';
import { CONTENT_STATUS } from '../ContentsChooser/common/constants';
import { USER_CONFIG_STORAGE_KEY } from '../../helpers/user';
import { PERMISSIONS_FEATURES_KEYS } from '../../common/permission';
import { SHOT_STATUS } from '../../common/shot/constants';
import {
  intermediateStatus,
  PostProductionStatuses,
  PreProductionStatuses,
} from './constants';
import { getCurrentLocalTime } from '../../common/helpers';

export function buildDataForObject(header, updateWithData) {
  let value;

  switch (header.uid) {
    case '#image_references_notes': {
      const { url, notes, status } = updateWithData;
      return {
        image_references: {
          action: 'UPDATED',
          images: [{ url, notes, status }],
        },
      };
    }
    case '#schedule_on':
      return addStatusField(header.data);
    case '#due_date':
      value = updateWithData ? updateWithData / 1000 : null;
      return buildPayLoad({ [header.data_key]: value });
    case '#product_list':
    case '#prop_list':
      value =
        updateWithData && updateWithData.length > 0
          ? updateWithData.map(({ id }) => id)
          : updateWithData;
      return buildPayLoad({ [header.data_key]: value });
    case '#status':
    case '#location_list':
      value = updateWithData ? updateWithData.id : null;
      return buildPayLoad({ [header.data_key]: value });
    case '#next':
      value =
        updateWithData === SHOT_STATUS.CREATIVE_REVIEW
          ? SHOT_STATUS.BUNDLING
          : SHOT_STATUS.CAPTURED;
      return buildPayLoad({ [header.data_key]: value });
    case '#talents':
      const deFlattenedObject = {};
      value = updateWithData;
      deFlattenedObject[header.data_key] = [];
      deFlattenedObject[header.data_key].push(value);
      return deFlattenedObject;

    default:
      value = updateWithData;
      return buildPayLoad({ [header.data_key]: value });
  }
}

export function getAllowedToStatusList() {
  return [
    ...PreProductionStatuses,
    ...intermediateStatus,
    ...PostProductionStatuses,
  ];
}

export function selectedReferenceImages(images) {
  const selectedFiles = [];
  images.forEach(file => {
    if (file.status === CONTENT_STATUS.MAPPED) {
      selectedFiles.push(file);
    }
  });
  return selectedFiles;
}

export const checkFeature = (features, allowedFeature) => {
  const userFeatures = JSON.parse(localStorage.getItem(USER_CONFIG_STORAGE_KEY))
    .features;
  if (userFeatures.includes(PERMISSIONS_FEATURES_KEYS.ADMIN)) {
    return true;
  }
  return userFeatures.includes(allowedFeature);
};

export function addStatusField(updateWithData) {
  const updateWithDataDict = {
    shot_info: {
      schedule_on: updateWithData / 1000,
    },
  };
  if (updateWithData) {
    updateWithDataDict.shot_info.status = SHOT_STATUS.SCHEDULED;
    const localTimezoneCurrentDay = getCurrentLocalTime();
    const localTimeZoneScheduleOnDay = getCurrentLocalTime(updateWithData);
    if (localTimezoneCurrentDay === localTimeZoneScheduleOnDay)
      updateWithDataDict.shot_info.status = SHOT_STATUS.PHOTOSHOOT;
  }
  return updateWithDataDict;
}
