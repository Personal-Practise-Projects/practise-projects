import React from 'react';
import PropTypes from 'prop-types';

import styles from './TabsViewContainer.scss';

class TabsViewContainer extends React.Component {
  render() {
    const { tabManager } = this.props;
    return (
      <div className="tabs-content" style={styles}>
        <div className="tabs-content-wrapper">
          {tabManager.getRenderingComponent()}
        </div>
      </div>
    );
  }
}

TabsViewContainer.propTypes = {
  tabManager: PropTypes.object.isRequired,
};

export default TabsViewContainer;
