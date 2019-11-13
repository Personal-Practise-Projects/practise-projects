import React from 'react';
import { connect } from 'react-redux';
import { BaseFilterController } from '../../components/Filter/controllers/base';
import BundlingView from '../../components/BundlingView';
import CalendarView from '../../components/CalendarView';
import ShotDetailView from '../../components/ShotDetailsView';
import SubHeader from '../../components/SubHeader';
import ScheduleDataHandler, { CALENDAR_BUTTON_GROUP } from './dataHandler';
import SplitListPage from '../SplitListTitlePage';
import LeftHeader from '../../components/CalendarSubHeader/LeftHeader';
import RightHeader from '../../components/CalendarSubHeader/RightHeader';
import { DETAILS_VIEW_EVENT } from '../../components/ShotDetailsView/constants';
import {
  DAY,
  GLOBAL_EVENT_TYPE,
  PRODUCTION_BOARD_STATE,
  WEEK,
} from '../../common/constants';
import { buildConditionalString } from '../../common/helpers';
import { clearDraggableShots } from './actions';
import { getDateTimeInUTC, getStartDateOfWeek } from '../../helpers/common';
import { updateTimeStampAndSelectedView } from '../../components/CalendarView/actions';
import { unSelectAllEvent } from '../../components/SelectItem/actions';
import Filter from '../../components/Filter';
import { storeActiveScreen } from '../../components/Filter/action';
import './SchedulePage.scss';

const BULK_CONFIG = {
  type: GLOBAL_EVENT_TYPE.SHOT,
  pageType: PRODUCTION_BOARD_STATE.PRODUCTION_CALENDAR,
};

class SchedulePage extends React.Component {
  constructor(props) {
    super(props);
    this.props.storeActiveScreen(PRODUCTION_BOARD_STATE.PRODUCTION_CALENDAR);
    this.dataHandler = new ScheduleDataHandler(props, this.searchEventListener);
    this.filterController = new BaseFilterController();
    this.state = {
      drawerOpen: false,
      bundlingOpen: true,
      searchParams: { type: null, search: null },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.dataHandler.updateProps(nextProps);
    return (
      this.props.calendarViewType !== nextProps.calendarViewType ||
      this.props.timestamp !== nextProps.timestamp ||
      this.props.shotsDict !== nextProps.shotsDict ||
      this.state.bundlingOpen !== nextState.bundlingOpen ||
      this.state.drawerOpen !== nextState.drawerOpen ||
      this.state.searchParams !== nextState.searchParams ||
      this.props.allowBulk !== nextProps.allowBulk ||
      this.state.shotDetailsProps !== nextState.shotDetailsProps
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.allowBulk !== prevProps.allowBulk ||
      this.state.searchParams !== prevState.searchParams ||
      this.props.timestamp !== prevProps.timestamp
    ) {
      // On search action or allow bulk operation reset need to reset the selection also
      this.props.unSelectAllEvent(GLOBAL_EVENT_TYPE.SHOT);
    }
    this.dataHandler.setShotsDict(this.props.shotsDict);
    this.dataHandler.updateProps(this.props);
  }

  toggleBundling = () => {
    this.setState({ bundlingOpen: !this.state.bundlingOpen });
  };

  render() {
    return (
      <SplitListPage
        id="schedule-page"
        classes={`production-calendar ${
          this.props.selectableState ? 'bulk-action' : ''
        }
          ${
            this.props.calendarViewType.id === DAY
              ? 'single-view-wrapper'
              : 'week-view-wrapper'
          }`}
        listClass={
          this.state.bundlingOpen
            ? 'schedule-page schedule-expanded position-relative'
            : 'schedule-page schedule-collapsed position-relative'
        }
        headerComponent={
          <SubHeader
            data={{ title: 'Production calendar' }}
            bulkAction={this.props.allowBulk ? BULK_CONFIG : null}
            leftChildren={this.getLeftChildren()}
            rightChildren={this.getRightChildren()}
          />
        }
        listComponent={this.getLeftComponent()}
        detailComponent={this.shotDetailsPanel()}
      />
    );
  }

  getLeftChildren = () => [
    <LeftHeader key="schedulePage-leftHeader" dataHandler={this.dataHandler} />,
  ];

  getRightChildren = () => [
    <Filter
      key="production-view-filter"
      filterType={GLOBAL_EVENT_TYPE.SHOT}
      controller={this.filterController}
    />,
    <RightHeader
      key="schedulePage-rightHeader"
      dataHandler={this.dataHandler}
    />,
  ];

  getLeftComponent() {
    return (
      <React.Fragment>
        <div
          className={buildConditionalString(
            'schedule-drawer',
            'd-block',
            this.props.calendarViewType.id === DAY,
            'd-none',
          )}
        >
          <div className="schedule-drawer-wrapper position-relative">
            <button
              type="button"
              onClick={() => this.toggleBundling()}
              className="primary-cta schedule-drawer-trigger d-flex align-items-center justify-content-center"
            >
              {this.state.bundlingOpen ? (
                <i className="icon-arrow-left" />
              ) : (
                <i className="icon-backlog-hamburger" />
              )}
            </button>
            <BundlingView
              eventListener={this.eventListener}
              dataHandler={this.dataHandler}
              searchParams={this.state.searchParams}
            />
          </div>
        </div>
        <div className="schedule-calendar position-relative">
          <CalendarView
            eventListener={this.eventListener}
            dataHandler={this.dataHandler}
            searchParams={this.state.searchParams}
          />
        </div>
      </React.Fragment>
    );
  }

  shotDetailsPanel() {
    return (
      this.props.calendarViewType.id === DAY &&
      this.state.drawerOpen &&
      this.state.shotDetailsProps && (
        <div className="splitpage-drawer animated slideInRight">
          <ShotDetailView {...this.state.shotDetailsProps} />
        </div>
      )
    );
  }

  eventListener = args => {
    switch (args.event) {
      case DETAILS_VIEW_EVENT.REFRESH_SHOT_DETAILS:
        if (this.state.drawerOpen) {
          this.setState({
            drawerOpen: true,
            shotDetailsProps: args.shotDetailsProps,
          });
        }
        break;
      case DETAILS_VIEW_EVENT.OPEN_SHOT_DETAIL:
        this.setState({
          drawerOpen: true,
          shotDetailsProps: args.shotDetailsProps,
        });
        break;
      case DETAILS_VIEW_EVENT.CLOSE_DETAILS_PANEL:
        this.setState({ drawerOpen: false });
        break;
      case WEEK:
        this.props.updateTimeStampAndSelectedView({
          calendarViewType: CALENDAR_BUTTON_GROUP[1],
          timestamp: getStartDateOfWeek(this.props.timestamp),
        });
        break;
      case DAY:
        this.props.updateTimeStampAndSelectedView({
          calendarViewType: CALENDAR_BUTTON_GROUP[0],
          timestamp: args.data,
        });
        break;
      default:
        break;
    }
  };

  searchEventListener = args => {
    this.setState({
      searchParams: {
        type: args ? args.type : null,
        search: args ? args.search : null,
      },
    });
  };

  componentWillUnmount() {
    // eslint-disable-next-line radix
    const currentTimeStamp = parseInt(getDateTimeInUTC(new Date()) / 1000);
    this.props.updateTimeStampAndSelectedView({
      calendarViewType: CALENDAR_BUTTON_GROUP[0],
      timestamp: currentTimeStamp,
    });
    // As all the draggable shots are storing in schedule page own reducer store so it can be provided to  across
    // different component on schedule page, when schedule page is unmount clear that shots dictionary
    this.props.clearDraggableShots();
  }
}

const mapStateToProps = state => ({
  shotsDict: state.schedule.shotsDict,
  timestamp: state.calendar.timestamp,
  calendarViewType: state.calendar.calendarViewType,
  allowBulk:
    state.calendar.calendarViewType &&
    state.calendar.calendarViewType.id === DAY,
  selectableState: state.selectedItems[GLOBAL_EVENT_TYPE.SHOT].count > 0,
});

const mapDispatchToProps = {
  updateTimeStampAndSelectedView,
  clearDraggableShots,
  unSelectAllEvent,
  storeActiveScreen,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SchedulePage);
