import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ShotSwimlaneHeader from './shotSwimlaneHeader';
import ShotSwimlaneContents from './shotSwimlaneContents';
import { StringHelper } from '../../helpers/utils';
import { GLOBAL_EVENT_TYPE } from '../../common/constants';
import { resetSwimLaneData } from './actions';

class ShotSwimlane extends React.Component {
  componentDidMount() {
    this.props.dataHandler.fetch(this.props.filterDict);
  }

  componentDidUpdate(prevProps) {
    if (this.props.filterDict !== prevProps.filterDict) {
      this.props.resetSwimLaneData(this.props.swimlaneType);
      this.props.dataHandler.fetch(this.props.filterDict);
    }
  }

  render() {
    const swimlaneClass = StringHelper.format(
      'vertical-swimlane position-relative ##',
      Object.keys(this.props.selectedItemsDict).length ? 'bulk-action' : '',
    );
    return (
      <section className={swimlaneClass}>
        <ShotSwimlaneHeader
          allowBulk={this.props.allowBulk}
          shots={this.props.shots}
          selectedSortType={this.props.metaInfo.selectedSortType}
          sortTypes={this.props.metaInfo.sortTypes}
          swimlaneType={this.props.swimlaneType}
          title={this.props.metaInfo.title}
          stage={this.props.stage}
        />
        <ShotSwimlaneContents
          allowBulk={this.props.allowBulk}
          allowDropFrom={this.props.metaInfo.allowDropFrom}
          cardClickCallback={this.props.cardClickCallback}
          changedStatus={this.props.metaInfo.changedStatus}
          draggable={this.props.draggable}
          dragHandler={this.props.dragHandler}
          shots={this.props.shots}
          swimlaneType={this.props.swimlaneType}
        />
      </section>
    );
  }
}

ShotSwimlane.propTypes = {
  allowBulk: PropTypes.bool,
  cardClickCallback: PropTypes.func,
  dataHandler: PropTypes.object.isRequired,
  draggable: PropTypes.bool,
  dragHandler: PropTypes.object,
  filterDict: PropTypes.object,
  metaInfo: PropTypes.object,
  resetSwimLaneData: PropTypes.func,
  shots: PropTypes.array,
  selectedItemsDict: PropTypes.object,
  swimlaneType: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  draggable: state.selectedItems[GLOBAL_EVENT_TYPE.SHOT].count <= 0,
  filterDict: state.filters[state.filters.activeScreen].appliedFilters,
  metaInfo: state.swimlane.metaInfo[ownProps.swimlaneType] || {},
  selectedItemsDict:
    state.selectedItems[GLOBAL_EVENT_TYPE.SHOT].dataDict[
      ownProps.swimlaneType
    ] || {},
  shots: state.swimlane.swimlaneShots[ownProps.swimlaneType] || [],
});

const mapDispatchToProps = {
  resetSwimLaneData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShotSwimlane);
