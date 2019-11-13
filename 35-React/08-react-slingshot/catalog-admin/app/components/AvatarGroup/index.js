import React, { Component } from 'react';

import styles from './AvatarGroup.scss';
import { ON_AVATAR_CLICK } from './constants';
import Img from '../Img';

export default class AvatarGroup extends Component {
  constructor(props) {
    super(props);
    const noSelectedImageProps =
      this.props.data.length && this.props.data[0].url;
    this.state = {
      selectedImage: this.props.selectedImage
        ? this.props.selectedImage.url
        : noSelectedImageProps,
    };
  }

  setSelectedImage = image => {
    this.setState({
      selectedImage: image.url,
    });
    this.props.eventListener({
      event: ON_AVATAR_CLICK,
      data: image,
    });
  };

  render() {
    return (
      <div className="avatar-group" style={styles}>
        {this.props.data.map((image, index) => {
          const activeClass =
            this.state.selectedImage === image.url ? 'active' : '';
          return (
            <Img
              className={`avatar-image ${activeClass}`}
              key={index}
              src={image.url}
              onClick={() => this.setSelectedImage(image)}
              alt=""
            />
          );
        })}
      </div>
    );
  }
}
