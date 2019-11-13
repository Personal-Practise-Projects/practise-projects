import React from 'react';
import PropTypes from 'prop-types';

import tabsViewHeaderStyles from './TabsViewHeader.scss';

export default class TabsViewHeader extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { data, selectedTab, tabSelection } = this.props;
    return (
      <div className="tabs-header" style={tabsViewHeaderStyles}>
        <div className="tabs-header-wrapper">
          {data.map((item, index) => {
            return (
              <button
                type="button"
                className={
                  selectedTab === item.tabIndex ? 'tab tab-active' : 'tab'
                }
                key={index}
                value={item.tabIndex}
                onClick={() => tabSelection(event)}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}

TabsViewHeader.propType = {
  data: PropTypes.array.isRequired,
  selectedTab: PropTypes.string,
  tabSelection: PropTypes.func.isRequired,
};
