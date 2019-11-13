import React from 'react';
import PropTypes from 'prop-types';

import TabsViewHeader from './TabsViewHeader';
import TabsViewContainer from './TabsViewContainer';

import styles from './TabsView.scss';

export default class TabsView extends React.Component {
  getComponentClasses = () =>
    this.props.hasParentHeight
      ? 'tabs-wrapper tabs-heightened'
      : 'tabs-wrapper tabs-positioned';

  handleTabSelection = event => {
    this.props.tabManager.setSelectedTab(event.target.value);
    this.forceUpdate();
  };

  render() {
    const { tabManager } = this.props;
    return (
      <div className={this.getComponentClasses()} style={styles}>
        <TabsViewHeader
          data={tabManager.getTabs()}
          selectedTab={tabManager.getSelectedTab()}
          tabSelection={this.handleTabSelection}
        />
        <TabsViewContainer tabManager={tabManager} />
      </div>
    );
  }
}

TabsView.propTypes = {
  tabManager: PropTypes.object.isRequired,
  hasParentHeight: PropTypes.bool,
};

TabsView.defaultProps = {
  hasParentHeight: false,
};
