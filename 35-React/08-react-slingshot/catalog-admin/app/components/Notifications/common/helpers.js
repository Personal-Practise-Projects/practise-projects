// Helper function for creating navigation data and payload
import {
  NAVIGATION_ACTION_TYPE,
  NAVIGATION_STACK_TYPE,
  NOTIFICATION_FEATURE_UNIQUE_KEY_MAP,
  NOTIFICATION_TYPES
} from "./constants";
import { ArrayUtils, StringHelper } from "../../../helpers/utils";
import { SHOT_EDITED_CONTENT } from "../../ContentsChooser/actions/types";
import { getContentFeatures } from "../../../helpers/contentHelpers";


export function extractNavigationStack(notificationType, payload, requiredFeatures, allowedFeatures,) {
  const navigationStackFeatures = ArrayUtils.intersect(requiredFeatures, allowedFeatures);
  const matchedKeys = [];
  navigationStackFeatures.forEach(featureType => {
    return Object.keys(NOTIFICATION_FEATURE_UNIQUE_KEY_MAP).forEach(key => {
      if (NOTIFICATION_FEATURE_UNIQUE_KEY_MAP[key].includes(featureType) && !matchedKeys.includes(key)) {
        matchedKeys.push(key);
      }
    });
  });
  return matchedKeys.map(matchedKey => {
    return __NOTIFICATION_FEATURE_MAP[matchedKey](notificationType, payload)
  });
}

let __getShotListRedirection = function (notificationType, notificationPayload) {
  let crID;
  let shotId;
  if (notificationType === NOTIFICATION_TYPES.SHOT_COMMENT) {
    crID = notificationPayload.parent;
    shotId = notificationPayload.reference_id;
  } else {
    crID = notificationPayload.content_request;
    shotId = notificationPayload.shot;
  }
  const redirectionPath = StringHelper.format(
    '/shots?q=##&shotId=##',
    crID,
    shotId
  );
  return {
    type: NAVIGATION_STACK_TYPE.INTERNAL_REDIRECTION,
    uid: redirectionPath,
    payload: redirectionPath,
  };
};

let __getCRListRedirection = function (notificationType, notificationPayload) {
  const redirectionPath = StringHelper.format(
    '/content-requests?b=##&crId=##',
    notificationPayload.parent,
    notificationPayload.reference_id
  );
  return {
    type: NAVIGATION_STACK_TYPE.INTERNAL_REDIRECTION,
    uid: redirectionPath,
    payload: redirectionPath,
  };
};

let __getCommentScrollNavigation = function (notificationType, notificationPayload) {
  return {
    type: NAVIGATION_STACK_TYPE.SCROLL,
    uid: StringHelper.format('/shots?q=##&shotId=##', notificationPayload.parent, notificationPayload.reference_id),
    payload: 'comments',
  };
};


let __getPhotosScrollNavigation = function (notificationType, notificationPayload) {
  return {
    type: NAVIGATION_STACK_TYPE.SCROLL,
    uid: StringHelper.format('/shots?q=##&shotId=##', notificationPayload.parent, notificationPayload.reference_id),
    payload: 'photos',
  };
};
let __getEditWidgetNavigation = function (notificationType, payload) {
  return {
    type: NAVIGATION_STACK_TYPE.ACTION,
    event: NAVIGATION_ACTION_TYPE.OPEN_EDIT_WIDGET,
    uid: StringHelper.format(
      '##_##_##',
      payload.content_request,
      payload.shot,
      payload.reference_id,
    ),
    payload: {
      storeDataKey: StringHelper.format(
        '##.##',
        'shotsInfo.shotDict',
        payload.shot,
      ),
      ref: { id: payload.shot, shot_info: payload.shot_info },
      selectTabId: SHOT_EDITED_CONTENT,
    },
  };
};
let __getContentLightBoxNavigation = function (notificationType, payload) {
  return {
    type: NAVIGATION_STACK_TYPE.ACTION,
    event: NAVIGATION_ACTION_TYPE.OPEN_LIGHT_BOX,
    uid: StringHelper.format(
      '##_##_##',
      payload.content_request,
      payload.shot,
      payload.reference_id,
    ),
    payload: {
      src: payload.compress_url,
      errSrc: null,
      features: getContentFeatures(
        NOTIFICATION_TYPES.MARKUP_COMMENT,
        payload.reference_id,
        payload.url,
      ),
    },
  };
};

const __NOTIFICATION_FEATURE_MAP = {
  1: __getShotListRedirection,
  2: __getCRListRedirection,
  3: __getCommentScrollNavigation,
  4: __getEditWidgetNavigation,
  5: __getContentLightBoxNavigation,
};


