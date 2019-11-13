import React from 'react';

import ShotListView from './index';
import ShotDetailsView from '../ShotDetailsView';

import { DETAILS_VIEW_EVENT } from '../ShotDetailsView/constants';

export default class ShotDataManager {
  constructor(eventListener) {
    this.eventListener = eventListener;
  }

  onSelect = selectedShotInfo => {
    this.selectedShotInfo = selectedShotInfo;
    this.eventListener({ event: DETAILS_VIEW_EVENT.OPEN_DETAILS_PANEL });
  };

  getRenderingList = (props) => {
    return <ShotListView
      onSelect={this.onSelect}
      {...props}
    />;
  };

  getParentStyleClass = () => 'splitpage-heightened';

  getDetailComponent = () => {
    return (
      this.selectedShotInfo && (
        <div className="splitpage-drawer animated slideInRight">
          <ShotDetailsView
            key={0}
            shot={this.selectedShotInfo.shot}
            metaInfo={this.selectedShotInfo.headers}
            eventListener={this.eventListener}
          />
        </div>
      )
    );
  };
}
