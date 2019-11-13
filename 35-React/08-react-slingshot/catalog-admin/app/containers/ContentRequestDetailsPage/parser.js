import { CONTENT_REQUEST_DETAILS_LISTS } from '../../common/constants';

export function parseSelectedInfo(selectedInfo) {
  if (selectedInfo) {
    switch (selectedInfo.type) {
      case CONTENT_REQUEST_DETAILS_LISTS.PRODUCT_TYPE: {
        return {
          selectedEntity: selectedInfo.product,
          selectedEntityHeader: selectedInfo.headers,
          selectedEntityType: selectedInfo.type,
        };
      }
      case CONTENT_REQUEST_DETAILS_LISTS.SHOTS_TYPE: {
        return {
          selectedEntity: selectedInfo.shot,
          selectedEntityHeader: selectedInfo.headers,
          selectedEntityType: selectedInfo.type,
        };
      }
      default:
        return {
          selectedEntity: selectedInfo.shot,
          selectedEntityHeader: selectedInfo.headers,
          selectedEntityType: selectedInfo.type,
        };
    }
  } else {
    return {
      selectedEntity: '',
      selectedEntityHeader: '',
      selectedEntityType: '',
    };
  }
}
