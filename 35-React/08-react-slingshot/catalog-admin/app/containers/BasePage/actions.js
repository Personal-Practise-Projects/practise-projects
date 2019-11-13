import {
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

export function openContentWidget(uploadWidget) {
  return {
    type: OPEN_CONTENT_WIDGET,
    payload: uploadWidget,
  };
}

export function closeContentWidget() {
  return {
    type: CLOSE_CONTENT_WIDGET,
  };
}

export function openNotifications() {
  return {
    type: OPEN_NOTIFICATION_LIST,
  };
}

export function closeNotifications() {
  return {
    type: CLOSE_NOTIFICATION_LIST,
  };
}

export function openLightBox(payload) {
  return {
    type: OPEN_LIGHT_BOX,
    payload,
  };
}

export function closeLightBox() {
  return {
    type: CLOSE_LIGHT_BOX,
  };
}

export function openBulkUpdate(controller) {
  return {
    type: OPEN_BULK_UPDATE,
    payload: controller,
  };
}

export function closeBulkUpdate() {
  return {
    type: CLOSE_BULK_UPDATE,
  };
}

// TODO why this action is here
export function showMarkUps() {
  return {
    type: TOGGLE_MARK_UP,
  };
}

export function toggleConfirmDialog(controller = null) {
  return {
    type: TOGGLE_CONFIRM_DIALOG,
    payload: controller,
  };
}

export function setLightBoxImageDimension(payload) {
  return {
    type: SET_LIGHT_BOX_IMAGE_DIMENSION,
    payload,
  };
}

export function pushNavigationStack(payload) {
  return {
    type: PUSH_NAVIGATION_STACK,
    payload,
  };
}

export function popNavigationStack() {
  return {
    type: REMOVE_FROM_NAVIGATION_STACK,
  };
}
