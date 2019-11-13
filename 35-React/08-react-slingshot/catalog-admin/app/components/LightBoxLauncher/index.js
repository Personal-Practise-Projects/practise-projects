import React from 'react';
import { connect } from 'react-redux';
import LightBoxHandler from '../LightBox/dataHandler';
import { openLightBox } from '../../containers/BasePage/actions';
import styles from './LightBoxLauncher.scss';
import Search from '../Search';

class LightBoxLauncher extends React.Component {
  render() {
    const className = this.props.className ? this.props.className : '';
    const ref = Object.assign(
      {
        src: this.props.url,
        errSrc: this.props.errSrc,
        heading: this.props.metaInfo.heading,
        subHeading: this.props.metaInfo.subHeading,
      },
      this.props.reference,
    );
    return (
      <button
        onClick={event => {
          event.stopPropagation();
          this.props.openLightBox(new LightBoxHandler(ref));
        }}
        className={`${className} p-0 lightbox-launcher`}
        styles={styles}
      >
        {this.props.children}
      </button>
    );
  }
}

LightBoxLauncher.defaultProps = {
  metaInfo: {
    heading: '',
    subHeading: '',
  },
};

const mapDispatchToProps = {
  openLightBox,
};

export default connect(
  null,
  mapDispatchToProps,
)(LightBoxLauncher);
