import React from 'react';
import CompleteShotStep from '../../../images/steps/illustration-step2.svg';
import './style.scss';

export default function CompleteShotView() {
  return (
    <div className="complete-shot-component-page">
      <div className="component-page">
        <div className="component-image">
          <img alt="" className="step-image" src={CompleteShotStep} />
        </div>
        <div className="component-text">
          <div className="component-title">
            <h2 className="heading-component">Complete the shot list</h2>
          </div>
          <div className="component-body">
            <p className="component-body-text">
              The shot list is a series of guidelines that will help our
              photographers capture the look and feel of your brand.
            </p>
            <p className="component-body-text-2">
              Look out for an email with a link to style your shot list.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
