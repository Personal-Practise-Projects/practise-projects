// list all the photos related to the content request id
import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  addItemToCart,
  removeItemFromCart,
} from '../../../../actions/cartActions';
import {
  fetchPhotoList,
  // TODO: replace this with different method where status of the photo can be changed from 'AVAILABLE' to 'ADDED_ON_CART'
  setPhotoDetail,
} from '../../../../actions/contentLibraryActions';
import './style.scss';

// TODO: remove these imports and files if they are not being used as placeholders
// Reference Images for first three and last one is being used for download
import moon from '../../images/tempFiles/moon.jpg';
import shibe from '../../images/tempFiles/shibe.jpg';
import mountain from '../../images/tempFiles/mountain.jpg';
import dogGif from '../../images/tempFiles/dog.gif';

class PhotoShoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photoIndex: 0,
      openViewLarge: false,
      openDetail: false,
      openDownload: false,
      purchased: false,
    };
  }

  /* NOTE: you can fetch all the photos by calling 
     localhost:8000/api/v1/brands/{brandId}/contents-library/0/ 
     TODO: figure out how to set 'All' as default, keep 'All' option in the crid list
  */

  componentDidMount() {
    this.props.fetchPhotoList(
      this.props.selectedBrand.id,
      this.props.selectedContent.id,
      this.props.selectedShot.id,
    );
  }

  componentDidUpdate(prevProps) {
    // if the shotNames are not same then fetch new photos if it's available
    if (
      this.props.selectedShot.id !== prevProps.selectedShot.id ||
      this.props.selectedContent.id !== prevProps.selectedContent.id
    ) {
      this.props.fetchPhotoList(
        this.props.selectedBrand.id,
        this.props.selectedContent.id,
        this.props.selectedShot.id,
      );
    }
  }

  openLightbox = index => {
    this.changeIndex(index);
    this.setState({
      openViewLarge: true,
      openDetail: false,
      openDownload: false,
    });
  };

  closeLightbox = () => {
    this.setState({
      openViewLarge: false,
      openDetail: false,
      openDownload: false,
    });
  };

  openViewLarge = index => {
    this.changeOverlayIndex(index);
    this.setState({
      openViewLarge: true,
      openDetail: false,
      openDownload: false,
    });
  };

  openDetail = index => {
    this.changeOverlayIndex(index);
    this.setState({
      openDetail: true,
      openViewLarge: false,
      openDownload: false,
    });
  };

  closeDetail = () => {
    this.setState({
      openDetail: false,
      openViewLarge: false,
      openDownload: false,
    });
  };

  openDownloadLightbox = index => {
    this.changeOverlayIndex(index);
    this.setState({
      openDownload: true,
      openDetail: false,
      openViewLarge: false,
    });
  };

  closeDownloadLightbox = () => {
    this.setState({
      openDownload: false,
      openViewLarge: false,
      openDetail: false,
    });
  };

  // adding the items to the cart
  addToCart = event => {
    this.props.addItemToCart(event.target.value);
    // change the state so it would change the context and icon of the Add To Cart
    // TODO: replace this with different method where status of the photo can be changed from 'AVAILABLE' to 'ADDED_ON_CART'
    this.props.setPhotoDetail({ added: true });
  };

  // removes the item from the cart
  removeFromCart = event => {
    // check if the innerHTML is set to Remove
    // this will remove one element from that index
    this.props.removeItemFromCart(event.target.value);
    // TODO: replace this with different method where status of the photo can be changed from 'AVAILABLE' to 'ADDED_ON_CART'
    this.props.setPhotoDetail({ added: false });
  };

  changeImageIndex = imageIndex => {
    let tempIndex = 0;
    for (let i = 0; i < this.props.photoList.length; i += 1) {
      if (this.mapStateToProps.photoList[i].file === imageIndex.target.src) {
        tempIndex = i;
      }
    }
    this.setState({ photoIndex: tempIndex });
  };

  changeOverlayIndex = index => {
    let tempIndex = 0;
    for (let i = 0; i < this.props.photoList.length; i += 1) {
      if (this.props.photoList[i].file === index.target.value) {
        tempIndex = i;
      }
    }
    this.setState({ photoIndex: tempIndex });
  };

  moveNext = () => {
    const index = this.state.photoIndex;
    this.setState({
      photoIndex: (index + 1) % this.props.photoList.length,
    });
  };

  movePrev = () => {
    const index = this.state.photoIndex;
    this.setState({
      photoIndex:
        (index + this.props.photoList.length - 1) % this.props.photoList.length,
    });
  };

  render() {
    // display all the photos through photoList IF shotName does not exist
    return (
      <div className="photo-shoot-component">
        <div className="photos">
          <div className="masonry">
            {this.props.photoList.map(photo => (
              <div className="overall" key={photo.ref_id}>
                <div className="photo-detail">
                  <div className="overlay">
                    <div onClick={this.openLightbox} role="button" tabIndex={0}>
                      <img
                        alt=""
                        className="image-info"
                        src={photo.file}
                        value={photo}
                      />
                    </div>
                    <div className="overlay-items">
                      <div className="text">
                        <div className="category-section">
                          <h4 className="category">{photo.category}</h4>
                          <h4 className="price">
                            ($
                            {photo.price})
                          </h4>
                        </div>
                        <p className="photo-id">{photo.ref_id}</p>
                      </div>
                      <div className="button-list">
                        <button
                          className="view-large"
                          onClick={this.openViewLarge}
                          type="button"
                          value={photo.file}
                        >
                          <div className="large-hover-text">View Large</div>
                        </button>
                        <button
                          className="view-details"
                          onClick={this.openDetail}
                          type="button"
                          value={photo.file}
                        >
                          <div className="details-hover-text">View Details</div>
                        </button>
                        {(photo.status === 'PURCHASED' ||
                          photo.status === 'FREE') && (
                          <button
                            className="download"
                            onClick={this.openDownloadLightbox}
                            type="button"
                            value={photo.file}
                          >
                            <div className="download-hover-text">Download</div>
                          </button>
                        )}
                        {/* TODO: If status can be changed, then remove
                            this.props.photoDetail.added as that will be unnecessary.
                            Once this.props.photoDetail.added is removed, go to action, types, and reducer files
                            to remove anything related to photoDetail */}
                        {photo.status === 'AVAILABLE' &&
                          !this.props.photoDetail.added && (
                            <button
                              className="add-to-cart"
                              onClick={this.addToCart}
                              type="button"
                              value={photo.id}
                            >
                              <div
                                className="add-to-cart-hover-text"
                                key={photo.id}
                              >
                                Add to cart
                              </div>
                            </button>
                          )}
                        {(photo.status === 'AVAILABLE' ||
                          photo.status === 'ADDED_IN_CART') &&
                          this.props.photoDetail.added && (
                            <button
                              className="add-to-cart"
                              onClick={this.removeFromCart}
                              type="button"
                              value={photo.id}
                            >
                              <div
                                key={photo.id}
                                className="add-to-cart-hover-text"
                              >
                                Remove
                              </div>
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {this.getLightBoxOverlay()}
        {this.getDetailOverlay()}
        {this.getDownloadOverlay()}
      </div>
    );
  }

  getLightBoxOverlay = () => (
    <div>
      {this.state.openViewLarge && (
        <div>
          <div
            className={classNames({
              bg: true,
              popup: this.state.openViewLarge,
            })}
          />
          <div className="lightbox">
            <img
              className="lightbox-image"
              src={this.props.photoList[this.state.photoIndex].file}
              alt=""
            />
            <div className="lightbox-overlay-items">
              <div className="lightbox-content">
                <div className="lightbox-category-section">
                  <h4 className="lightbox-category">
                    {this.props.photoList[this.state.photoIndex].category}
                    <span>
                      ($
                      {this.props.photoList[this.state.photoIndex].price})
                    </span>
                  </h4>
                  <p className="photo-id">
                    {this.props.photoList[this.state.photoIndex].ref_id}
                  </p>
                </div>
                <div className="lightbox-information-action">
                  {this.state.purchased && (
                    <button
                      type="button"
                      value={this.props.photoList[this.state.photoIndex].id}
                      className="lightbox-download"
                      onClick={this.openDownloadLightbox}
                    >
                      <div className="download-hover-text">Download</div>
                    </button>
                  )}
                  {!this.state.purchased && (
                    <button
                      type="button"
                      value={this.props.photoList[this.state.photoIndex].id}
                      className="lightbox-download"
                      onClick={this.addToCart}
                    >
                      A<div className="download-hover-text">Add to cart</div>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="lightbox-buttons">
              <button
                type="button"
                className="close-button"
                onClick={this.closeLightbox}
              />
              <button
                type="button"
                className="prev-button"
                onClick={this.movePrev}
              />
              <button
                type="button"
                className="next-button"
                onClick={this.moveNext}
              />
            </div>
          </div>
        </div>
      )}
      {this.getDownloadOverlay()}
    </div>
  );

  getDetailOverlay = () => (
    <div>
      {this.state.openDetail && (
        <div>
          <div
            className={classNames({
              bg: true,
              popup: this.state.openViewLarge,
            })}
          />
          <div className="detail-lightbox">
            <div className="detail-page">
              <div className="left-part">
                <div className="content-wrapper">
                  <div className="content-vignette" />
                  <img
                    className="detail-image"
                    src={this.props.photoList[this.state.photoIndex].file}
                    alt=""
                  />
                </div>
              </div>
              <div className="right-part">
                <div className="content-header">
                  <span className="production-title">Production detail</span>
                  <div className="production-data">
                    <h3 className="production-category">
                      {this.props.photoList[this.state.photoIndex].category}
                      <span className="production-id">
                        ({this.props.photoList[this.state.photoIndex].ref_id})
                      </span>
                    </h3>
                    <p className="production-price">
                      ${this.props.photoList[this.state.photoIndex].price}
                    </p>
                  </div>
                </div>
                <div className="content-scroll">
                  <div className="content">
                    <div className="content-body">
                      <div className="content-spec">
                        <span className="spec-1" />
                        <div className="content-spec-text">
                          <span className="content-spec-title">Products:</span>
                          <p className="content-spec-detail">No products</p>
                        </div>
                      </div>
                      <div className="content-spec">
                        <span className="spec-2" />
                        <div className="content-spec-text">
                          <span className="content-spec-title">Notes:</span>
                          <p className="content-spec-detail">
                            - always 3 products in each photo: 2 together, 1
                            separate - bright, colorful- see IG - reflects lived
                            in: shows a home, stylized - human touch
                          </p>
                        </div>
                      </div>
                      <div className="content-spec">
                        <span className="spec-3" />
                        <div className="content-spec-text">
                          <span className="content-spec-title">Props:</span>
                          <p className="content-spec-detail">No props</p>
                        </div>
                      </div>
                      <div className="content-spec">
                        <span className="spec-4" />
                        <div className="content-spec-text">
                          <span className="content-spec-title">
                            Image references:
                          </span>
                          <div>
                            <a href={moon}>Image1 </a>
                            <a href={shibe}>Image2 </a>
                            <a href={mountain}>Image3</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="detail-lightbox-buttons">
              <button
                type="button"
                className="close-button"
                onClick={this.closeDetail}
              />
              <button
                type="button"
                className="prev-button"
                onClick={this.movePrev}
              />
              <button
                type="button"
                className="next-button"
                onClick={this.moveNext}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  getDownloadOverlay = () => (
    <div>
      {this.state.openDownload && (
        <div>
          <div
            className={classNames({
              bg: true,
              popup: this.state.openViewLarge,
            })}
          />
          <div className="detail-lightbox">
            <div className="download-page">
              <div className="download-left-part">
                <div className="download-wrapper">
                  <div className="download-vignette" />
                  <img
                    className="download-image"
                    src={this.props.photoList[this.state.photoIndex].file}
                    alt=""
                  />
                </div>
              </div>
              <div className="download-right-part">
                <div className="download-header">
                  <span className="download-title">Download</span>
                  <div className="download-data">
                    <h3 className="download-category">
                      Select a size to download
                    </h3>
                  </div>
                </div>
                <div className="download-scroll">
                  <div className="download-content">
                    <div className="download-content-body">
                      <div className="download-content-spec">
                        <span className="spec-1" />
                        <div className="download-content-spec-text">
                          <span className="download-content-spec-title">
                            Original
                          </span>
                          <p className="download-content-spec-detail">
                            Not available
                          </p>
                        </div>
                      </div>
                      <div className="download-content-spec">
                        <span className="spec-2" />
                        <div className="download-content-spec-text">
                          <span className="download-content-spec-title">
                            Medium
                          </span>
                          <p className="download-content-spec-detail">
                            Not available
                          </p>
                        </div>
                      </div>
                      <div className="download-content-spec">
                        <span className="spec-3" />
                        <div className="download-content-spec-text">
                          <span className="download-content-spec-title">
                            Small
                          </span>
                          <p className="download-content-spec-detail">
                            Not available
                          </p>
                        </div>
                      </div>
                      <div className="download-content-spec">
                        <span className="spec-4" />
                        <div className="download-content-spec-text">
                          <span className="download-content-spec-title">
                            Custom:
                          </span>
                          <div>
                            Width:{' '}
                            <input className="input-fields" type="text" />
                            <div className="icon-link" />
                            Height:{' '}
                            <input className="input-fields" type="text" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="download-button-section">
                <a href={dogGif} alt="" download>
                  <button className="download-button" type="button">
                    Download
                  </button>
                </a>
              </div>
            </div>
            <div className="detail-lightbox-buttons">
              <button
                type="button"
                className="close-button"
                onClick={this.closeDownloadLightbox}
              />
              <button
                type="button"
                className="prev-button"
                onClick={this.movePrev}
              />
              <button
                type="button"
                className="next-button"
                onClick={this.moveNext}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

PhotoShoot.propTypes = {
  fetchPhotoList: PropTypes.func,
  photoDetail: PropTypes.object,
  photoList: PropTypes.array,
  selectedBrand: PropTypes.object,
  selectedContent: PropTypes.object,
  selectedShot: PropTypes.object,
  // TODO: replace this with different method where status of the photo can be changed from 'AVAILABLE' to 'ADDED_ON_CART'
  setPhotoDetail: PropTypes.func,
  addItemToCart: PropTypes.func,
  removeItemFromCart: PropTypes.func,
};

const mapStateToProps = state => ({
  photoDetail: state.contentLibrary.photoDetail,
  photoList: state.contentLibrary.photoList,
  selectedBrand: state.contentLibrary.brand,
  selectedContent: state.contentLibrary.content,
  selectedShot: state.contentLibrary.shot,
});

const mapDispatchToProps = {
  fetchPhotoList,
  // TODO: replace this with different method where status of the photo can be changed from 'AVAILABLE' to 'ADDED_ON_CART'
  setPhotoDetail,
  addItemToCart,
  removeItemFromCart,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PhotoShoot);
