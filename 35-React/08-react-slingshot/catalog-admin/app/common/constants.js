// Common app Api END points
import { StringHelper } from '../helpers/utils';
import { CONTENT_STATUS } from '../components/ContentsChooser/common/constants';

export const CATEGORY_LIST = 'categories/';
export const BUSINESS_USER_LIST = 'business-users/';
export const BRAND_LIST = 'admin-brands/';

// A file upload and other status
export const WAITING = 'WAITING';
export const UPLOADING = 'UPLOADING';
export const DONE = 'DONE';
export const CANCELED = 'CANCELED';
export const FAILED = 'FAILED';
export const UPDATE_STATUS = 'UPDATE_STATUS';

// API end points
export const USER_LOGOUT = 'auth/logout/';
export const USER_CONFIG = 'common/user-config/';
export const USER_RESET_PASSWORD = 'auth/confirm-reset-password/';

export const BRAND_META_INFO = 'brand-meta-info/';
export const LIST_CREATE_BRAND = 'admin-brands/';
export const BRAND_UPDATE_DETAIL = 'admin-brands/';

export const SHOT_LIST_API_ENDPOINT = 'shots/';
export const SHOT_LIST_CONFIG_ENDPOINT = 'groups-features/meta-info/shot/'; // last key is type of meta info

export const ACTOR_TYPE = '/actor-type/';
export const ACTOR_SEARCH = '/actor-search/';

export const SHOT_COLLABORATOR_TYPES = '/shots/collaborators-choices/';
export const COLLABORATOR_USERS =
  'shots/collaborator-users/{collaboratorType}/';
export const SHOT_COLLABORATOR = '/shots/collaborators/{shotId}/';
export const DELETE_SHOT_COLLABORATOR =
  '/shots/collaborators/{shotId}/{collaboratorId}/';

export const SWIMLANE_META_INFO = 'shots/swimlane/meta-info/##/';
export const PRODUCTION_SHOTS = 'shots/production-shots/##/';
export const SHOT_EDITED_CONTENT_API_ENDPOINT = 'shots/edited-content/';

export const CONTENT_REQUEST_LIST_CONFIG_ENDPOINT =
  'content-request/meta-info/';
export const CONTENT_REQUEST_LIST_API_ENDPOINT = 'content-requests/';
export const CONTENT_REQUEST_ACCOUNT_MANAGER_LIST =
  'content-requests/account_managers/';
export const PRODUCTION_COLLABORATOR_END_POINT = 'shots/collaborators/';

export const LOCATIONS_META_INFO_API_ENDPOINT = 'locations/meta-info/';
export const LOCATIONS_API_ENDPOINT = 'locations/';

export const PROP_LIST_END_POINT = 'props/';
export const PROP_LIST_CONFIG_ENDPOINT = 'props/meta-info/';

// View Model Profile API Endpoints
export const TALENT_DATA_API_ENDPOINT = 'content-request/shared_data/';
export const TALENT_META_INFO_API_ENDPOINT =
  'content-request/shared_data/meta-info/';

// Filters data
export const BRANDS_MAPPED_TO_SHOTS = 'shots/brands/##/';
export const LOCATION_MAPPED_TO_SHOTS = 'shots/locations/##/';

// Tenants
export const TENANTS = '/tenants/';

// ShotContents
export const SHOT_CONTENTS = '/shots/shot-content/';

// Content end points
export const S3_RAW_CONTENTS = '/shots/raw-contents/';

export const buildShotS3GenerateSignedUrlPath = (
  shotId,
  filename,
  contentType,
) =>
  StringHelper.format(
    'shots/##/generate-s3-url/?filename=##&type=##',
    shotId,
    filename,
    contentType,
  );

export const S3_GENERATE_SIGNED_URL_IMAGE_COMMON = (
  filename,
  refId,
  contentType,
) =>
  StringHelper.format(
    'common/reference-images/generate-s3-url/?filename=##&ref_id=##&type=##',
    filename,
    refId,
    contentType,
  );

// Color
export const COLOR_END_POINT = 'common/colors/';

// Choices for choice field
export const CHOICE_END_POINT = 'common/choices/';

export const COMMENT = '/comments/';
export const MARKUP_COMMENT = '/comments-markup/';
export const PRODUCT_LIST_CONFIG_ENDPOINT = 'products/meta_info/';
export const PRODUCT_LIST_API_ENDPOINT = 'products/';

// Get Tenant Users
export const TENANT_USER_ENDPOINT = 'tenant-users/';

// Notification
export const NOTIFICATIONS = '/notifications/';
export const REGISTER_NOTIFICATION_TOKEN = '/notifications/register/';

// Extra UserInfo
export const USER_INFO = '/user-info/';

// Key events
export const DOWN_ARROW = 40;
export const UP_ARROW = 38;
export const ENTER = 13;

// Tabs in Content Request Details
export const CONTENT_REQUEST_DETAILS_TABS = {
  SHOT_DETAILS: 'SHOT_DETAILS',
  SHOT_INVENTORY: 'SHOT_INVENTORY',
};

export const CONTENT_REQUEST_DETAILS_LISTS = {
  SHOTS_TYPE: 'shots',
  PRODUCT_TYPE: 'product',
};

// backlog and calendar screen
export const BACKLOG = 'backlog';
export const DAY = 'DAY';
export const WEEK = 'WEEK';
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const LOADER = 'LOADER';
export const REFRESH = 'REFRESH';
export const OVERLAY = 'OVERLAY';

export const FCM_TOKEN_KEY = 'fcmToken';

export const AppEvents = {
  EVENT_NOTIFICATION_RECEIVED: 'NOTIFICATION_RECEIVED',
  REFRESH_BASE_PAGE: 'REFRESH_BASE_PAGE',
};

export const DATE_TIME_PICKER_FORMAT = 'MMM dd, YYYY HH:mm';
export const DATE_TIME_FORMAT = 'MMM DD, YYYY HH:mm';
export const DATE_TIME_12H_FORMAT = 'MMM DD, YYYY hh:mm A';
export const DATE_PICKER_FORMAT = 'MMM dd, YYYY';
export const DATE_FORMAT = 'MMM DD, YYYY';
export const TIME_FORMAT = 'HH:mm';
export const TIME_12H_FORMAT = 'hh:mm A';
export const CALENDAR_HEADER_DATE_FORMAT = 'ddd DD';
export const CALENDAR_WEEKLY_START_DATE_FORMAT = 'MMM DD';
export const CALENDAR_OVERLAY_HEADER_DATE_FORMAT = 'dddd DD';
export const APPROVED = 'approved';

export const COMMON_ACTIONS = {
  OPEN_DETAILS_PANEL: 'OPEN_DETAILS_PANEL',
  CLOSE_DETAILS_PANEL: 'CLOSE_DETAILS_PANEL',
  UPDATED_DETAILS_PANEL: 'UPDATED_DETAILS_PANEL',
  REFRESH: 'REFRESH',
  CREATE_NEW: 'CREATE_NEW',
  DELETE: 'DELETE',
  CANCEL: 'CANCEL',
  SELECT: 'SELECT',
  ADDED: 'ADDED',
  TOGGLE_CONFIRM: 'TOGGLE_CONFIRM',
  CONFIRM_OK: 'CONFIRM_OK',
  RELOAD_STATE: 'RELOAD_STATE',
};

export const GLOBAL_EVENT_TYPE = {
  SHOT: 'shot',
};

export const SELECT_ITEMS_TYPE = {
  SHOT_LIST: 'shotList',
};

export const SELECTED_IMAGES_STATUS = [
  CONTENT_STATUS.SELECTED,
  CONTENT_STATUS.MAPPED,
];
export const CHANGE_PASSWORD = 'CHANGE PASSWORD';

export const CHAR_LIMITS = {
  LESS_THAN_100: 80,
  EQUAL_TO_100: 100,
  LESS_THAN_200: 150,
  EQUAL_TO_200: 200,
};

export const CHOICE_FIELDS = {
  CHOICE_SECTION: '#choiceSection',
  CAMERA_ANGLE: '#camera_angle',
  SHADOWS: '#shadows',
  CROPPING: '#cropping',
  LIGHTING: '#lighting',
};

export const PRODUCTION_BOARD_STATE = {
  PRE: 'PRE',
  POST: 'POST',
  SPRINT: 'SPRINT',
  PRODUCTION_CALENDAR: 'PRODUCTION_CALENDAR',
};

// Collaborators
export const ACCOUNT_MANAGER = 'ACCOUNT MANAGER';

// Avatars
export const ACTIVE_SCREEN = {
  CONTENT_REQUEST: 'CONTENT_REQUEST',
};

export const DAYS = 'days';

// Avatars
export const AVATAR_STAGE = {
  CONTENT_REQUEST: 'CONTENT_REQUEST',
  PRE: PRODUCTION_BOARD_STATE.PRE,
  POST: PRODUCTION_BOARD_STATE.POST,
  PRODUCTION_VIEW: 'PRODUCTION_VIEW',
};

export const SORT_PAGE_TYPES = {
  BUNDLING: 'BUNDLING',
  CALENDAR: 'CALENDAR',
  SWIMLANE: 'SWIMLANE',
};
