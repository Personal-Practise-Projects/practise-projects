import React from 'react';

import { DAY, WEEK } from '../../common/constants';
import DayViewShotCard from './DayViewShotCard';
import WeekViewShotCard from './WeekViewShotCard';
import { formatDateToString, getShotCounterInfo } from '../../helpers/common';

// TODO its implementation can be improve and keep single POC for events multiple handler are provided
export function getShotCard(
  calendarViewType,
  dataHandler,
  overlayHandler,
  shots,
  bulkConfig,
) {
  switch (calendarViewType.id) {
    case DAY:
      return shots.map(shot => (
        <DayViewShotCard
          key={shot.id}
          shotId={shot.id}
          shot={shot}
          onClick={dataHandler.eventListener}
          shotDataParser={dayShotDataParse}
          allowSelect={bulkConfig.allowSelect}
          draggable={bulkConfig.draggable}
          selectEventType={bulkConfig.selectEventType}
        />
      ));
    default:
    case WEEK:
      return shots.map(
        (shot, index) =>
          index < 2 ? (
            <WeekViewShotCard
              key={shot.id}
              shotId={shot.id}
              shot={shot}
              onClick={() => dataHandler.switchBetweenViews(shot)}
              shotDataParser={weekShotDataParse}
            />
          ) : index === 2 ? (
            overlayHandler.getViewMoreShots(shots)
          ) : (
            true
          ),
      );
  }
}

const dayShotDataParse = shot => ({
  id: shot.id,
  brand: shot.brand.brand_name,
  category: shot.shot_info.category.name,
  setup: shot.shot_info.setup_type.name,
  display_date: formatDateToString(shot.shot_info.due_date.timestamp),
  shotNumber: shot.shot_info.shot_number,
  selectableData: shot.shot_info.locked_info.readonly ? null : shot,
  shotStatus: shot.shot_info.status,
  owner: shot.shot_info.owner,
  locked: shot.shot_info.locked,
  type: 'calendar',
  shot,
  draggable: !shot.shot_info.locked_info.readonly,
  droppable: !shot.shot_info.locked_info.readonly,
  disabled: shot.shot_info.locked_info.readonly,
  counterInfo: getShotCounterInfo(shot),
});

const weekShotDataParse = shot => ({
  id: shot.id,
  brand: shot.brand.brand_name,
  shotNumber: shot.shot_info.shot_number,
  shotStatus: shot.shot_info.status,
  locked: shot.shot_info.locked,
  type: 'calendar',
  shot,
  counterInfo: getShotCounterInfo(shot),
});
