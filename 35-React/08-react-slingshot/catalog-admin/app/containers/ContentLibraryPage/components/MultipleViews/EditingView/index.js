/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import EditingStep from '../../../images/steps/illustration-step4.svg';
import './style.scss';

export default function EditingView() {
  return (
    <div className="editing-component-page">
      <div className="component-page">
        <div className="component-image">
          <img alt="" className="step-image" src={EditingStep} />
        </div>
        <div className="component-text">
          <div className="component-title">
            <h2 className="heading-component">Photo editing in progress</h2>
          </div>
          <div className="component-body">
            <p className="component-body-text">
              <span>We have successfully completed the photoshoot.</span>
              <br />
              <span>
                Our team of editors have started working on your photos and will
                let you know when they're ready.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
