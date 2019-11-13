import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  fetchBundling,
  reArrangeBundlingShots,
  resetBundling,
  updateShotByPayload,
  updateShotCard,
} from './actions';

import { addBundlingDraggableShots } from '../../containers/SchedulePage/actions';
import { insertBefore, removeEntityFromEntityList } from '../../helpers/common';
import { EmptySearchResult } from '../EmptySearchResult/index';
import { DETAILS_VIEW_EVENT } from '../ShotDetailsView/constants';
import BundlingDragManager from './dragManager';
import Loader from '../Loader';
import BundlingPaginationHandler, { isDestinationCalendar } from './helpers';
import ShotList from './shotList';
import {
  DAY,
  GLOBAL_EVENT_TYPE,
  PRODUCTION_BOARD_STATE,
  SORT_PAGE_TYPES,
} from '../../common/constants';
// Import Component Specific Styling
import { setSortListMetaInfo } from '../SortDropDown/actions';
import { DEFAULT_SORT_TYPES } from '../ShotSwimlane/helpers';
import SortDropDown from '../SortDropDown';
import { SHOT_STATUS } from '../../common/shot/constants';

import './BundlingView.scss';

class BundlingView extends React.Component {
  constructor(props) {
    super(props);
    this.dragHandler = new BundlingDragManager(
      this.onDragged,
      props.dataHandler,
    );
    this.state = { showLoader: true };
    this.createBundlingFetchHandler();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.shotsDict !== nextProps.shotsDict) {
      this.dragHandler.setShots([...this.props.bundlingShots]);
      return true;
    }
    return (
      this.props.calendarViewType !== nextProps.calendarViewType ||
      this.props.searchParams !== nextProps.searchParams ||
      this.state.showLoader !== nextState.showLoader ||
      this.props.bundlingShots !== nextProps.bundlingShots ||
      this.props.draggable !== nextProps.draggable ||
      this.props.appliedFilters !== nextProps.appliedFilters
    );
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.searchParams !== this.props.searchParams ||
      prevProps.appliedFilters !== this.props.appliedFilters
    ) {
      this.createBundlingFetchHandler();
      this.fetchData();
    }
    this.dragHandler.enableShotDragging();
    this.props.addBundlingDraggableShots(this.props.shotsDict);
  }

  componentDidMount() {
    this.props.setSortListMetaInfo({
      activeScreen: PRODUCTION_BOARD_STATE.PRODUCTION_CALENDAR,
      data: DEFAULT_SORT_TYPES,
    });
    this.fetchData();
  }

  componentWillUnmount() {
    this.bundlingPaginatedDataHandler &&
      this.bundlingPaginatedDataHandler.cancelExistingRequests();
    // Reset bundling on switch from view
    this.props.resetBundling();
  }

  render() {
    const totalShots = Object.entries(this.props.shotsDict).length;
    if (this.state.showLoader) {
      return <Loader />;
    }
    return (
      <React.Fragment>
        <div className="schedule-drawer-header position-relative">
          <div className="left-section">
            <h3 className="title">Bundling</h3>
            {totalShots > 0 && (
              <span className="drawer-count d-flex align-items-center justify-content-center">
                {totalShots}
              </span>
            )}
          </div>
          <div className="right-section">
            {totalShots > 0 && (
              <SortDropDown
                metaInfo={{
                  activeScreen: PRODUCTION_BOARD_STATE.PRODUCTION_CALENDAR,
                  activeScreenType: SORT_PAGE_TYPES.BUNDLING,
                }}
              />
            )}
          </div>
        </div>
        {totalShots > 0 ? (
          <div className="schedule-drawer-body">
            <ShotList
              shots={this.props.bundlingShots}
              allowBulk={this.props.allowBulk}
              draggable={this.props.draggable}
              selectEventType={PRODUCTION_BOARD_STATE.PRODUCTION_CALENDAR}
              onClickListener={this.shotCardClicked}
            />
          </div>
        ) : (
          <EmptySearchResult />
        )}
      </React.Fragment>
    );
  }

  onDragged = (swappableCards, droppedShotDetail) => {
    const draggedShot = swappableCards.toInsert;
    const beforeShot = swappableCards.insertBefore;

    this.updateShotCardListAndRearrangeCards(
      beforeShot,
      draggedShot,
      droppedShotDetail,
    );
    if (draggedShot) {
      const updateWithData = {
        shot_info: {
          schedule_on: null,
          status: SHOT_STATUS.BUNDLING,
        },
      };
      this.props.updateShotCard(draggedShot.id, JSON.stringify(updateWithData));
    }
  };

  updateShotCardListAndRearrangeCards = (
    beforeShot,
    draggedShot,
    droppedShotDetail,
  ) => {
    let updatedSequence = [];
    if (isDestinationCalendar(droppedShotDetail)) {
      updatedSequence = removeEntityFromEntityList(
        [...this.props.bundlingShots],
        droppedShotDetail.info.id,
        'id',
      );
      this.props.reArrangeBundlingShots(updatedSequence);
    } else {
      // TODO need to be verify
      updatedSequence = insertBefore(
        this.props.bundlingShots,
        beforeShot,
        draggedShot,
        'id',
      );
      this.props.reArrangeBundlingShots(updatedSequence);
    }
  };

  shotCardClicked = shot => {
    // Pass clicked event to schedule page so it can open the shot details
    this.props.eventListener({
      event: DETAILS_VIEW_EVENT.OPEN_SHOT_DETAIL,
      shotDetailsProps: { shot, eventListener: this.shotDetailsEventListener },
    });
  };

  shotDetailsEventListener = args => {
    switch (args.event) {
      case DETAILS_VIEW_EVENT.UPDATED_SHOT_DETAILS:
        // Working check
        this.props.updateShotByPayload(args.payload);
        // Notify parent so it should update the shot detail page too
        this.shotCardClicked(args.payload);
        break;
      case DETAILS_VIEW_EVENT.REFRESH_SHOT_DETAILS:
        // Refresh shot detail in side panel
        this.props.eventListener({
          event: DETAILS_VIEW_EVENT.REFRESH_SHOT_DETAILS,
          shotDetailsProps: {
            shot: args.shot,
            eventListener: this.shotDetailsEventListener,
          },
        });
        break;
      default:
        this.props.eventListener(args);
        break;
    }
  };

  createBundlingFetchHandler = () => {
    if (this.bundlingPaginatedDataHandler) {
      this.bundlingPaginatedDataHandler.cancelExistingRequests();
    }
    this.props.resetBundling();
    this.bundlingPaginatedDataHandler = new BundlingPaginationHandler(
      this.props.fetchBundlingDispatcher,
      this.props.searchParams.search,
      this.props.appliedFilters,
    );
  };

  fetchData = () => {
    this.bundlingPaginatedDataHandler.fetch(() => {
      this.setState({ showLoader: false });
    });
    this.setState({ showLoader: true });
  };
}

BundlingView.propTypes = {
  eventListener: PropTypes.func.isRequired,
  fetchBundlingDispatcher: PropTypes.func.isRequired,
  updateShotByPayload: PropTypes.func.isRequired,
  reArrangeBundlingShots: PropTypes.func.isRequired,
  updateShotCard: PropTypes.func.isRequired,
  resetBundling: PropTypes.func.isRequired,
  setSortListMetaInfo: PropTypes.func.isRequired,
  addBundlingDraggableShots: PropTypes.func.isRequired,
  allowBulk: PropTypes.bool,
  draggable: PropTypes.bool,
  calendarViewType: PropTypes.object,
  searchParams: PropTypes.object,
  shotsDict: PropTypes.object,
  appliedFilters: PropTypes.object,
  dataHandler: PropTypes.object.isRequired,
  bundlingShots: PropTypes.array,
};

const mapStateToProps = state => {
  let filters = {};
  if (state.filters[state.filters.activeScreen]) {
    filters = {
      selectedFilters:
        state.filters[state.filters.activeScreen].selectedFilters,
      appliedFilters: state.filters[state.filters.activeScreen].appliedFilters,
    };
  }

  return {
    ...filters,
    bundlingShots: state.bundling.bundlingShots,
    shotsDict: state.bundling.shotsDict,
    calendarViewType: state.calendar.calendarViewType,
    filtersConfig: state.common.shot.filters[state.filters.activeScreen],
    allowBulk:
      state.calendar.calendarViewType &&
      state.calendar.calendarViewType.id === DAY &&
      (
        state.common[GLOBAL_EVENT_TYPE.SHOT].bulkMeta[
          PRODUCTION_BOARD_STATE.PRODUCTION_CALENDAR
        ] || []
      ).length > 0,
    draggable: state.selectedItems[GLOBAL_EVENT_TYPE.SHOT].count <= 0,
  };
};

const mapDispatchToProps = {
  fetchBundlingDispatcher: fetchBundling,
  resetBundling,
  addBundlingDraggableShots,
  reArrangeBundlingShots,
  updateShotByPayload,
  setSortListMetaInfo,
  updateShotCard,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BundlingView);
