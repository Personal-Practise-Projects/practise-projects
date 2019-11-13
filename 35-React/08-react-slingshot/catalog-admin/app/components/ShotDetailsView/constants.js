import { SHOT_STATUS } from '../../common/shot/constants';

export const DETAILS_VIEW_EVENT = {
  OPEN_IMAGE_WIDGET: 'OPEN_IMAGE_WIDGET',
  CLOSE_IMAGE_WIDGET: 'CLOSE_IMAGE_WIDGET',
  OPEN_SHOT_DETAIL: 'OPEN_SHOT_DETAIL',
  REFRESH_SHOT_DETAILS: 'REFRESH_SHOT_DETAILS',
  UPDATED_SHOT_DETAILS: 'UPDATED_SHOT_DETAILS',
  OPEN_UPLOAD_WIDGET: 'OPEN_UPLOAD_WIDGET',
  CLOSE_UPLOAD_WIDGET: 'CLOSE_UPLOAD_WIDGET',
  CLOSE_DETAILS_PANEL: 'CLOSE_DETAILS_PANEL',
  OPEN_DETAILS_PANEL: 'OPEN_DETAILS_PANEL',
};

export const DEFAULT_CARD_COLOR = '#8169ea';

// TODO need to get all these status form backend
export const PreProductionStatuses = [
  { id: SHOT_STATUS.BACKLOG, title: 'Backlog' },
  { id: SHOT_STATUS.PRODUCT_PENDING, title: 'Product Pending' },
  { id: SHOT_STATUS.CREATIVE, title: 'Creative' },
  { id: SHOT_STATUS.CREATIVE_REVIEW, title: 'Creative Review' },
];
export const intermediateStatus = [
  { id: SHOT_STATUS.BUNDLING, title: 'Bundling' },
  { id: SHOT_STATUS.SCHEDULED, title: 'Scheduled', disabled: true },
  { id: SHOT_STATUS.PHOTOSHOOT, title: 'Photoshoot' },
];
export const PostProductionStatuses = [
  { id: SHOT_STATUS.CAPTURED, title: 'Captured' },
  { id: SHOT_STATUS.EDITING, title: 'Editing' },
  { id: SHOT_STATUS.REVIEW, title: 'Review' },
  { id: SHOT_STATUS.DONE, title: 'Done' },
];

export const SHOT_LIST_EVENT = {
  DELETE_SHOT: 'DELETE_SHOT',
};
