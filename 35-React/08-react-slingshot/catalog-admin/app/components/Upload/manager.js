import Logger from '../../logging/logger';

import { CANCELED, DONE, UPLOADING, WAITING } from '../../common/constants';
import { FILE_UPLOAD_EVENT } from './constants';
import { StringHelper } from '../../helpers/utils';
import { UPLOADING_NEXT } from '../../actions/types';

const logger = Logger.createLogger('UploadManager');

const CALLBACK_ID = 'UploadManager';
const ALLOWED_CONCURRENT_UPLOAD = 1;

const Singleton = (function() {
  // Instance stores a reference to the UploadManager
  let instance;

  return {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance() {
      if (!instance) {
        instance = new UploadManager();
      }
      return instance;
    },
  };
})();
const CONCURRENT_FILE_UPLOAD_DELAY = 2000;

export default Singleton;
class UploadManager {
  constructor() {
    this.__initializeState();
  }

  updateStateFromPropsAndListener = (listener, props) => {
    this.listener = listener;
    this.props = props;
    if (props) {
      this.filesControllers = [];
      Object.keys(props.controllerDict).map(key => {
        const fileController = props.controllerDict[key];
        if (fileController.file.status !== DONE) {
          this.filesControllers[fileController.uid] = fileController;
        }
      });
    }
  };

  /**
   * Add file controller in queue and check if next file can be start
   */
  populateQueue = fileController => {
    // If file with same uid is already exists remove this from queue
    const existingFileController = this.filesControllers[fileController.uid];
    if (existingFileController) {
      existingFileController.cancelUpload();
    }
    this.waitingList.unshift(fileController);
    fileController.registerCallbackListener(
      CALLBACK_ID,
      this.onStatusCallbackListener,
    );
    this.filesControllers[fileController.uid] = fileController;
    this.props.populateQueue(fileController);
    this.__startNextUpload();
  };

  /**
   * Function will cancel all the file upload and reset the state on initial
   */
  cancelAll = () => {
    this.eventSuspended = true;
    Object.keys(this.filesControllers).forEach(key => {
      const fileController = this.filesControllers[key];
      fileController.cancelUpload();
    });
    // Clear the uploading queue also
    this.props.clearQueue();
    this.__initializeState();
  };

  /**
   * Function will provide all the file controller which uid is starts with provided key prefix
   * @param keyPrefix key prefix for which file controller need to be fetch
   */
  fetchFileControllers = keyPrefix => {
    const existingUploadControllers = {};
    Object.keys(this.filesControllers).forEach(key => {
      if (
        key.startsWith(keyPrefix) &&
        this.filesControllers[key].file.status !== DONE
      ) {
        existingUploadControllers[key] = this.filesControllers[key];
      }
    });
    return existingUploadControllers;
  };

  /**
   * CallbackFn for event on file with cancel and done as both required to update the global queue state
   * @param eventType implemented events are CANCEL and DONE
   * @param fileController file controller for which event happened
   */
  onStatusCallbackListener = (eventType, fileController) => {
    switch (eventType) {
      case FILE_UPLOAD_EVENT.CANCEL:
        this.__onCancel(fileController);
        break;
      case FILE_UPLOAD_EVENT.DONE:
        this.__onDoneCallback(fileController);
        break;
      default:
        logger.log(StringHelper.format('Not implemented event: ##', eventType));
    }
  };

  __onCancel = fileController => {
    // Remove file from redux
    this.props.removeFromQueue(fileController);
    // Remove file from state
    this.waitingList = this.waitingList.filter(
      controller => controller.uid !== fileController.uid,
    );
    this.runningList = this.runningList.filter(
      controller => controller.uid !== fileController.uid,
    );
    delete this.filesControllers[fileController.uid];
    // Start next file upload if any available
    this.__startNextUpload();
  };

  __startNextUpload = () => {
    if (this.waitingList.length <= 0 || this.eventSuspended) {
      return;
    }
    // Update the waiting and running queue with file upload controller references
    this.__updateQueue();
    // Iterate on running list and check if new file is available for upload
    this.runningList.forEach(fileController => {
      const file = fileController.file;
      if (file.status === WAITING) {
        fileController.startUpload();
        file.status = UPLOADING;
        // this.props && this.props.updateQueueObject(fileController);
        this.listener && this.listener(UPLOADING_NEXT, fileController);
      }
    });
    // If queue is empty reset lastFileUploadedController;
    if (this.runningList.length === 0 && this.waitingList.length === 0) {
      this.lastFileUploadedController = null;
    }
  };

  __updateQueue = () => {
    // TODO need to check in which case runningList is not updating self
    this.runningList = this.runningList.filter(
      controller => controller.file.status !== DONE,
    );
    while (ALLOWED_CONCURRENT_UPLOAD - this.runningList.length) {
      const nextFileController = this.waitingList.pop();
      // Check if next uploading file parentUIid is similar to just uploaded file
      // then schedule next as in concurrent upload file with same root will creating race condition
      const lastUploadingFile =
        this.lastFileUploadedController && this.lastFileUploadedController.file;
      if (
        lastUploadingFile &&
        lastUploadingFile.extraConfig.versionUid &&
        lastUploadingFile.extraConfig.versionUid ===
          nextFileController.file.extraConfig.versionUid
      ) {
        // Check if parent id is same or not if yes then check not the last element in queue if last delay for 2 seconds
        if (this.waitingList.length === 0) {
          this.lastFileUploadedController = null;
          this.waitingList.push(nextFileController);
          setTimeout(this.__startNextUpload, CONCURRENT_FILE_UPLOAD_DELAY);
          break;
        } else {
          this.waitingList.unshift(nextFileController);
        }
      } else {
        this.runningList.push(nextFileController);
      }
    }
  };

  __onDoneCallback = fileController => {
    this.lastFileUploadedController = fileController;
    // Remove done file from running list not required anymore
    this.runningList = this.runningList.filter(
      controller =>
        controller.uid !== fileController.uid ||
        [DONE, CANCELED].indexOf(controller.file.status) === -1,
    );
    delete this.filesControllers[fileController.uid]
    // Notify redux event on file upload is done
    this.props.onFileUploaded();
    // Check if next upload can be start or not
    this.__startNextUpload();
  };

  __initializeState() {
    // Flag indicate the event to start next upload in the manager are suspended if true
    // else it will allow to push the event in uploading queue
    this.eventSuspended = false;
    this.lastFileUploadedController = null;
    this.filesControllers = {};
    this.waitingList = [];
    this.runningList = [];
  }
}
