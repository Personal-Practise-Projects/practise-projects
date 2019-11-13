import React from 'react';
import EmptyView from '../../../images/steps/no-campaign-illustration.svg';
import './style.scss';

export default function EmptyComponentView() {
  return (
    <div className="empty-component-page">
      <div className="component-page">
        <div className="component-image">
          <img alt="" className="step-image" src={EmptyView} />
        </div>
        <div className="component-text">
          <div className="component-title">
            <h2 className="heading-component">
              A picture is worth 1,000 words
            </h2>
          </div>
          <div className="component-body">
            <p className="component-body-text">
              Your customers now have shorter attention spans than goldfish.
              Engaging content has become critical to build trust and
              credibility with them in a fast online world. We make that content
              for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
