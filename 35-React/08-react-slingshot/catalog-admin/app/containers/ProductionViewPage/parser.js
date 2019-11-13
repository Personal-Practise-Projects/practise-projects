import noImage from '../../images/content-widget/imagecontent-placeholder.svg';
import cameraAngleIcon from '../../images/Icons/production-view/camera-angle-icon.svg';
import shadowsIcon from '../../images/Icons/production-view/shadow-icon.svg';
import croppingIcon from '../../images/Icons/production-view/crop-icon.svg';
import lightingIcon from '../../images/Icons/production-view/lighting-icon.svg';
import backgroundIcon from '../../images/Icons/production-view/background-icon.svg';

import { SELECTED_IMAGES_STATUS } from '../../common/constants';
import {
  formatDateToString,
  getFirstLetterCapitalizedWithoutUnderscore,
} from '../../helpers/common';

export function referenceImagesParser(data) {
  const parsedData = [];

  data.forEach(item => {
    if (SELECTED_IMAGES_STATUS.includes(item.status)) {
      parsedData.push({
        url: item.url,
        compressUrl: item.compress_url,
        thumbnailUrl: item.thumbnails.large,
        text: item.notes,
        imageExist: true,
      });
    }
  });
  return parsedData;
}

export function customParser(data) {
  /**
   * parser to convert product, props and talent images
   * in display format.
   */
  const parsedData = [];
  data.forEach(item => {
    let parsedObject = {
      url: noImage,
      imageExist: false,
      text: item.name,
    };
    for (let i = 0; i < item.images.length; i += 1) {
      if (SELECTED_IMAGES_STATUS.includes(item.images[i].status)) {
        parsedObject = {
          ...parsedObject,
          url: item.images[i].url,
          compressUrl: item.images[i].compress_url,
          thumbnailUrl: item.images[i].thumbnails.medium,
          imageExist: true,
        };
        break;
      }
    }
    parsedData.push(parsedObject);
  });
  return parsedData;
}

export function setupParser(data) {
  return [
    {
      url: backgroundIcon,
      field_name: 'Background',
      field_value: data.background,
    },
    {
      url: cameraAngleIcon,
      field_name: 'Camera angle',
      field_value: data.camera_angle,
      uid: 'camera_angle',
    },
    {
      url: shadowsIcon,
      field_name: 'Shadows',
      field_value: data.shadows,
      uid: 'shadows',
    },
    {
      url: lightingIcon,
      field_name: 'Lighting',
      field_value: data.lighting,
      uid: 'lighting',
    },
    {
      url: croppingIcon,
      field_name: 'Cropping',
      field_value: data.photo_cropping,
      uid: 'cropping',
    },
  ];
}

export function talentParser(talentList) {
  const parsedTalentList = [];
  talentList.forEach(talent => {
    const data = {};
    data[Object.keys(talent)[0]] = customParser(talent[Object.keys(talent)[0]]);
    parsedTalentList.push(data);
  });
  return parsedTalentList;
}

export function shotDataParser(shot) {
  return {
    id: shot.id,
    shotNotes: shot.shot_notes,
    propNotes: shot.prop_notes,
    productStyling: shot.product_styling,
    talentNotes: shot.talent_notes,
    apparelNotes: shot.apparel_notes,
    locationNotes: shot.location_notes,
    locationName:
      shot.shot_info.location_details && shot.shot_info.location_details.name,
    colorTag: shot.color_tag,
    dueDate: formatDateToString(shot.shot_info.due_date.timestamp),
    shotStatusTitle: getFirstLetterCapitalizedWithoutUnderscore(
      shot.shot_info.status,
    ),
    shotStatusValue: shot.shot_info.status,
    brand: shot.brand.brand_name,
    category: shot.shot_info.category.name,
    setup: shot.shot_info.setup_type.name,
    shotNumber: shot.shot_info.shot_number,
    owner: shot.shot_info.owner,
    type: 'backlog',
    shot,
    draggable: !shot.shot_info.locked_info.readonly,
    droppable: !shot.shot_info.locked_info.readonly,
    disabled: shot.shot_info.locked_info.readonly,
  };
}
