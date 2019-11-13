export const FILE_UPLOAD_EVENT = {
  IN_PROGRESS: 'IN_PROGRESS',
  CANCEL: 'CANCEL',
  DONE: 'DONE',
};

export const UPLOAD_FILE_TYPES = {
  UNMAPPED_CONTENT: 'unmapped_content',
  EDITED_CONTENT: 'edited_content',
  EDITED_CONTENT_EMPTY: 'edited_content_empty',
  EDITED_CONTENT_VERSION: 'edited_content_version',
};

export const getProgressObjectFromStatus = status => {
  switch (status) {
    case 'DONE':
      return {
        COLOR_CLASS: 'queue-file-progress-done',
        ICON_CLASS: 'icon-checkmark',
        TOOLTIP: 'Done',
        TRIGGER_EVENT: fileEventHandler.bind('NONE'),
      };
    case 'WAITING':
      return {
        COLOR_CLASS: 'queue-file-progress-waiting',
        ICON_CLASS: '',
        TOOLTIP: 'Queued',
        TRIGGER_EVENT: fileEventHandler.bind('CANCEL'),
        ON_HOVER_ICON_CLASS: 'icon-cross',
      };
    case 'UPLOADING':
    case 'IN_PROGRESS':
      return {
        COLOR_CLASS: 'queue-file-progress-uploading',
        ICON_CLASS: '',
        TOOLTIP: 'Uploading',
        TRIGGER_EVENT: fileEventHandler.bind('CANCEL'),
        ON_HOVER_ICON_CLASS: 'icon-cross',
      };
    case 'FAILED':
    case 'CANCEL':
      return {
        COLOR_CLASS: 'queue-file-progress-failed',
        ICON_CLASS: 'icon-retry',
        TOOLTIP: 'Try again',
        TRIGGER_EVENT: fileEventHandler.bind('START'),
      };
    default:
      return {
        COLOR_CLASS: 'queue-file-progress-waiting',
        ICON_CLASS: '',
        TOOLTIP: 'Queued',
        TRIGGER_EVENT: fileEventHandler.bind('START'),
        ON_HOVER_ICON_CLASS: 'icon-cross',
      };
  }
};

function fileEventHandler(fileController) {
  switch (this) {
    case 'START':
      fileController.startUpload();
      break;
    case 'CANCEL':
      fileController.cancelUpload();
      break;
    default:
      break;
  }
}
