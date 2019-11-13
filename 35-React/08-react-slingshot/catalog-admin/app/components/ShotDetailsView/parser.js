import { buildCategoryOption, parseCategory } from '../../helpers/shotHelpers';
import {
  getFirstLetterCapitalized,
  getShotColorFromStatus,
} from '../../helpers/common';

export function categoryOptions(existing, options) {
  if (existing) {
    // const categories = options.filter(category => category.parent === existing.parent);
    // return buildCategoryOption(parseCategory(existing), categories)
    return buildCategoryOption(parseCategory(existing), options);
  }
  return options;
}

export function shotHeaderParser(shot, headers) {
  const header = headers && headers.length > 0 ? headers[0] : { data: [] };
  const parsedData = {};
  parsedData.id = shot.id;
  parsedData.title = shot.brand.brand_name;
  parsedData.subTitle = shot.shot_info.shot_number;
  header.data.forEach(feature => {
    if (feature.uid === '#status') {
      feature.displayStatus =
        shot.shot_info.displayStatus || shot.shot_info.status;
      feature.existingStatus = shot.shot_info.status;
      feature.statusColorClass = getShotColorFromStatus(feature.displayStatus);
      feature.statusText = getFirstLetterCapitalized(feature.displayStatus);
    }
  });
  parsedData.features = [];
  parsedData.features.push(header);
  parsedData.contentRequestId = shot.content_request;
  return parsedData;
}
