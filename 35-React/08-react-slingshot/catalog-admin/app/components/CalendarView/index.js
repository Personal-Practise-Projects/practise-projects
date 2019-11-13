import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CalendarDragManager from './dragManager';
import {
  addDaysInTimestamp,
  buildScheduleOn,
  removeEntityFromEntityObject,
} from '../../helpers/common';
import {
  calendarDateChanged,
  fetchProductionCalenderCards,
  rearrangeCalendarShots,
  updateCalendar,
  updateShotCard,
  resetCalendarShots,
} from './actions';
import {
  addCalendarDraggableShots,
  clearCalendarDraggableShots,
} from '../../containers/SchedulePage/actions';
import { LOADER } from '../../common/constants';
import Loader from '../Loader';
import { DETAILS_VIEW_EVENT } from '../ShotDetailsView/constants';
import DataHandler from './dataHandler';
import DayView from '../DayView';
import CalendarTimeFrames from './CalendarTimeFrames';
import {
  getClassNameBySelectedViewType,
  getDateToShotMap,
  isDestinationBundling,
} from './helpers';
import { buildConditionalString } from '../../common/helpers';
// Import Component Specific Styling
import './CalendarView.scss';
import { addStatusField } from '../ShotDetailsView/helper';
import { SCHEDULE_PAGE_TYPE } from '../../containers/SchedulePage/constants';

class CalendarView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: true,
    };
    this.dragHandler = new CalendarDragManager(
      this.onDragged,
      props.dataHandler,
    );
    this.dataHandler = new DataHandler(props, this.eventListener);
  }

  componentDidMount() {
    this.dataHandler.fetchCalendarCards(this.props.timestamp);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.shots !== nextProps.shots) {
      this.dragHandler.setShots(nextProps.shots);
      return true;
    }
    return (
      this.props.timestamp !== nextProps.timestamp ||
      this.props.calendarViewType !== nextProps.calendarViewType ||
      this.props.searchParams !== nextProps.searchParams ||
      this.state.showLoader !== nextState.showLoader ||
      this.props.appliedFilters !== nextProps.appliedFilters
    );
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.timestamp !== this.props.timestamp ||
      this.props.searchParams !== prevProps.searchParams ||
      this.props.calendarViewType !== prevProps.calendarViewType ||
      prevProps.appliedFilters !== this.props.appliedFilters
    ) {
      this.props.resetCalendarShots();
      this.dataHandler.updateProps(this.props);
      this.dataHandler.fetchCalendarCards(
        this.props.timestamp,
        this.props.appliedFilters,
      );
    } else {
      this.dataHandler.updateProps(this.props);
      this.enableShotDragging();
      this.props.addCalendarDraggableShots(this.props.shotsDict);
    }
  }

  render() {
    return this.state.showLoader ? (
      <Loader />
    ) : (
      <React.Fragment>
        <div
          className={buildConditionalString(
            'calendar-wrapper',
            getClassNameBySelectedViewType(this.props.calendarViewType),
          )}
        >
          <div className="timeframes-wrapper">
            <div className="pst">
              <i className="icon-schedule" />
              <span className="timezone d-block">PST</span>
            </div>
            <div className="timeframes">
              <CalendarTimeFrames />
            </div>
          </div>
          <section className="days-wrapper">
            {Array.from(new Array(this.props.calendarViewType.range)).map(
              (_, index) => {
                const timestamp = addDaysInTimestamp(
                  this.props.timestamp * 1000,
                  index,
                );
                const key = buildConditionalString(
                  timestamp,
                  this.props.shots[timestamp] &&
                    this.props.shots[timestamp].length,
                );
                return (
                  <DayView
                    key={key}
                    timestamp={timestamp}
                    dataHandler={this.dataHandler}
                    index={index}
                  />
                );
              },
            )}
          </section>
        </div>
      </React.Fragment>
    );
  }

  enableShotDragging = () => {
    const draggableShotCards = document.querySelectorAll(
      '.day-view .shot-card',
    );
    const droppableSlots = document.querySelectorAll('.timeslot');
    this.dragHandler.enableShotDragging(draggableShotCards, droppableSlots);
  };

  onDragged = (draggedShotDetail, timeSlot) => {
    this.updateShotCardListAndRearrangeCards(draggedShotDetail, timeSlot);
    if (!isDestinationBundling(draggedShotDetail))
      this.updateShotCardDBInfo(draggedShotDetail, timeSlot);
  };

  updateShotCardListAndRearrangeCards = (draggedShotDetail, timeSlot) => {
    const updatedCardList = [];
    Object.assign(updatedCardList, this.props.shots);
    if (
      isDestinationBundling(draggedShotDetail) &&
      this.props.dataHandler.getDroppedOverShotInfo().id !== ''
    ) {
      removeEntityFromEntityObject(
        updatedCardList,
        draggedShotDetail.info.id,
        'id',
      );
    } else {
      const draggedShotSource = draggedShotDetail.source;
      const draggedShotInfo = draggedShotDetail.info;
      draggedShotInfo.shot_info.schedule_on.timestamp = new Date(
        buildScheduleOn(timeSlot, this.props.timestamp),
      ).getTime();
      if (draggedShotSource === SCHEDULE_PAGE_TYPE.BUNDLING) {
        getDateToShotMap(draggedShotInfo, updatedCardList);
      }
    }
    this.props.rearrangeCalendarShots(updatedCardList);
  };

  // Updates shot card info by making a server call
  // Refresh shot detail in side panel
  updateShotCardDBInfo = (draggedShotDetail, timeSlot) => {
    const draggedShot = draggedShotDetail.info;
    draggedShot.shot_info.schedule_on.timestamp = new Date(
      buildScheduleOn(timeSlot, this.props.timestamp),
    ).getTime();
    const updateWithData = draggedShot.shot_info.schedule_on.timestamp;
    this.props.updateShotCard(
      draggedShot.id,
      JSON.stringify({ ...addStatusField(updateWithData) }),
    );
    this.shotDetailsEventListener({
      event: DETAILS_VIEW_EVENT.REFRESH_SHOT_DETAILS,
      shot: draggedShot,
    });
  };

  shotCardClicked = shot => {
    this.props.eventListener({
      event: DETAILS_VIEW_EVENT.OPEN_SHOT_DETAIL,
      shotDetailsProps: { shot, eventListener: this.shotDetailsEventListener },
    });
  };

  eventListener = args => {
    switch (args.event) {
      case LOADER:
        this.setState({
          showLoader: args.data,
        });
        break;
      default:
        this.shotCardClicked(args);
    }
  };

  shotDetailsEventListener = args => {
    switch (args.event) {
      case DETAILS_VIEW_EVENT.UPDATED_SHOT_DETAILS:
        this.props.updateCalendar(args.payload);
        // Notify parent so it should update the shot detail page too
        this.shotCardClicked(args.payload);
        break;
      case DETAILS_VIEW_EVENT.REFRESH_SHOT_DETAILS:
        // Refresh shot detail in side panel
        this.props.eventListener({
          event: DETAILS_VIEW_EVENT.REFRESH_SHOT_DETAILS,
          shotDetailsProps: {
            shot: args.shot,
            metaInfo: this.props.metaInfo,
            eventListener: this.shotDetailsEventListener,
          },
        });
        break;
      default:
        this.props.eventListener(args);
        break;
    }
  };
}

CalendarView.propTypes = {
  shots: PropTypes.object,
  shotsDict: PropTypes.object,
  timestamp: PropTypes.number,
  dataHandler: PropTypes.object,
  metaInfo: PropTypes.array,
  updateCalendar: PropTypes.func,
  updateShotCard: PropTypes.func,
  eventListener: PropTypes.func,
  rearrangeCalendarShots: PropTypes.func,
  addCalendarDraggableShots: PropTypes.func,
  resetCalendarShots: PropTypes.func,
  calendarViewType: PropTypes.object,
  searchParams: PropTypes.object,
  appliedFilters: PropTypes.object,
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
    shots: state.calendar.shots,
    shotsDict: state.calendar.shotsDict,
    timestamp: state.calendar.timestamp,
    calendarViewType: state.calendar.calendarViewType,
  };
};

const mapDispatchToProps = {
  addCalendarDraggableShots,
  calendarDateChanged,
  clearCalendarDraggableShots,
  fetchProductionCalenderCards,
  updateCalendar,
  updateShotCard,
  rearrangeCalendarShots,
  resetCalendarShots,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CalendarView);
