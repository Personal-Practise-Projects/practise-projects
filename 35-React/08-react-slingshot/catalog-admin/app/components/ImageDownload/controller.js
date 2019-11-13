import React from 'react';
import { ImageDownload } from './index';
import BaseFeatureController from '../LightBox/BaseFeatureController';

export default class ImageDownloadFeatureController extends BaseFeatureController {
  constructor(data) {
    super();
    this.data = data;
  }

  getFeatureSet = () => <ImageDownload url={this.data} />;
}
