export const CONTENT_STATUS = {
  MAPPED: 'MAPPED',
  UN_MAPPED: 'UN_MAPPED',
  SELECTED: 'SELECTED',
  EDITED: 'EDITED',
};
export const EVENT_ACTION = {
  CONTENT_EDIT: 'shots:contentEdit',
  CONTENT_SELECT: 'shots:contentSelect',
  CONTENT_MAPPED: 'shots:contentMapped',
  REFERENCE_NOTES: 'shots:referenceNotes',
  REFERENCE_MAPPED: 'shots:referenceMapped',
  ORIGINAL_IMAGE_REMOVED: 'shots:originalImageRemoved',
};

export const WIDGET_FOOTER_BUTTON_TYPE = {
  POSITIVE: 'widget:positive',
  NEGATIVE: 'widget:negative',
};
export const EDITED_CONTENT_ACTIONS = {
  DELETE_CONTENT: 'DELETE_CONTENT',
  CREATE_CONTENT: 'CREATE_CONTENT',
  UPDATE_CONTENT: 'UPDATE_CONTENT',
  UPDATE_CONTENT_STATUS: 'UPDATE_CONTENT_STATUS',
  UPDATE_CONTENT_NOTES: 'UPDATE_CONTENT_NOTES',
};

export const EDIT_CONTENT_TYPES = {
  ROW: 'raw',
  PUBLIC: 'public',
};

export const ALL_CONTENT_TYPES = [
  EDIT_CONTENT_TYPES.ROW,
  EDIT_CONTENT_TYPES.PUBLIC,
];

export const EDIT_CONTENT_FILE_SUPPORTED_FORMAT = {
  [EDIT_CONTENT_TYPES.ROW]: 'image/tiff, .psd, .cr2',
  [EDIT_CONTENT_TYPES.PUBLIC]: 'image/jpeg, image/png',
};
export const SELECT_WIDGET_CONTENT = 'widget:onSelection';
export const WIDGET_ACTIONS = {
  CLOSE: 'CLOSE',
  CLOSE_WHITE: 'CLOSE_WHITE',
  CLOSE_ALL: 'CLOSE_ALL',
  SELECT: 'SELECT',
  ON_SELECT: 'ON_SELECT',
  SELECT_DONE: 'SELECT_DONE',
  MINIMIZE: 'MINIMIZE',
  MAXIMIZE: 'MAXIMIZE',
};

export const MOVE_SHOT_CONTENT = 'shots/move-shot-content/';
