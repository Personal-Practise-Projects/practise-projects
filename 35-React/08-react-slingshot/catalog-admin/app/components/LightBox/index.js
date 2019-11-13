import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  closeLightBox,
  setLightBoxImageDimension,
} from '../../containers/BasePage/actions';
import Img from '../Img';
import Loader from '../Loader';
import KeyDownListener from '../../customHooks/useKeyboardEventCustomHook';

import styles from './LightBox.scss';

class LightBox extends Component {
  constructor(props) {
    super(props);
    this.imageWrapperRef = React.createRef();
    this.imageRef = React.createRef();
    this.state = {
      src: props.dataHandler.getSrc(),
      largeImageClass: '',
      imageLoaded: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      nextProps.show !== this.props.show ||
      nextState.src !== this.state.src ||
      nextState.imageLoaded !== this.state.imageLoaded
    );
  }

  render() {
    return (
      <KeyDownListener
        type="Escape"
        callback={() => {
          this.props.closeLightBox();
        }}
      >
        <Loader display={!this.state.imageLoaded} />
        <div
          className={`lightbox-wrapper ${
            !this.state.imageLoaded ? 'd-none' : ''
          }`}
          style={styles}
          onClick={() => {
            this.props.closeLightBox();
          }}
        >
          <i
            className="icon-cross"
            onClick={() => {
              this.props.closeLightBox();
            }}
          />
          <div
            className="img-wrapper position-relative"
            ref={this.imageWrapperRef}
            onClick={event => event.stopPropagation()}
          >
            <div className="lightbox-image">
              <Img
                reference={this.imageRef}
                src={this.state.src}
                onLoad={event => {
                  this.onImageLoad(event);
                }}
                onError={() => {
                  this.setState({ imageLoaded: true });
                }}
                alt="Lightbox Image"
                errSrc={this.props.dataHandler.getErrSrc()}
                className={`img ${this.state.largeImageClass}`}
              />
            </div>
            {this.state.imageLoaded &&
              this.props.dataHandler.getLightBoxFeatureSections()}
            <div
              className={`meta-info-wrapper position-absolute ${
                this.props.show ? 'comment-mode' : ''
              }`}
            >
              <div className="meta-info">
                {this.props.dataHandler.ref.heading && (
                  <h3
                    className="heading"
                    title={this.props.dataHandler.ref.heading}
                  >
                    {this.props.dataHandler.ref.heading}
                  </h3>
                )}
                {this.props.dataHandler.ref.subHeading && (
                  <p
                    className="subheading"
                    title={this.props.dataHandler.ref.subHeading}
                  >
                    {this.props.dataHandler.ref.subHeading}
                  </p>
                )}
              </div>
              <div className="features-wrapper">
                {this.state.imageLoaded &&
                  this.props.dataHandler.getLightBoxFeatures(this.reRender)}
              </div>
            </div>
          </div>
        </div>
      </KeyDownListener>
    );
  }

  componentDidMount() {
    if (this.state.imageLoaded) {
      this.setLargeImageClass(
        this.imageRef.current.clientWidth,
        this.imageWrapperRef.current.clientWidth,
      );
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.imageLoaded) {
      this.setLargeImageClass(
        this.imageRef.current.clientWidth,
        this.imageWrapperRef.current.clientWidth,
      );
    }
  }

  componentWillUnmount() {
    this.props.dataHandler.getLightBoxFeatures();
  }

  reRender = () => {
    this.setState({ src: this.props.dataHandler.getSrc() });
  };

  setLargeImageClass = (imageWidth, imageWrapperWidth) => {
    this.setState({
      largeImageClass: imageWidth > imageWrapperWidth ? 'large-image' : '',
    });
  };

  onImageLoad = event => {
    this.setState({ imageLoaded: true });
    this.props.setLightBoxImageDimension({
      width: event.currentTarget.naturalWidth,
      height: event.currentTarget.naturalHeight,
    });
  };
}

const mapDispatchToProps = {
  closeLightBox,
  setLightBoxImageDimension,
};

const mapStateToProps = state => ({
  show: state.base.showMarkUps,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LightBox);
