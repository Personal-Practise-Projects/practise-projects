import {
  formatDateToString,
  getDateTimeInLocalTimeZone,
} from '../../helpers/common';
import { DATE_FORMAT } from '../../common/constants';

export function contentRequestListParser(metaInfo, contentRequestList) {
  const parsedData = {
    headers: [],
    data: [],
  };
  metaInfo.content_request_list_meta_info.map(info => {
    parsedData.headers.push({
      title: info.title,
      classes: info.classes,
      type: info.type,
      data_key: info.data_key,
    });
  });
  contentRequestList.map(contentRequest => {
    parsedData.data.push({
      id: contentRequest.id,
      status: contentRequest.status,
      brand: contentRequest.brand.name,
      creator: contentRequest.brand.user
        ? `${contentRequest.brand.user.name} (${
            contentRequest.brand.user.email
          })`
        : '-',
      category: contentRequest.category,
      added_on: formatDateToString(
        getDateTimeInLocalTimeZone(contentRequest.added_on * 1000),
        DATE_FORMAT,
      ),
      shot_list_cta: {
        title: contentRequest.shot_list_cta,
        link: `/shots?q=${contentRequest.id}`,
      },
      payment_cta: {
        title: 'View payment/invoice',
        link: contentRequest.payment_cta,
      },
      account_manager: contentRequest.account_manager
        ? contentRequest.account_manager.name ||
          contentRequest.account_manager.email
        : '',
    });
  });
  return parsedData;
}

export function accountManagersParser(accountManagerList) {
  const parsedData = {};
  accountManagerList.map(user => {
    parsedData[user.id] = {
      id: user.id,
      email: user.email,
      key: user.email,
      name: user.name || user.email,
      src: user.profile_picture_thumbnail.small,
      appearance: 'circle',
      size: 'small',
      enableTooltip: true,
    };
  });
  return parsedData;
}
