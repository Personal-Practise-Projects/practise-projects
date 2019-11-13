import {
  CLEAR_NAVIGATION_STACK,
  CLOSE_BULK_UPDATE,
  CLOSE_CONTENT_WIDGET,
  CLOSE_LIGHT_BOX,
  CLOSE_NOTIFICATION_LIST,
  OPEN_BULK_UPDATE,
  OPEN_CONTENT_WIDGET,
  OPEN_LIGHT_BOX,
  OPEN_NOTIFICATION_LIST,
  PUSH_NAVIGATION_STACK,
  REMOVE_FROM_NAVIGATION_STACK,
  SET_LIGHT_BOX_IMAGE_DIMENSION,
  TOGGLE_CONFIRM_DIALOG,
  TOGGLE_MARK_UP,
} from '../../actions/types';

/**
 * @type {{
 *  uploadWidget: {},
 *  showNotificationList: boolean,
 *  showMarkUps: boolean,
 *  confirmDialogController: null,
 *  lightBox: null,
 *  bulkUpdateController: null,
 *  navigationStack: Array Navigation stack is array of objects and an object  will have following configuration:
 *  {
 *      type:'REDIRECT', 'SCROLL' or 'ACTION', uid:unique identifier for factory, payload:Data Payload
 *  }
 * }}
 */
export const BASE_INITIAL_STATE = {
  uploadWidget: {},
  lightBox: null,
  showNotificationList: false,
  showMarkUps: false,
  bulkUpdateController: null,
  confirmDialogController: null,
  navigationStack: [],
};

export function baseReducer(state = BASE_INITIAL_STATE, { type, payload }) {
  switch (type) {
    case OPEN_CONTENT_WIDGET:
      state = { ...state };
      if (!state.uploadWidget.injectors) {
        state.uploadWidget = payload;
      }
      return state;
    case OPEN_LIGHT_BOX:
      state = { ...state };
      state.lightBox = payload;
      return state;
    case CLOSE_CONTENT_WIDGET:
      state = { ...state };
      state.uploadWidget = {};
      return state;
    case OPEN_NOTIFICATION_LIST:
      state = { ...state };
      state.showNotificationList = true;
      return state;
    case CLOSE_NOTIFICATION_LIST:
      state = { ...state };
      state.showNotificationList = false;
      return state;
    case CLOSE_LIGHT_BOX:
      state = { ...state };
      state.lightBox = null;
      state.showMarkUps = false;
      return state;
    case TOGGLE_MARK_UP:
      state = { ...state };
      state.showMarkUps = !state.showMarkUps;
      return state;
    case OPEN_BULK_UPDATE:
      state = { ...state };
      state.bulkUpdateController = payload;
      return state;
    case CLOSE_BULK_UPDATE:
      state = { ...state };
      state.bulkUpdateController = null;
      return state;
    case TOGGLE_CONFIRM_DIALOG:
      state = { ...state };
      state.confirmDialogController = payload;
      return state;
    case SET_LIGHT_BOX_IMAGE_DIMENSION:
      state = { ...state };
      state.lightBox.imageWidth = payload.width;
      state.lightBox.imageHeight = payload.height;
      return state;
    // Reducer event for navigation stack
    case CLEAR_NAVIGATION_STACK:
      state.navigationStack = [];
      return { ...state };
    case REMOVE_FROM_NAVIGATION_STACK:
      state.navigationStack.shift();
      return { ...state };
    case PUSH_NAVIGATION_STACK:
      state.navigationStack = payload;
      return { ...state };
    default:
      state = { ...state };
      return state;
  }
}
