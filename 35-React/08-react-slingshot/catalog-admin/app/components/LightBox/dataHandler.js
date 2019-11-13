import errorPlaceHolder from '../../images/content-widget/imagecontent-placeholder.svg';
import { ON_AVATAR_CLICK } from '../AvatarGroup/constants';

export default class LightBoxHandler {
  constructor(ref) {
    this.ref = ref;
  }

  getSrc = () => this.ref.src;

  getErrSrc = () => this.ref.errSrc || errorPlaceHolder;

  getLightBoxFeatures(reRender) {
    this.reRender = reRender;
    const features = [];
    if (this.ref && this.ref.features) {
      this.ref.features.map(feature => {
        features.push(feature.handler.getFeatureSet(this.eventListener));
      });
    }
    return features;
  }

  getLightBoxFeatureSections() {
    const sections = [];
    if (this.ref && this.ref.features) {
      this.ref.features.map(section => {
        sections.push(section.handler.getFeatureSection());
      });
    }
    return sections;
  }

  eventListener = args => {
    switch (args.event) {
      case ON_AVATAR_CLICK:
        this.ref.src = args.data.url;
        this.reRender();
        break;
    }
  };
}
