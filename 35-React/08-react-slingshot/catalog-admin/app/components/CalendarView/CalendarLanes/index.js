import React from 'react';
import connect from 'react-redux/es/connect/connect';

import Overlay from '../../Overlay';
import OverlayHandler from '../../ShotCard/overlayHandler';
import { getShotCard } from '../../ShotCard/factory';
import { buildConditionalString } from '../../../common/helpers';
import { DAY, GLOBAL_EVENT_TYPE, PRODUCTION_BOARD_STATE } from "../../../common/constants";

class CalendarLanes extends React.Component {
  constructor(props) {
    super(props);
    this.overlayHandler = new OverlayHandler();
    this.overlayHandler.setEventListener(this.eventListener);
    this.state = {
      showOverlay: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.showOverlay !== nextState.showOverlay ||
      this.props.shots !== nextProps.shots ||
      this.props.calendarViewType !== nextProps.calendarViewType ||
      this.props.timeStamp !== nextProps.timeStamp ||
      this.props.draggable !== nextProps.draggable
    );
  }

  render() {
    const currentHour =
      new Date().toTimeString().split(':')[0] === this.props.hour;
    return (
      <section
        className={buildConditionalString(
          'timeslot d-flex ',
          'current-slot',
          currentHour,
        )}
        data-droppable="true"
        data-hour={this.props.hour}
      >
        {getShotCard(
          this.props.calendarViewType,
          this.props.dataHandler,
          this.overlayHandler,
          this.props.shotList,
          {
            allowSelect: this.props.allowBulk,
            draggable: this.props.draggable,
            selectEventType: PRODUCTION_BOARD_STATE.PRODUCTION_CALENDAR
          }
        )}
        {this.state.showOverlay && (
          <Overlay
            header={this.props.header}
            dataHandler={this.overlayHandler}
            onClose={this.eventListener}
          />
        )}
      </section>
    );
  }

  eventListener = args => {
    this.setState({
      showOverlay: args.data,
    });
  };
}

const mapStateToProps = state => ({
  shots: state.calendar.shots,
  timeStamp: state.calendar.timeStamp,
  calendarViewType: state.calendar.calendarViewType,
  allowBulk: state.calendar.calendarViewType && state.calendar.calendarViewType.id === DAY && (
    state.common[GLOBAL_EVENT_TYPE.SHOT].bulkMeta[PRODUCTION_BOARD_STATE.PRODUCTION_CALENDAR] || []
  ).length > 0,
  draggable: state.selectedItems[GLOBAL_EVENT_TYPE.SHOT].count <= 0,
});

export default connect(
  mapStateToProps,
  null,
)(CalendarLanes);
