import React from 'react';

import { getChoices } from '../../helpers/services';
import ImageSelect from '../../components/ImageSelect';
import { PHOTOSHOOT_DONE_STATUSES } from './constants';

export default function getComponent(item) {
  switch (item.uid) {
    case 'shadows':
    case 'camera_angle':
    case 'cropping':
    case 'lighting':
      let data;
      getChoices(item.uid, choices => {
        data = choices[item.field_value] || item.field_value;
      });
      if (data && data.constructor === Object) {
        return <ImageSelect item={data} />;
      }
      break;
    default:
      return (
        <div className="description">
          {item.field_value ? item.field_value : '--'}
        </div>
      );
  }
}

export const isPhotoshootDone = status =>
  PHOTOSHOOT_DONE_STATUSES.includes(status);
