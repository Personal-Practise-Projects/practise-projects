import { formatDateToString } from '../../helpers/common';
import { DATE_FORMAT, DAY } from '../../common/constants';
import { SCHEDULE_PAGE_TYPE } from '../../containers/SchedulePage/constants';

export function scrollCurrentSlotIntoView() {
  const currentHour = new Date().toTimeString().split(':')[0];
  let currentTimeSlot = parseInt(currentHour) - 2;
  currentTimeSlot =
    `${currentTimeSlot}`.length === 1 ? `0${currentTimeSlot}` : currentTimeSlot;

  const timeSlotElementForView = document.querySelectorAll(
    `[data-hour="${currentTimeSlot}"]`,
  )[0];
  if (timeSlotElementForView) {
    timeSlotElementForView.scrollIntoView();
  }
}

export function parseShotDetails(shots) {
  const hourToShotMap = {};
  shots &&
    shots.map(shotDetail => {
      const dateString = new Date(
        shotDetail.shot_info.schedule_on.timestamp,
      ).toTimeString();
      const hour = dateString.split(':')[0];
      if (hourToShotMap.hasOwnProperty(hour)) {
        hourToShotMap[hour].push(shotDetail);
      } else {
        hourToShotMap[hour] = [shotDetail];
      }
    });
  return hourToShotMap;
}

export function createDateMapToShots(shots) {
  const dateToShotMap = {};
  shots && shots.map(shotDetail => getDateToShotMap(shotDetail, dateToShotMap));
  return dateToShotMap;
}

export function getDateToShotMap(shotDetail, dateToShotMap) {
  const dateString = formatDateToString(
    shotDetail.shot_info.schedule_on.timestamp,
    DATE_FORMAT,
  );
  if (dateToShotMap.hasOwnProperty(dateString)) {
    dateToShotMap[dateString].push(shotDetail);
  } else {
    dateToShotMap[dateString] = [shotDetail];
  }
}

export function canLoadDayView(timestamp) {
  return (
    new Date(`${new Date(timestamp).toDateString()} 00:00:00`).getTime() >=
    new Date(`${new Date().toDateString()} 00:00:00`).getTime()
  );
}

export function getClassNameBySelectedViewType(calendarViewType) {
  return calendarViewType.id === DAY ? 'single-view' : 'week-view';
}

export function isDestinationBundling(draggedShot) {
  return (
    draggedShot.source === SCHEDULE_PAGE_TYPE.CALENDAR &&
    draggedShot.destination === SCHEDULE_PAGE_TYPE.BUNDLING
  );
}
