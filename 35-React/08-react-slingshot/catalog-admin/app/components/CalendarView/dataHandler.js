import { DAY, LOADER, WEEK } from '../../common/constants';
import { canLoadDayView, scrollCurrentSlotIntoView } from './helpers';
import { dateToServerTimestamp } from '../../helpers/common';

export default class DataHandler {
  constructor(props, eventListener) {
    this.props = { ...props };
    this.eventListener = eventListener;
  }

  updateProps = props => {
    Object.assign(this.props, { ...props });
  };

  fetchCalendarCards = (timestamp, filterParams) => {
    const forStartDate = dateToServerTimestamp(
      new Date(
        `${new Date(timestamp * 1000).toDateString()} 00:00:00`,
      ).getTime(),
    );
    this.props.fetchProductionCalenderCards(
      forStartDate,
      this.props.calendarViewType.range,
      this.props.searchParams,
      filterParams,
      () => {
        this.eventListener({ event: LOADER, data: false });
        scrollCurrentSlotIntoView();
      },
    );
  };

  switchBetweenViews = timestamp => {
    switch (this.props.calendarViewType.id) {
      case DAY:
        this.props.eventListener({
          event: WEEK,
        });
        break;
      case WEEK:
      default:
        if (canLoadDayView(timestamp)) {
          this.props.eventListener({
            event: DAY,
            data: timestamp / 1000,
          });
        }
        break;
    }
  };
}
