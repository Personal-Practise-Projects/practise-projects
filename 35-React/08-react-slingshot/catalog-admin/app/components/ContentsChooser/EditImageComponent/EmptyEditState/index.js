import React from 'react';

import Img from '../../../Img/index';
import EmptyEditStateIcon from '../../../../images/content-widget/edit-empty-state.svg';

import './EmptyEditState.scss';

export function EmptyEditState() {
  return (
    <div className="empty-state d-flex align-items-center justify-content-center">
      <div className="flex-wrapper text-center">
        <Img
          src={EmptyEditStateIcon}
          alt="No Result"
          className="no-result-logo"
        />
        <h3 className="empty-header">Woops! Looks like nothing is here.</h3>
        <span className="empty-body d-block">
          Go back and select the photos that you wish to edit
        </span>
      </div>
    </div>
  );
}
