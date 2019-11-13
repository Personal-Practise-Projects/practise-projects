import React from 'react';

import RadioButtonGroup from '../../RadioButtonGroup';
import { DONE } from '../../../common/constants';
import { generateUniqueId } from '../../../helpers/common';
import ImageDownloadFeatureController from '../../ImageDownload/controller';

const DEFAULT_CONTENT_STATUS = 'UN_PUBLISHED';
const ALLOWED_STATUS = ['Un-publish', 'Available', 'Free', 'Purchased-request'];
export const STATUS_MAPPING = {
  UN_PUBLISHED: 'Un-publish',
  AVAILABLE: 'Available',
  FREE: 'Free',
  PURCHASED_VIA_REQUEST: 'Purchased-request',
};

const ALL_STATUS_MAPPING = {
  ...STATUS_MAPPING,
  PURCHASED_VIA_LIBRARY: 'Library-purchased',
};

export const buildLightBoxFeatures = data => [
  {
    type: 'IMAGE_DOWNLOAD_FEATURE',
    handler: new ImageDownloadFeatureController(data),
  },
];


export function EditedContentStatusChoices(props) {
  const availableOptions = [...ALLOWED_STATUS];
  let isDisabled = props.file.status !== DONE;
  let existingStatusKey = props && props.file.contentStatus ? props.file.contentStatus : DEFAULT_CONTENT_STATUS;
  let alreadySelectedValue = null;
  if (Object.keys(STATUS_MAPPING).indexOf(existingStatusKey) === -1) {
    isDisabled = true;
    alreadySelectedValue = ALL_STATUS_MAPPING[existingStatusKey];
    if (alreadySelectedValue) {
      availableOptions.push(alreadySelectedValue);
    }
  }
  if (!isDisabled) {
    alreadySelectedValue = STATUS_MAPPING[existingStatusKey];
  }
  const uniqueId = generateUniqueId();
  return (
    <div className="photo-version-status">
      <RadioButtonGroup
        key={uniqueId}
        name={uniqueId}
        isDisabled={isDisabled}
        list={availableOptions}
        onChange={(event) => props.statusChangeListener(event, props.file)}
        value={alreadySelectedValue}
        checkByDefault={true}
      />
    </div>
  );
}


export function onDragHover(refId, isEnter) {
  const element = document.getElementById(refId);
  if (isEnter && element) {
    element.classList.add('on-drop-hover');
  } else if (element) {
    element.classList.remove('on-drop-hover');
  }
}
