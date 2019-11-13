import React from 'react';
import notificationImg from '../../images/mobile-explorer-illustration.svg';
import './UnsupportedPage.scss';

class UnsupportedPage extends React.Component {
  render() {
    return (
      <div className="unsupported-page-component">
        <div className="test">
          <div className="image-field">
            <img src={notificationImg} alt="" />
          </div>
          <div className="text-field">
            <h5 className="title-field">Sorry, almost there!</h5>
            <p className="description">We're not currently supporting</p>
            <p className="description">your browser.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default UnsupportedPage;
