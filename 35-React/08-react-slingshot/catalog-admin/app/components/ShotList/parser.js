import {
  formatDateToString,
  getFirstLetterCapitalized,
  getFirstLetterCapitalizedWithoutUnderscore,
  getShotColorFromStatus,
} from '../../helpers/common';
import { DATE_FORMAT, GLOBAL_EVENT_TYPE } from '../../common/constants';

export function shotListParser(metaInfo, shotsDetails) {
  const parsedData = {
    headers: [],
    data: [],
  };
  metaInfo.map(info => {
    parsedData.headers.push({
      title: info.title,
      classes: info.classes,
      type: info.type,
      data_key: [info.data.key],
    });
  });
  shotsDetails.map(shotDetails => {
    const shotInfo = shotDetails.shot_info;
    parsedData.data.push({
      id: shotDetails.id,
      selectableData: shotDetails.shot_info.locked_info.readonly
        ? null
        : shotDetails,
      select: GLOBAL_EVENT_TYPE.SHOT,
      shot_number: { data: shotInfo.shot_number, classes: '' },
      status: {
        data: getFirstLetterCapitalizedWithoutUnderscore(shotInfo.status),
        classes: `status ${getShotColorFromStatus(shotInfo.status)}`,
      },
      products: {
        data: shotDetails.product_list.map(product => product.name).join(', '),
      },
      category: {
        data: `${getFirstLetterCapitalized(shotInfo.category.parent)}: ${
          shotInfo.category.name
        }`,
      },
      type: {
        data: shotInfo.setup_type.name,
      },
      schedule_on: {
        data: shotInfo.schedule_on
          ? formatDateToString(shotInfo.schedule_on.timestamp, DATE_FORMAT)
          : '',
      },
      due_date: {
        data: shotInfo.due_date
          ? formatDateToString(shotInfo.due_date.timestamp, DATE_FORMAT)
          : '',
      },
      // for photographer
      photographer: {
        data: shotInfo.photographer ? shotInfo.photographer.name : '',
      },
      shot_delete: {
        data: '',
        classes: 'icon icon-delete',
        header: {
          uid: 'shot_delete',
          updateWithData: shotDetails.id,
        },
        extraProps: { title: 'Delete shot' },
      },
    });
  });
  return parsedData;
}
