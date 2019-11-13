import React from 'react';

import Img from '../../../Img';
import emptyPlaceholder from '../../../../images/kanban-board/swimlane-empty.svg';

import './NoOptions.scss';

export default function NoOptions() {
  return (
    <div className="no-options-component">
      <Img className="image" src={emptyPlaceholder} />
      <h1 className="title">No Options</h1>
    </div>
  );
}
