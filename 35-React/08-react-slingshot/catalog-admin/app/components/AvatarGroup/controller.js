import React from 'react';
import AvatarGroup from './index';
import BaseFeatureController from '../LightBox/BaseFeatureController';

export default class AvatarGroupFeatureController extends BaseFeatureController {
  constructor(data) {
    super();
    this.data = data;
  }

  getFeatureSet = callBack => (
    <AvatarGroup
      data={this.data.markerImageArray}
      eventListener={callBack}
      selectedImage={this.data.selectedImage}
    />
  );
}
