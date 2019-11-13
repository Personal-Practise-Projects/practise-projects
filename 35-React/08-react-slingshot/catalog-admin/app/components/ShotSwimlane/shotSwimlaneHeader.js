import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import './Swimlane.scss'; // Import Component Specific Styling

import SelectItem from '../SelectItem';
import { GLOBAL_EVENT_TYPE, SORT_PAGE_TYPES } from '../../common/constants';
import { shotDataToSelectItem } from './helpers';
import SortDropDown from '../SortDropDown';

export default class ShotSwimlaneHeader extends React.Component {
  shotsToSelectItems = memoize(shots =>
    shots.map(shotItem => shotDataToSelectItem(shotItem)),
  );

  render() {
    const hasShots = this.props.shots && this.props.shots.length !== 0;
    return (
      <div className="swimlane-header d-flex align-items-center justify-content-between">
        <div className="swimlane-header-title d-flex align-items-center">
          {this.props.allowBulk && hasShots && (
            <SelectItem
              all
              header={{ type: GLOBAL_EVENT_TYPE.SHOT }}
              item={this.shotsToSelectItems(this.props.shots)}
              parent={this.props.swimlaneType}
            />
          )}
          <h4 className="header-title">{this.props.title}</h4>
          {hasShots && this.getHeaderCount()}
        </div>
        {hasShots && (
          <SortDropDown
            metaInfo={{
              activeScreen: SORT_PAGE_TYPES.SWIMLANE,
              stage: this.props.stage,
              activeScreenType: this.props.swimlaneType,
            }}
          />
        )}
      </div>
    );
  }

  getHeaderCount() {
    return (
      <div className="swimlane-header-count">
        <span className="swimlane-count d-flex align-items-center justify-content-center">
          {this.props.shots.length}
        </span>
      </div>
    );
  }
}

ShotSwimlaneHeader.propTypes = {
  allowBulk: PropTypes.bool,
  shots: PropTypes.array.isRequired,
  selectedSortType: PropTypes.string,
  sortTypes: PropTypes.array,
  swimlaneType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
