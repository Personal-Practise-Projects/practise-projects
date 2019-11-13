import React from 'react';

import { CONTENT_REQUEST_DETAILS_TABS } from '../../common/constants';

import TabsView from '../../components/TabsView';
import SubHeader from '../../components/SubHeader';
import ShotDataManager from '../../components/ShotListView/dataManager';
import InventoryDataManager from '../../components/InventoryListView/dataManager';
import { DETAILS_VIEW_EVENT } from '../../components/ShotDetailsView/constants';

export default class ContentRequestPageManager {
  constructor(
    eventHandler,
    selectedTab = CONTENT_REQUEST_DETAILS_TABS.SHOT_DETAILS,
  ) {
    this.onEventListener = eventHandler;
    this.setSelectedTab(selectedTab);
  }

  getSelectedTab = () => this.selectedTab;

  getSelectedTabHandler = () => {
    switch (this.selectedTab) {
      case CONTENT_REQUEST_DETAILS_TABS.SHOT_DETAILS:
        return new ShotDataManager(this.onEventListener);
      case CONTENT_REQUEST_DETAILS_TABS.SHOT_INVENTORY:
        return new InventoryDataManager(this.onEventListener);
    }
  };

  setSelectedTab = tabIndex => {
    this.onEventListener({
      event: DETAILS_VIEW_EVENT.CLOSE_DETAILS_PANEL,
    });
    this.selectedTab = tabIndex;
    this.selectedTabHandler = this.getSelectedTabHandler();
  };

  getTabs() {
    return [
      {
        title: 'Shot list',
        tabIndex: CONTENT_REQUEST_DETAILS_TABS.SHOT_DETAILS,
      },
      {
        title: 'Inventory',
        tabIndex: CONTENT_REQUEST_DETAILS_TABS.SHOT_INVENTORY,
      },
    ];
  }

  getRenderingComponent() {
    let contentRequestId = new URL(document.location).searchParams.get('q');
    return this.selectedTabHandler.getRenderingList({ contentRequestId: contentRequestId });
  }

  getDetailComponent = (isClosed = false) =>
    !isClosed ? this.selectedTabHandler.getDetailComponent() : null;

  getHeaderComponent = requestIdentifier => (
    <SubHeader data={{ title: `CR_${requestIdentifier}` }} />
  );

  getParentStyleClass = () => this.selectedTabHandler.getParentStyleClass();

  getListComponent = () => (
    <div className="request-page">
      <TabsView hasParentHeight tabManager={this} />
    </div>
  );
}
