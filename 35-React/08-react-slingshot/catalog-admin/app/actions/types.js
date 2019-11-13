// Common
export const CHANGE_PASSWORD_MODAL = 'navBar.changePassword';
export const CLEAR_NAVIGATION_STACK = 'base.clearNavigationStack';
export const CLOSE_BULK_UPDATE = 'base.closeBulkUpdate';
export const CLOSE_CONTENT_WIDGET = 'base.closeContentWidget';
export const CLOSE_LIGHT_BOX = 'base.closeLightBox';
export const CLOSE_NOTIFICATION_LIST = 'base.closeNotifications';
export const HIDE_LOADER = 'common.hideLoader';
export const OPEN_BULK_UPDATE = 'base.openBulkUpdate';
export const OPEN_CONTENT_WIDGET = 'base.openContentWidget';
export const OPEN_LIGHT_BOX = 'base.openLightBox';
export const OPEN_NOTIFICATION_LIST = 'base.openNotifications';
export const PUSH_NAVIGATION_STACK = 'base.pushNavigationStack';
export const REFRESH_DETAILS = 'common.refreshDetails';
export const REMOVE_FROM_NAVIGATION_STACK = 'base.removeFromNavigationStack';
export const SET_LIGHT_BOX_IMAGE_DIMENSION = 'base.setLightBoxImageDimension';
export const SHOW_LOADER = 'common.showLoader';
export const TOGGLE_CONFIRM_DIALOG = 'base.confirmDialog';
export const TOGGLE_MARK_UP = 'base.showMarkUp';

// Notification
export const FETCH_USER_NOTIFICATIONS = 'notification.fetch';
export const FETCH_USER_NOTIFICATIONS_FAILED = 'notification.fetchFailed';
export const UPDATE_USER_NOTIFICATIONS = 'notification.update';
export const UPDATE_USER_NOTIFICATIONS_COUNT = 'notification.updateCount';
export const UPDATE_USER_NOTIFICATIONS_FAILED = 'notification.updateFailed';

// Shopping Cart
export const ADD_CART_ITEM = 'cart:addItem';
export const FETCH_USER_CART = 'cart.fetch';
export const REMOVE_CART_ITEM = 'cart:removeItem';
export const UPDATE_USER_CART = 'cart.update';
export const UPDATE_USER_CART_COUNT = 'cart.updateCount';

// Content Library
export const FETCH_BRANDS = 'contentLibrary:fetchBrands';
export const FETCH_BRANDS_FAILED = 'contentLibrary:fetchBrandsFailed';
export const FETCH_CONTENTS = 'contentLibrary:fetchContents';
export const FETCH_CONTENTS_FAILED = 'contentLibrary:fetchContentsFailed';
export const FETCH_SHOT_LIST = 'contentLibrary:fetchShotList';
export const FETCH_SHOT_LIST_FAILED = 'contentLibrary:fetchShotListFailed';
export const FETCH_PHOTO_LIST = 'contentLibrary: fetchPhotoList';
export const FETCH_PHOTO_LIST_FAILED = 'contentLibrary:fetchPhotoListFailed';
export const SET_BRAND = 'contentLibrary:setBrand';
export const SET_CONTENT = 'contentLibrary:setContent';
export const SET_SHOT = 'contentLibrary:setShot';
// TODO: remove this if status of the photo can be changed ('AVAILABLE' to 'ADDED_ON_CART')
export const SET_PHOTO_DETAIL = 'contentLibrary:setPhotoDetail';
export const SET_TIMELINE_STATUS = 'contentLibrary:setTimelineStatus';

// Backlog constants
export const RESET_BUNDLING = 'bundling.resetBundling';
export const FETCH_BUNDLING = 'bundling.fetchBundling';
export const FETCH_BUNDLING_FAILED = 'bundling.fetchBundlingFailed';
export const BUNDLING_REARRANGE = 'bundling.reArrange';
export const BUNDLING_REARRANGE_FAILED = 'bundling.reArrangeFailed';
export const UPDATE_BUNDLING_SHOT_PAYLOAD = 'bundling.updateShotPayload';
export const REARRANGE_BUNDLING_INSIDE_DRAG = 'bundling:rearrangeInsideDrag';

// Schedule page constants
export const ADD_BUNDLING_DRAGGABLE_SHOT = 'schedule.addBundlingDraggableShots';
export const ADD_CALENDAR_DRAGGABLE_SHOT = 'schedule.addCalendarDraggableShots';
export const CLEAR_CALENDAR_DRAGGABLE_SHOT =
  'schedule.clearCalendarDraggableShots';
export const CLEAR_DRAGGABLE_SHOT = 'schedule.clearDraggableShots';

// Shot swim lane constants
export const APPEND_TO_SWIMLANE = 'swimlane.appendToSwimlane';
export const CLEAR_SWIMLANE_DATA = 'swimlane.clear';
export const FETCH_SWIMLANE = 'swimlane.fetch';
export const FETCH_SWIMLANE_FAILED = 'swimlane.fetchFailed';
export const FETCH_SWIMLANE_META_INFO = 'swimlane.fetchMetaInfo';
export const FETCH_SWIMLANE_META_INFO_FAILED = 'swimlane.fetchMetaInfoFailed';
export const ON_COLLABORATOR_SELECT = 'swimlane.onCollaboratorSelect';
export const ON_SWIMLANE_SEARCH = 'swimlane.onSwimlaneSearch';
export const RESET_SWIMLANE = 'swimlane.reset';
export const REVERSE_SWIMLANE_SORT_ORDER = 'swimlane.reverseSwimlaneSort';
export const SWIMLANE_MOVE_SHOTS = 'swimlane.moveShot';
export const SWIMLANE_REARRANGE_FAILED = 'swimlane.reArrangeFailed';
export const UPDATE_SWIMLANE_SORT_TYPE = 'swimlane.updateSwimlaneSortType';

// Shot constants
export const ADD_SHOT = 'shots:addShot';
export const FETCH_SHOTS = 'shots.fetch';
export const FETCH_SHOTS_FAILED = 'shots.fetchFailed';
export const FETCH_SHOTS_META_INFO = 'shots.fetchMetaInfo';
export const FETCH_SHOTS_META_INFO_FAILED = 'shots.fetchMetaInfoFailed';
export const UPDATE_SHOT_PAYLOAD = 'shots.updateShotPayload';

// Status constants
export const STATUS_DONE = 'status:done';
export const STATUS_FAILED = 'status:failed';

// Content request Constants
export const ADD_CONTENT_REQUEST = 'contentRequest:add';
export const CONTENT_REQUEST_UPDATE = 'contentRequest:update';
export const EMPTY_CONTENT_REQUESTS = 'contentRequests:empty';
export const ON_FETCH_CONTENT_REQUESTS = 'contentRequests:fetch';
export const ON_FETCH_CONTENT_REQUESTS_CONFIG = 'contentRequests:config';

// Brands
export const CREATE_BRAND = 'brand.create';
export const CREATE_BRAND_FAILED = 'brand.createFailed';
export const FETCH_BRAND = 'brand.fetch';
export const FETCH_BRAND_CONFIG = 'brand.fetchConfig';
export const FETCH_BRAND_CONFIG_FAILED = 'brand.fetchConfigFailed';
export const FETCH_BRAND_FAILED = 'brand.fetchFailed';
export const RESET_BRAND = 'brand.reset';
export const UPDATE_BRAND = 'brand.update';
export const UPDATE_BRAND_FAILED = 'brand.updateFailed';

// Actor
export const ADD_ACTOR = 'actor:addActor';
export const DELETE_ACTOR = 'actor:deleteActor';
export const RESET_ACTOR_STORE = 'actor:resetActorStore';
export const UPDATE_ACTOR = 'actor:updateActorGroup';
export const UPDATE_ACTOR_IMAGES = 'actor:updateActorImages';
export const UPDATE_ACTOR_STORE = 'actor:updateActorStore';

// Prop
export const ADD_PROP = 'prop:addProp';
export const ON_FETCH_PROPS_CONFIG = 'prop:onFetchPropsConfig';
export const ON_FETCH_PROPS_DATA = 'prop:onFetchPropsData';
export const ON_UPDATE_PROP = 'prop:onUpdateProp';
export const RESET_PROPS = 'prop:resetPropsData';

// Products
export const CREATE_PRODUCT = 'product:create';
export const EMPTY_PRODUCTS = 'products.empty';
export const ON_FETCH_PRODUCTS = 'products:fetch';
export const ON_FETCH_PRODUCTS_CONFIG = 'products.config';
export const ON_UPDATE_PRODUCTS = 'products.update';

// Upload
export const CLEAR_QUEUE = 'upload:clearQueue';
export const EMPTY_SHOTS = 'shots:reset';
export const FILE_UPLOADED = 'upload:fileUploaded';
export const POPULATE_QUEUE = 'upload:populateQueue';
export const REMOVE_FROM_QUEUE = 'upload:removeFromQueue';
export const UPLOADING_NEXT = 'upload:uploadingNext';
export const DELETE_SHOT = 'shot:delete';

// constants
export const NOTIFICATION_LAST_READ_TIME = 'notificationLastReadTime';
export const NOTIFICATION_STORAGE_KEY = 'notifications';

// Calendar
export const UPDATE_CALENDAR_SHOT_LIST = 'calendar:updateShotList';

// Locations
export const ADD_LOCATION = 'location:addLocation';
export const ADD_LOCATION_FAILED = 'location:addLocationFailed';
export const FETCH_LOCATIONS = 'location:fetchLocations';
export const FETCH_LOCATIONS_FAILED = 'location:fetchLocationsFailed';
export const FETCH_LOCATIONS_HEADER = 'location:fetchLocationsHeader';
export const FETCH_LOCATIONS_HEADER_FAILED =
  'location:fetchLocationsHeaderFailed';
export const RESET_LOCATIONS = 'location:resetLocationsData';
export const UPDATE_LOCATION = 'location:updateLocation';
export const UPDATE_LOCATION_FAILED = 'location:updateLocationFailed';
export const UPDATE_LOCATION_IMAGES = 'location:updateLocationImages';
export const UPDATE_LOCATION_IMAGES_FAILED =
  'location:updateLocationImagesFailed';

// TalentGrid Share Page
export const ON_FETCH_TALENT = 'talent:fetch';
export const ON_FETCH_TALENT_CONFIG = 'talent:config';

// Checkbox select
export const SELECT_ALL = 'select:all';
export const SELECT_ROW = 'select:row';
export const UN_SELECT_ALL = 'unSelect:all';
export const UN_SELECT_ALL_EVENT = 'unSelect:allEvent';
export const UN_SELECT_ROW = 'unSelect:row';

// Comment
export const SET_EDITED_VERSION_ID = 'comment:currentExpandedVersionId';

// Filter
export const APPLY_FILTERS = 'filter:applyFilter';
export const CLEAR_ALL_FILTERS = 'filter:clearAllFilter';
export const STORE_ACTIVE_SCREEN = 'filter:activeScreen';
export const STORE_FILTER_DATA = 'filter:storeFilterData';
export const TOGGLE_FILTER = 'filter:toggle';

// Avatar Group
export const ON_AVATAR_SELECT = 'avatar:onAvatarSelect';
export const RESET_AVATAR_LIST = 'avatar:resetAvatarList';
export const UPDATE_AVATAR_LIST = 'avatar:updateAvatarList';

// Sort
export const SET_SORT_LIST = 'sort:setSortList';
export const APPLY_SORT = 'sort:applySort';
export const REVERSE_SORT = 'sort:reverseSort';
