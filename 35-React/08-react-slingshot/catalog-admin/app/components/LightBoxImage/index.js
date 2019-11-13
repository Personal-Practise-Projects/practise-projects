import React from 'react';

import styled from 'styled-components';
import Img from '../Img';
import errorPlaceHolder from '../../images/content-widget/imagecontent-placeholder.svg';
import LightBoxLauncher from '../LightBoxLauncher';

import styles from './LightBoxImage.scss';
import { ImageDownload } from '../ImageDownload';

export const LightBoxWrapper = styled.div`
  width: ${props => props.width || 'auto'};
  height: ${props => props.height || 'auto'};
`;

class LightBoxImage extends React.Component {
  render() {
    return (
      <LightBoxWrapper
        className="lightbox-image"
        style={styles}
        width={this.props.width}
        height={this.props.height}
      >
        <Img
          src={this.props.thumbnail ? this.props.thumbnail : this.props.url}
          alt={this.props.alt}
          errSrc={errorPlaceHolder}
          className={this.props.className}
        />
        <div className="download-overlay align-items-center justify-content-center">
          <LightBoxLauncher
            reference={
              this.props.featureReference &&
              this.props.featureReference(this.props.url)
            }
            url={this.props.compressUrl}
            metaInfo={this.props.metaInfo}
          >
            <div className="flex-wrapper text-center">
              <i className="icon-zoom-in" />
            </div>
          </LightBoxLauncher>
          {this.props.downloadUrl && <ImageDownload url={this.props.url} />}
        </div>
      </LightBoxWrapper>
    );
  }
}

export default LightBoxImage;
