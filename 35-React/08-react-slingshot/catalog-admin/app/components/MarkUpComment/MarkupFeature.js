import React from 'react';

import MarkupView from './MarkupView';
import MarkupSection from './MarkUpSection/index';
import MarkUpHandler from './MarkUpSection/markupHandler';
import BaseFeatureController from '../LightBox/BaseFeatureController';

export default class MarkupFeature extends BaseFeatureController {
  constructor(ref, referenceType) {
    super();
    this.refId = ref.contentId;
    this.dataHandler = new MarkUpHandler(ref, referenceType);
  }

  getFeatureSet() {
    return this.refId && <MarkupView />;
  }

  getFeatureSection() {
    return <MarkupSection dataHandler={this.dataHandler} />;
  }
}
