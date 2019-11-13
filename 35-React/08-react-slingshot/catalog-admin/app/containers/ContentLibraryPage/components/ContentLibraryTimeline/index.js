// this will contain all the timeline features
// moving from one step to another

import './style.scss';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { getContentCount } from '../../services/api';
import { setTimelineStatus } from '../../../../actions/contentLibraryActions';

class Timeline extends React.Component {
  componentDidUpdate(prevProps) {
    // check if the new content contains any contents to display
    // if not then change the status to DRAFT
    if (prevProps.selectedBrand.id !== this.props.selectedBrand.id) {
      getContentCount(this.props.selectedBrand.id).then(response => {
        if (response.data.count === 0) {
          this.props.setTimelineStatus('DRAFT');
        }
      });
    }
  }

  render() {
    return (
      <div className="time-line-component">
        <div className="time-line">
          <div className="step">
            <div className="stage">
              {this.props.timelineStatus === 'SHIP_PRODUCTS' && (
                <div className="number-part-active">
                  <span>1</span>
                </div>
              )}
              {this.props.timelineStatus !== 'SHIP_PRODUCTS' && (
                <div className="number-part-inactive">
                  <span>1</span>
                </div>
              )}
              <div className="title-part">Ship products</div>
              <div
                className={classNames({
                  description: true,
                })}
              >
                <div className="timeline-header">
                  <span className="step-image-1" />
                  <h4 className="timeline-header-title">Ship products</h4>
                </div>
                <div className="timeline-content">
                  <ul className="timeline-content-unordered">
                    <li className="timeline-content-list">
                      Collect min. 2 units of each product into a single
                      shipping box.
                    </li>
                    <li className="timeline-content-list">
                      Ship them to Catalog at 8075 W 3rd St, Suite 400, Los
                      Angeles, CA 90048.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="step">
            <div className="stage">
              {this.props.timelineStatus === 'COMPLETE_SHOT_LIST' && (
                <div className="number-part-active">
                  <span>2</span>
                </div>
              )}
              {this.props.timelineStatus !== 'COMPLETE_SHOT_LIST' && (
                <div className="number-part-inactive">
                  <span>2</span>
                </div>
              )}
              <div className="title-part">Complete shot list</div>
              <div
                className={classNames({
                  description: true,
                })}
              >
                <div className="timeline-header">
                  <span className="step-image-2" />
                  <h4 className="timeline-header-title">Complete shot list</h4>
                </div>
                <div className="timeline-content">
                  <ul className="timeline-content-unordered">
                    <li className="timeline-content-list">
                      Shot lists help our phototgraphers capture the look and
                      feel of your brand.
                    </li>
                    <li className="timeline-content-list">
                      Complete your shot list by adding extra details or
                      creative ideas for the photographer.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="step">
            <div className="stage">
              {this.props.timelineStatus === 'PHOTO_SHOOT' && (
                <div className="number-part-active">
                  <span>3</span>
                </div>
              )}
              {this.props.timelineStatus !== 'PHOTO_SHOOT' && (
                <div className="number-part-inactive">
                  <span>3</span>
                </div>
              )}
              <div className="title-part">Photoshoot</div>
              <div
                className={classNames({
                  description: true,
                })}
              >
                <div className="timeline-header">
                  <span className="step-image-3" />
                  <h4 className="timeline-header-title">Photoshoot</h4>
                </div>
                <div className="timeline-content">
                  <ul className="timeline-content-unordered">
                    <li className="timeline-content-list">
                      Catalog handles permits, location and equipment before
                      planning the photoshoot.
                    </li>
                    <li className="timeline-content-list">
                      We coordinate with all the necessary talent to produce
                      unique photos for your brand.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="step">
            <div className="stage">
              {this.props.timelineStatus === 'EDITING' && (
                <div className="number-part-active">
                  <span>4</span>
                </div>
              )}
              {this.props.timelineStatus !== 'EDITING' && (
                <div className="number-part-inactive">
                  <span>4</span>
                </div>
              )}
              <div className="title-part">Editing</div>
              <div
                className={classNames({
                  description: true,
                })}
              >
                <div className="timeline-header">
                  <span className="step-image-4" />
                  <h4 className="timeline-header-title">Editing</h4>
                </div>
                <div className="timeline-content">
                  <ul className="timeline-content-unordered">
                    <li className="timeline-content-list">
                      Our team of experienced editors are retouching your
                      photos.
                    </li>
                    <li className="timeline-content-list">
                      We will upload them to your gallery and notify you when
                      they're ready.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="step">
            <div className="stage">
              {this.props.timelineStatus === 'READY' ||
                (this.props.timelineStatus === 'PROCESSED' && (
                  <div className="number-part-inactive">
                    <span>5</span>
                  </div>
                ))}
              {this.props.timelineStatus !== 'READY' &&
                this.props.timelineStatus !== 'PROCESSED' && (
                  <div className="number-part-inactive">
                    <span>5</span>
                  </div>
                )}
              <div className="title-part">Ready</div>
              <div
                className={classNames({
                  description: true,
                })}
              >
                <div className="timeline-header">
                  <span className="step-image-5" />
                  <h4 className="timeline-header-title">Ready</h4>
                </div>
                <div className="timeline-content">
                  <ul className="timeline-content-unordered">
                    <li className="timeline-content-list">
                      Your photos are ready for download.
                    </li>
                    <li className="timeline-content-list">
                      Visit the gallery at any time and order any extra photos
                      you'd like.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedBrand: state.contentLibrary.brand,
  timelineStatus: state.contentLibrary.timeline.status,
});

const mapDispatchToProps = {
  setTimelineStatus,
};

Timeline.propTypes = {
  selectedBrand: PropTypes.object,
  setTimelineStatus: PropTypes.func,
  timelineStatus: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Timeline);
