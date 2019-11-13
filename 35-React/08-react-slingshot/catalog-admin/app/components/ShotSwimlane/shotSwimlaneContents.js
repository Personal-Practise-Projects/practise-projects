import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { DRAG_ELEMENT_TYPE } from '../ProductionBoard/dragHandler';
import { GLOBAL_EVENT_TYPE } from '../../common/constants';
import ShotCard from '../ShotCard';
import { shotDataToShotCard } from './helpers';

import './Swimlane.scss'; // Import Component Specific Styling

class ShotSwimlaneContents extends React.Component {
  componentDidUpdate() {
    if (this.props.shots.length) {
      if (this.props.selectedItemsCount) {
        this.disableShotDragging();
      } else {
        this.enableShotDragging();
      }
    }
  }

  componentDidMount() {
    this.props.dragHandler.enableShotDragging(
      DRAG_ELEMENT_TYPE.ONLY_DROPPABLE,
      document.querySelectorAll('.swimlane-content'),
    );
    this.props.dragHandler.enableShotDragging(
      DRAG_ELEMENT_TYPE.ONLY_DROPPABLE,
      document.querySelectorAll('.swimlane-empty'),
    );
  }

  render() {
    const shotsCard = this.getShotCards();
    return (
      <div
        className="swimlane-content"
        data-droppable
        data-swimlane={this.props.swimlaneType}
        data-to-status={this.props.changedStatus}
        data-accepted-swimlane={this.props.allowDropFrom}
      >
        {shotsCard}
        {this.emptySwimlaneView(!shotsCard.length)}
      </div>
    );
  }

  getShotCards() {
    let selectedClass;
    return this.props.shots.map(shot => {
      selectedClass =
        Object.keys(this.props.selectedItemsDict).length > 0 &&
        this.props.selectedItemsDict[this.props.swimlaneType] &&
        (this.props.selectedItemsDict[this.props.swimlaneType][shot.id]
          ? 'selected'
          : '');
      return (
        <ShotCard
          key={shot.id}
          shotId={shot.id}
          selectedClass={selectedClass}
          shot={shot}
          draggable={this.props.draggable}
          allowSelect={this.props.allowBulk}
          selectEventType={this.props.swimlaneType}
          onClick={this.props.cardClickCallback}
          shotDataParser={shotDataToShotCard}
        />
      );
    });
  }

  enableShotDragging = () => {
    const shotCards = document.querySelectorAll(
      '.swimlane-content .shot-card-component',
    );
    if (shotCards.length) {
      this.props.dragHandler.enableShotDragging(
        DRAG_ELEMENT_TYPE.DEFAULT,
        shotCards,
      );
    }
  };

  disableShotDragging = () => {
    const shotCards = document.querySelectorAll('.swimlane-content .shot-card');
    if (shotCards.length) {
      this.props.dragHandler.disableShotDragging(shotCards);
    }
  };

  emptySwimlaneView(isVisible) {
    return (
      <div
        id={`swimlane-empty-${this.props.swimlaneType}`}
        className={`swimlane-empty align-items-center justify-content-center ${
          isVisible ? 'd-flex' : 'd-none'
        }`}
        data-droppable="child"
      >
        <div className="flex-wrapper">
          <span className="swimlane-empty-illustration d-block" />
          <span className="swimlane-empty-text d-block">
            Looks like there isn’t anything here
          </span>
        </div>
      </div>
    );
  }
}

ShotSwimlaneContents.propTypes = {
  allowBulk: PropTypes.bool,
  allowDropFrom: PropTypes.array,
  cardClickCallback: PropTypes.func,
  changedStatus: PropTypes.string.isRequired,
  dragHandler: PropTypes.object,
  draggable: PropTypes.bool,
  selectedItemsDict: PropTypes.object,
  selectedItemsCount: PropTypes.number,
  shots: PropTypes.array.isRequired,
  swimlaneType: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  selectedItemsDict: state.selectedItems[GLOBAL_EVENT_TYPE.SHOT].dataDict,
  selectedItemsCount: state.selectedItems[GLOBAL_EVENT_TYPE.SHOT].count,
});

export default connect(mapStateToProps)(ShotSwimlaneContents);
