import React from 'react';

import Img from '../../../../components/Img';
import emptyProductionViewImage from '../../../../images/Icons/no-shots-illustration.svg';

import './EmptyState.scss';

export function EmptyState() {
  return (
    <div className="empty-state-component">
      <div className="wrapper">
        <Img
          src={emptyProductionViewImage}
          alt="No shots scheduled for the day!"
          className="image"
        />
        <h1 className="title">No shots scheduled for the day!</h1>
        <p className="subtitle">
          There is no shot scheduled for photoshoot. Please schedule shots from
          the bundling.
        </p>
      </div>
    </div>
  );
}
