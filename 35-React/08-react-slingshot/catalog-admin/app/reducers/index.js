import { combineReducers } from 'redux';
import { ACTOR_DEFAULT_STATE, actorReducer } from './actorReducer';
import { PROP_DEFAULT_STATE, propReducer } from './propReducer';
import { shotReducer, SHOTS_DEFAULT_STATE } from './shotsReducer';
import {
  BASE_INITIAL_STATE,
  baseReducer,
} from '../containers/BasePage/reducer';
import {
  SCHEDULE_DEFAULT_STATE,
  scheduleReducer,
} from '../containers/SchedulePage/reducer';
import notificationReducer, {
  NOTIFICATION_INITIAL_STATE,
} from '../components/Notifications/reducer';
import { LOCATION_DEFAULT_STATE, locationReducer } from './locationReducer';
import {
  BUNDLING_DEFAULT_STATE,
  bundlingReducer,
} from '../components/BundlingView/reducer';
import { BRAND_DEFAULT_STATE, brandReducer } from './brandReducer';
import {
  SWIMLANE_DEFAULT_STATE,
  shotSwimlaneReducer,
} from '../components/ShotSwimlane/reducer';
import { COMMON_DEFAULT_STATE, commonReducer } from './commonReducer';
import {
  CALENDAR_DEFAULT_STATE,
  calendarReducer,
} from '../components/CalendarView/reducer';
import {
  contentLibraryReducer,
  CONTENT_LIBRARY_DEFAULT_STATE,
} from './contentLibraryReducer';
import {
  contentRequestReducer,
  CR_DEFAULT_STATE,
} from './contentRequestReducer';
import { PRODUCT_DEFAULT_STATE, productReducer } from './productReducer';
import {
  PRODUCTION_VIEW_DEFAULT_STATE,
  productionViewReducer,
} from '../containers/ProductionViewPage/reducer';
import { TALENT_DEFAULT_STATE, talentReducer } from './talentReducer';
import {
  UPLOAD_QUEUE_INITIAL_STATE,
  uploadReducer,
} from '../components/Upload/reducer';
import {
  SELECT_DEFAULT_STATE,
  selectedItemsReducer,
} from '../components/SelectItem/reducer';
import {
  EDITED_VERSION_DEFAULT_STATE,
  expandableCommentSectionReducer,
} from '../components/ExpandableCommentSection/reducers';
import {
  filterReducer,
  FILTER_DEFAULT_STATE,
} from '../components/Filter/reducer';
import {
  avatarWrapperReducer,
  AVATAR_WRAPPER_DEFAULT_STATE,
} from './avatarWrapperReducer';
import {
  SORT_DEFAULT_STATE,
  sortReducer,
} from '../components/SortDropDown/reducer';
import { CART_DEFAULT_STATE, cartReducer } from './cartReducer';

const rootReducer = combineReducers({
  actors: actorReducer,
  avatar: avatarWrapperReducer,
  bundling: bundlingReducer,
  base: baseReducer,
  brands: brandReducer,
  calendar: calendarReducer,
  cart: cartReducer,
  common: commonReducer,
  contentLibrary: contentLibraryReducer,
  contentRequest: contentRequestReducer,
  expandableCommentSection: expandableCommentSectionReducer,
  filters: filterReducer,
  locations: locationReducer,
  notification: notificationReducer,
  products: productReducer,
  productionView: productionViewReducer,
  props: propReducer,
  schedule: scheduleReducer,
  selectedItems: selectedItemsReducer,
  shotsInfo: shotReducer,
  sort: sortReducer,
  swimlane: shotSwimlaneReducer,
  talent: talentReducer,
  uploads: uploadReducer,
});

export default rootReducer;

export const INITIAL_STATE = {
  actors: ACTOR_DEFAULT_STATE,
  avatar: AVATAR_WRAPPER_DEFAULT_STATE,
  bundling: BUNDLING_DEFAULT_STATE,
  base: BASE_INITIAL_STATE,
  brands: BRAND_DEFAULT_STATE,
  calendar: CALENDAR_DEFAULT_STATE,
  cart: CART_DEFAULT_STATE,
  common: COMMON_DEFAULT_STATE,
  contentLibrary: CONTENT_LIBRARY_DEFAULT_STATE,
  contentRequest: CR_DEFAULT_STATE,
  expandableCommentSection: EDITED_VERSION_DEFAULT_STATE,
  filters: FILTER_DEFAULT_STATE,
  locations: LOCATION_DEFAULT_STATE,
  notification: NOTIFICATION_INITIAL_STATE,
  products: PRODUCT_DEFAULT_STATE,
  productionView: PRODUCTION_VIEW_DEFAULT_STATE,
  props: PROP_DEFAULT_STATE,
  schedule: SCHEDULE_DEFAULT_STATE(),
  selectedItems: SELECT_DEFAULT_STATE,
  shotsInfo: SHOTS_DEFAULT_STATE(),
  sort: SORT_DEFAULT_STATE,
  swimlane: SWIMLANE_DEFAULT_STATE,
  talent: TALENT_DEFAULT_STATE,
  uploads: UPLOAD_QUEUE_INITIAL_STATE,
};
