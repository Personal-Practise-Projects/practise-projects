import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { GLOBAL_EVENT_TYPE } from '../../common/constants';
import ShotSwimlane from '../ShotSwimlane';
import ShotSwimlaneDataHandler from '../ShotSwimlane/dataHandler';
import {
  clearSwimLaneData,
  fetchSwimlane,
  fetchSwimlaneMetaInfo,
  swimlaneCardMoveHandler,
} from '../ShotSwimlane/actions';

import { updateShotByPayload } from '../../actions/commonActions';
import { DETAILS_VIEW_EVENT } from '../ShotDetailsView/constants';
import ProductionBoardDragManager from './dragHandler';

import './ProductionBoard.scss'; // Import Component Specific Styling
import { DEFAULT_SORT_TYPES } from '../ShotSwimlane/helpers';
import { setSortListMetaInfo } from '../SortDropDown/actions';

class ProductionBoard extends React.Component {
  constructor(props) {
    super(props);
    this.dragHandler = new ProductionBoardDragManager(
      this.onDragged,
      this.props.shotsDict,
    );
    this.state = {
      swimlaneDataHandlers: {},
    };
  }

  render() {
    return (
      <div className="production-board-content">
        <div className="vertical-swimlanes d-flex">{this.getSwimlanes()}</div>
      </div>
    );
  }

  componentDidMount() {
    this.props.fetchSwimlaneMetaInfo(this.props.extraInfo.stage);
    this.props.setSortListMetaInfo({
      activeScreen: this.props.extraInfo.stage,
      data: DEFAULT_SORT_TYPES,
    });
  }

  componentWillUnmount() {
    this.props.clearSwimLaneData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.metaInfo !== this.props.metaInfo) {
      const swimlaneDataHandlers = {};
      Object.keys(this.props.metaInfo).forEach(swimlaneType => {
        swimlaneDataHandlers[swimlaneType] = new ShotSwimlaneDataHandler(
          this.props.fetchSwimlane,
          swimlaneType,
        );
      });
      this.setState({ swimlaneDataHandlers });
    }
    if (prevProps.shotsDict !== this.props.shotsDict) {
      this.dragHandler.setShotDict(this.props.shotsDict);
    }
  }

  getSwimlanes() {
    const swimlanesLayout = [];
    Object.keys(this.state.swimlaneDataHandlers).forEach(swimlaneType => {
      swimlanesLayout.push(
        <ShotSwimlane
          key={swimlaneType}
          allowBulk={this.props.allowBulk}
          cardClickCallback={this.shotCardClicked}
          dragHandler={this.dragHandler}
          dataHandler={this.state.swimlaneDataHandlers[swimlaneType]}
          swimlaneType={swimlaneType}
          stage={this.props.extraInfo.stage}
        />,
      );
    });
    return swimlanesLayout;
  }

  onDragged = (draggedShot, toStatus, fromSwimlane, toSwimlane) => {
    // Update server with latest state for the shot
    this.props.swimlaneCardMoveHandler(
      draggedShot,
      toStatus,
      fromSwimlane,
      toSwimlane,
    );
  };

  shotCardClicked = shot => {
    // Pass clicked event to schedule page so it can open the shot details
    this.props.eventListener({
      event: DETAILS_VIEW_EVENT.OPEN_SHOT_DETAIL,
      shotDetailsProps: {
        selectedShotId: shot,
        shotDetailsEventListener: this.shotDetailsEventListener,
      },
    });
  };

  shotDetailsEventListener = args => {
    switch (args.event) {
      case DETAILS_VIEW_EVENT.UPDATED_SHOT_DETAILS:
        this.props.updateShotByPayload(args.payload);
        // Notify parent so it should update the shot detail page too
        this.shotCardClicked(args.payload);
        break;
      case DETAILS_VIEW_EVENT.CLOSE_DETAILS_PANEL:
        this.props.eventListener({
          event: DETAILS_VIEW_EVENT.CLOSE_DETAILS_PANEL,
        });
        break;
      default:
        break;
    }
  };
}

ProductionBoard.propTypes = {
  allowBulk: PropTypes.bool,
  clearSwimLaneData: PropTypes.func,
  eventListener: PropTypes.func.isRequired,
  extraInfo: PropTypes.object,
  fetchSwimlane: PropTypes.func,
  fetchSwimlaneMetaInfo: PropTypes.func,
  metaInfo: PropTypes.object,
  shotsDict: PropTypes.object,
  swimlaneCardMoveHandler: PropTypes.func,
  updateShotByPayload: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  metaInfo: state.swimlane.metaInfo,
  shots: state.swimlane.shots,
  shotsDict: state.swimlane.shotsDict,
  allowBulk:
    (
      state.common[GLOBAL_EVENT_TYPE.SHOT].bulkMeta[ownProps.extraInfo.stage] ||
      []
    ).length > 0,
});

const mapDispatchToProps = {
  clearSwimLaneData,
  fetchSwimlane,
  fetchSwimlaneMetaInfo,
  swimlaneCardMoveHandler,
  updateShotByPayload,
  setSortListMetaInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductionBoard);
