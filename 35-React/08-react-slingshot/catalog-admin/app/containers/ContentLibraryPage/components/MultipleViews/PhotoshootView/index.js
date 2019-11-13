import React from 'react';
import PhotoshootStep from '../../../images/steps/illustration-step3.svg';
import './style.scss';

export default function PhotoshootView() {
  return (
    <div className="photoshoot-component-page">
      <div className="component-page">
        <div className="component-image">
          <img alt="" className="step-image" src={PhotoshootStep} />
        </div>
        <div className="component-text">
          <div className="component-title">
            <h2 className="heading-component">Photoshoot scheduled</h2>
          </div>
          <div className="component-body">
            <p className="component-body-text">
              We locked a location for your photoshoot and have secured all the
              talent necessary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
