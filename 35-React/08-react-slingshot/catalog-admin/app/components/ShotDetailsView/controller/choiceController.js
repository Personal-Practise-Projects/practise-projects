import React from 'react';

import { getChoices } from '../../../helpers/services';
import ToggleTextArea from '../../ToggleTextArea';
import { BULK_ACTIONS } from '../../ShotsBulkOperationView/constants';
import { CHOICE_FIELDS } from '../../../common/constants';

const CHOICES = {
  [CHOICE_FIELDS.CAMERA_ANGLE]: 'camera_angle',
  [CHOICE_FIELDS.SHADOWS]: 'shadows',
  [CHOICE_FIELDS.CROPPING]: 'photo_cropping',
  [CHOICE_FIELDS.LIGHTING]: 'lighting',
};

export class ChoiceController {
  constructor(shotDetailsController) {
    this.shotDetailsController = shotDetailsController;
    this.ref = shotDetailsController.ref;
    this.choices = {
      [CHOICE_FIELDS.CAMERA_ANGLE]: {},
      [CHOICE_FIELDS.LIGHTING]: {},
      [CHOICE_FIELDS.CROPPING]: {},
      [CHOICE_FIELDS.SHADOWS]: {},
    };
  }

  setEventListener = eventListener => {
    this.eventListener = eventListener;
  };

  getExistingData = header => {
    const selected = Object.keys(this.choices[header.uid]).find(
      key => this.choices[header.uid][key].selected === true,
    );
    return selected ? '' : this.ref[CHOICES[header.uid]];
  };

  getOptionalInfo = header => {
    switch (header.uid) {
      default:
        return <ToggleTextArea header={header} controller={this} />;
    }
  };

  getExtraConfig = () => ({
    readonly:
      this.ref.shot_info &&
      this.ref.shot_info.locked_info &&
      this.ref.shot_info.locked_info.readonly,
  });

  getChoices = (header, callback) => {
    const choice = header.uid.substring(1);
    getChoices(choice, parsedData => {
      parsedData[this.ref[CHOICES[header.uid]]]
        ? (parsedData[this.ref[CHOICES[header.uid]]].selected = true)
        : '';
      this.choices[header.uid] = parsedData;
      callback(parsedData);
    });
  };

  onAction = (header, value) => {
    if (this.ref[header.data_key] && this.getExistingData(header)) {
      this.selectedValue = value;
      this.eventListener(BULK_ACTIONS.TOGGLE_CONFIRM);
    } else {
      this.onUpdate(header, value, () => {
        this.eventListener(BULK_ACTIONS.RELOAD_STATE);
      });
    }
  };

  onUpdate = (header, updateWithData, callback) => {
    this.shotDetailsController.onUpdate(header, updateWithData, callback);
  };

  getHeaders = header => ({
    title: 'Add note',
    placeholder: 'want to add another option',
    uid: header.uid,
    data_key: header.data_key,
  });

  buildLightBoxFeatures = data => ({
    features: [],
  });

  getThumbnail = data =>
    data && (data.thumbnails ? data.thumbnails.large : data.url);
}
