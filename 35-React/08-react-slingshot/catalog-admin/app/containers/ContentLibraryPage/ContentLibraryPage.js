import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './ContentLibraryPage.scss';
import BrandDropdown from './components/BrandDropdown';
import ContentLibraryTimeline from './components/ContentLibraryTimeline';
import ContentRequestDropdown from './components/ContentRequestDropdown';
import Loader from '../../components/Loader';
import PhotoShoots from './components/PhotoShoot';
import ShotListDropdown from './components/ShotListDropdown';

import CompleteShotView from './components/MultipleViews/CompleteShotView';
import EditingView from './components/MultipleViews/EditingView';
import EmptyComponentView from './components/MultipleViews/EmptyView';
import PhotoshootView from './components/MultipleViews/PhotoshootView';
import ShipProductsView from './components/MultipleViews/ShipProductView';

class ContentLibraryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: true,
    };
  }

  loading = () => {
    setTimeout(this.showPage, 2000);
  };

  showPage = () => {
    this.setState({
      showLoader: false,
    });
    document.getElementById('content-library-page').style.display = 'block';
  };

  getStatusView = timelineStatus => {
    switch (timelineStatus) {
      case 'SHIP_PRODUCTS':
        return <ShipProductsView />;
      case 'COMPLETE_SHOT_LIST':
        return <CompleteShotView />;
      case 'PHOTO_SHOOT':
        return <PhotoshootView />;
      case 'EDITING':
        return <EditingView />;
      case 'READY':
        return (
          <div className="photo-section">
            <PhotoShoots />
          </div>
        );
      case 'PROCESSED':
        return (
          <div className="photo-section">
            <PhotoShoots />
          </div>
        );
      case 'DRAFT':
      case 'SUBMITTED':
      default:
        return <EmptyComponentView />;
    }
  };

  // TODO: fix the new Filter component so it would not display white screen
  render() {
    return (
      <div className="content-library-page" onLoad={this.loading}>
        {this.state.showLoader && <Loader />}
        <div className="content" id="content-library-page">
          <div className="top">
            <div className="left">
              <div className="brand-list-section">
                <BrandDropdown />
              </div>
              <div className="content-list-section">
                <ContentRequestDropdown />
              </div>
              <div className="shot-list-section">
                <ShotListDropdown />
              </div>
            </div>
            <div className="right"></div>
          </div>
          <div className="middle">
            <div className="timeline-section">
              <ContentLibraryTimeline />
            </div>
          </div>
          <div className="bottom">
            {this.getStatusView(this.props.timelineStatus)}
          </div>
        </div>
      </div>
    );
  }
}

ContentLibraryPage.propTypes = {
  timelineStatus: PropTypes.string,
};

const mapStateToProps = state => ({
  timelineStatus: state.contentLibrary.timeline.status,
});

export default connect(mapStateToProps)(ContentLibraryPage);
